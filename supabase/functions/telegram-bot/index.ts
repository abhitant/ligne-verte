
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { TelegramUpdate } from './types.ts'
import { TelegramAPI } from './telegram-api.ts'
import { CommandHandler } from './commands.ts'
import { PhotoHandler } from './photo-handler.ts'
import { LocationHandler } from './location-handler.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Stockage des update_id traités pour éviter les doublons
const processedUpdates = new Set<number>()

serve(async (req) => {
  console.log('=== TELEGRAM BOT REQUEST ===')
  
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
    const commandHandler = new CommandHandler(telegramAPI, supabaseClient)
    const photoHandler = new PhotoHandler(telegramAPI, supabaseClient)
    const locationHandler = new LocationHandler(telegramAPI, supabaseClient)

    // Nettoyage automatique des signalements expirés
    try {
      await supabaseClient.rpc('cleanup_old_pending_reports')
    } catch (cleanupError) {
      console.log('Cleanup warning:', cleanupError)
    }

    const body = await req.text()
    const update: TelegramUpdate = JSON.parse(body)
    console.log('Update received:', JSON.stringify(update, null, 2))

    // Vérifier si c'est un update déjà traité
    if (processedUpdates.has(update.update_id)) {
      console.log('Update already processed, skipping...')
      return new Response('Already processed', { status: 200 })
    }

    // Ajouter l'update_id aux traités
    processedUpdates.add(update.update_id)

    // Nettoyer les anciens update_id (garder seulement les 100 derniers)
    if (processedUpdates.size > 100) {
      const sorted = Array.from(processedUpdates).sort((a, b) => b - a)
      processedUpdates.clear()
      sorted.slice(0, 50).forEach(id => processedUpdates.add(id))
    }

    if (!update.message) {
      console.log('No message in update, skipping...')
      return new Response('No message', { status: 200 })
    }

    const { message } = update
    const chatId = message.chat.id
    const telegramId = message.from.id.toString()
    const telegramUsername = message.from.username
    const firstName = message.from.first_name

    // Traitement des commandes
    if (message.text === '/start') {
      const result = await commandHandler.handleStart(chatId, telegramId, telegramUsername, firstName)
      return new Response('OK', { status: 200 })
    }

    if (message.text === '/points') {
      const result = await commandHandler.handlePoints(chatId, telegramId)
      return new Response('OK', { status: 200 })
    }

    if (message.text === '/aide' || message.text === '/help') {
      await commandHandler.handleHelp(chatId)
      return new Response('OK', { status: 200 })
    }

    // Traitement des photos
    if (message.photo && message.photo.length > 0) {
      const result = await photoHandler.handlePhoto(chatId, telegramId, message.photo)
      return new Response('OK', { status: 200 })
    }

    // Traitement de la localisation
    if (message.location) {
      const { latitude, longitude } = message.location
      const result = await locationHandler.handleLocation(chatId, telegramId, latitude, longitude)
      return new Response('OK', { status: 200 })
    }

    // Messages texte non reconnus (seulement si c'est vraiment du texte non-commande)
    if (message.text && !message.text.startsWith('/')) {
      await telegramAPI.sendMessage(chatId, `🤖 <b>Message non reconnu</b>

Pour signaler un problème :
1. 📸 Envoyez une photo
2. 📍 Partagez votre localisation

Tapez /aide pour plus d'infos.`)
      return new Response('OK', { status: 200 })
    }

    // Ignorer silencieusement tous les autres types de messages
    console.log('Message ignored silently')
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
