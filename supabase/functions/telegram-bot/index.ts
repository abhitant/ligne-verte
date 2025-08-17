import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { TelegramUpdate } from './types.ts'
import { TelegramAPI } from './telegram-api.ts'
import { CommandHandler } from './commands.ts'
import { PhotoHandler } from './photo-handler.ts'
import { LocationHandler } from './location-handler.ts'
import { AIConversationHandler } from './ai-conversation-handler.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mode d'analyse configurable
const BOT_ANALYZER_MODE = Deno.env.get('BOT_ANALYZER_MODE') || 'simple'
console.log('🔬 Bot analyzer mode:', BOT_ANALYZER_MODE)

serve(async (req) => {
  const startTime = Date.now()
  console.log('=== TELEGRAM BOT REQUEST ===', new Date().toISOString())
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TELEGRAM_BOT_TOKEN) {
      throw new Error('Missing required environment variables')
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const telegramAPI = new TelegramAPI(TELEGRAM_BOT_TOKEN)

    const body = await req.text()
    const update: TelegramUpdate = JSON.parse(body)
    console.log('Update received:', JSON.stringify(update, null, 2))

    // VÉRIFICATION D'IDEMPOTENCE EN BASE DE DONNÉES
    const { data: existingUpdate, error: checkError } = await supabaseClient
      .from('telegram_processed_updates')
      .select('update_id')
      .eq('update_id', update.update_id)
      .single()

    if (existingUpdate) {
      console.log('⚡ Update already processed in database, returning 200 OK')
      return new Response('Already processed', { status: 200 })
    }

    // INSERTION IMMÉDIATE POUR PRÉVENIR LES DOUBLONS
    const messageType = update.callback_query ? 'callback_query' : 
                       update.message?.photo ? 'photo' : 
                       update.message?.location ? 'location' : 
                       update.message?.text?.startsWith('/') ? 'command' : 
                       'text'

    const userTelegramId = update.callback_query?.from.id.toString() || 
                          update.message?.from.id.toString() || null

    const { error: insertError } = await supabaseClient
      .from('telegram_processed_updates')
      .insert({
        update_id: update.update_id,
        analyzer_mode: BOT_ANALYZER_MODE,
        user_telegram_id: userTelegramId,
        message_type: messageType
      })

    if (insertError) {
      console.log('⚠️ Insert error (might be duplicate):', insertError)
      // Si l'insertion échoue à cause d'un doublon, c'est OK
      return new Response('Duplicate prevented', { status: 200 })
    }

    console.log('✅ Update registered in database, proceeding with processing...')

    // TRAITEMENT EN ARRIÈRE-PLAN
    const backgroundProcessing = async () => {
      try {
        const commandHandler = new CommandHandler(telegramAPI, supabaseClient)
        const photoHandler = new PhotoHandler(telegramAPI, supabaseClient)
        const locationHandler = new LocationHandler(telegramAPI, supabaseClient)
        const aiHandler = new AIConversationHandler(supabaseClient)

        // Nettoyage automatique
        try {
          await supabaseClient.rpc('cleanup_old_pending_reports')
          await supabaseClient.rpc('cleanup_old_processed_updates')
        } catch (cleanupError) {
          console.log('🧹 Cleanup warning:', cleanupError)
        }

        // Traitement des callback queries (boutons inline)
        if (update.callback_query) {
      console.log('CALLBACK QUERY RECEIVED:', JSON.stringify(update.callback_query, null, 2))
      
      const { callback_query } = update
      const chatId = callback_query.message.chat.id
      const telegramId = callback_query.from.id.toString()
      const callbackData = callback_query.data

      console.log('Callback query received:', callbackData, 'from telegram ID:', telegramId)

      if (callbackData === 'create_web_account') {
        await commandHandler.handleCreateWebAccount(chatId, telegramId)
        
        // Répondre au callback query pour supprimer le loading
        await telegramAPI.answerCallbackQuery(callback_query.id)
        return new Response('OK', { status: 200 })
      }

      if (callbackData === 'show_leaderboard') {
        await commandHandler.handleLeaderboard(chatId)
        
        // Répondre au callback query pour supprimer le loading
        await telegramAPI.answerCallbackQuery(callback_query.id)
        return new Response('OK', { status: 200 })
      }

      if (callbackData === 'show_user_rank') {
        console.log('Processing show_user_rank callback for telegram ID:', telegramId)
        
        // Répondre au callback query immédiatement
        await telegramAPI.answerCallbackQuery(callback_query.id)
        
        // Test simple : envoyer juste un message basique
        await telegramAPI.sendMessage(chatId, '🏆 Test classement - fonctionnalité en cours de développement')
        
        return new Response('OK', { status: 200 })
      }

      if (callbackData === 'show_points' || callbackData === 'points') {
        await commandHandler.handlePoints(chatId, telegramId)
        
        // Répondre au callback query pour supprimer le loading
        await telegramAPI.answerCallbackQuery(callback_query.id)
        return new Response('OK', { status: 200 })
      }

      if (callbackData === 'help_menu') {
        await commandHandler.handleHelp(chatId)
        
        // Répondre au callback query pour supprimer le loading
        await telegramAPI.answerCallbackQuery(callback_query.id)
        return new Response('OK', { status: 200 })
      }

      if (callbackData === 'show_map') {
        await commandHandler.handleMap(chatId)
        
        // Répondre au callback query pour supprimer le loading
        await telegramAPI.answerCallbackQuery(callback_query.id)
        return new Response('OK', { status: 200 })
      }

      if (callbackData === 'start_new_report') {
        // Envoyer une notification push
        await telegramAPI.answerCallbackQuery(callback_query.id, '📸 Mode signalement activé ! Prenez une photo 👇')
        
        // Créer un clavier personnalisé avec bouton caméra
        const replyKeyboard = {
          keyboard: [
            [{ text: '📸 Prendre une photo' }]
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
          input_field_placeholder: 'Appuyez sur 📎 puis 📷 Caméra'
        }
        
        await telegramAPI.sendMessage(chatId, `📸 <b>Nouveau signalement activé !</b>

🎯 <b>Action à faire :</b>
• Appuyez sur 📎 (trombone) en bas à gauche
• Puis sélectionnez 📷 <b>Caméra</b>
• Prenez une photo des déchets

💡 <i>Photo claire et proche des déchets = meilleure analyse !</i>`, replyKeyboard)
        
        return new Response('OK', { status: 200 })
      }

      if (callbackData === 'suggest_start') {
        console.log('🔧 Redirection vers formulaire web de suggestions pour user:', telegramId)
        try {
          await commandHandler.handleSuggestionRedirect(chatId)
          await telegramAPI.answerCallbackQuery(callback_query.id)
          console.log('✅ Lien de suggestions envoyé avec succès')
        } catch (error) {
          console.error('❌ Erreur lors de l\'envoi du lien de suggestions:', error)
          await telegramAPI.answerCallbackQuery(callback_query.id, 'Erreur lors du traitement')
        }
        return new Response('OK', { status: 200 })
      }

      if (callbackData?.startsWith('suggestion_')) {
        const suggestionType = callbackData.replace('suggestion_', '')
        await commandHandler.handleSuggestionType(chatId, telegramId, suggestionType)
        await telegramAPI.answerCallbackQuery(callback_query.id)
        return new Response('OK', { status: 200 })
      }

          return
        }

        if (!update.message) {
          console.log('No message in update, skipping...')
          return
        }

    const { message } = update
    const chatId = message.chat.id
    const telegramId = message.from.id.toString()
    const telegramUsername = message.from.username
    const firstName = message.from.first_name

    // Garder le texte original pour l'IA et normaliser seulement pour les commandes
    const originalText = message.text
    const messageText = message.text?.toLowerCase()

        // Traitement des commandes
        if (messageText === '/start') {
          console.log('Processing /start command')
          await commandHandler.handleStart(chatId, telegramId, telegramUsername, firstName)
          return
        }

        if (messageText === '/points') {
          await commandHandler.handlePoints(chatId, telegramId)
          return
        }

        if (messageText === '/carte' || messageText === '/map') {
          await commandHandler.handleMap(chatId)
          return
        }

        if (messageText === '/aide' || messageText === '/help') {
          await commandHandler.handleHelp(chatId)
          return
        }

        if (messageText === '/changenom') {
          await commandHandler.handleChangeName(chatId, telegramId)
          return
        }

        if (messageText === '/compte') {
          await commandHandler.handleCreateWebAccount(chatId, telegramId)
          return
        }

        // Traitement des photos - passer les infos utilisateur
        if (message.photo && message.photo.length > 0) {
          await photoHandler.handlePhoto(chatId, telegramId, message.photo, telegramUsername, firstName)
          return
        }

        // Traitement de la localisation - passer les infos utilisateur
        if (message.location) {
          const { latitude, longitude } = message.location
          await locationHandler.handleLocation(chatId, telegramId, latitude, longitude, telegramUsername, firstName)
          return
        }

        // Messages texte - gestion intelligente
        if (message.text && !message.text.startsWith('/')) {
          // Vérifier si l'utilisateur existe et n'a pas encore de nom personnalisé
          const { data: existingUser, error: checkError } = await supabaseClient.rpc('get_user_by_telegram_id', {
            p_telegram_id: telegramId
          })

          // Si l'utilisateur n'existe pas OU a un nom par défaut, ET que ce n'est pas un message conversationnel
          if ((!existingUser || !existingUser.pseudo || existingUser.pseudo === `User ${telegramId.slice(-4)}` || existingUser.pseudo === firstName) 
              && !aiHandler.isAIConversationMessage(originalText)) {
            await commandHandler.handleUsernameChoice(chatId, telegramId, originalText, telegramUsername, firstName)
            return
          }

          // Vérifier si c'est un message pour conversation IA (utiliser le texte original)
          if (aiHandler.isAIConversationMessage(originalText)) {
            console.log('🤖 Processing AI conversation message:', originalText)
            const aiResponse = await aiHandler.handleAIConversation(originalText, telegramId)
            
            await telegramAPI.sendMessage(chatId, aiResponse, {
              inline_keyboard: [
                [
                  { text: '🗺️ Voir la carte', url: 'https://ligne-verte.lovable.app/map' },
                  { text: '❓ Aide complète', callback_data: 'help_menu' }
                ]
              ]
            })
            return
          }

          // Sinon, message non reconnu avec suggestion d'interaction IA
          await telegramAPI.sendMessage(chatId, `🤖 <b>Bonjour ! Je suis Débora, votre assistante.</b>

💬 <b>Vous pouvez me parler naturellement !</b>
Posez-moi des questions sur l'environnement, les signalements, ou dites simplement "Bonjour Débora".

📱 <b>Ou utilisez les fonctions rapides :</b>
• 📸 Envoyez une photo pour signaler
• 📍 Partagez votre localisation
• Tapez /aide pour tous les outils

🌱 <b>Ensemble, rendons notre ville plus verte !</b>`, {
            inline_keyboard: [
              [
                { text: '🗺️ Voir la carte', url: 'https://ligne-verte.lovable.app/map' },
                { text: '🏆 Mes points', callback_data: 'show_points' }
              ],
              [
                { text: '💡 Faire une suggestion', callback_data: 'suggest_start' }
              ]
            ]
          })
          return
        }

        // Ignorer silencieusement tous les autres types de messages
        console.log('Message ignored silently')
      } catch (bgError) {
        console.error('❌ Background processing error:', bgError)
        // Mettre à jour la durée même en cas d'erreur
        const duration = Date.now() - startTime
        await supabaseClient
          .from('telegram_processed_updates')
          .update({ processing_duration_ms: duration })
          .eq('update_id', update.update_id)
      }
    }

    // DÉMARRER LE TRAITEMENT EN ARRIÈRE-PLAN SANS ATTENDRE
    EdgeRuntime.waitUntil(backgroundProcessing())

    // RETOURNER 200 OK IMMÉDIATEMENT
    console.log('⚡ Returning 200 OK immediately, processing continues in background')
    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('=== GLOBAL ERROR ===')
    console.error('Error:', error)
    
    return new Response('Internal error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
