
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      first_name: string
      username?: string
    }
    chat: {
      id: number
      type: string
    }
    text?: string
    photo?: Array<{
      file_id: string
      file_unique_id: string
      width: number
      height: number
      file_size?: number
    }>
    location?: {
      latitude: number
      longitude: number
    }
  }
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

    // Fonction pour envoyer un message
    async function sendMessage(text: string, replyMarkup?: any) {
      console.log('Sending message:', text)
      
      const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      }

      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      console.log('Telegram API response:', result)
      return result
    }

    // Fonction pour obtenir l'URL d'un fichier
    async function getFileUrl(fileId: string): Promise<string | null> {
      try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`)
        const result = await response.json()
        
        if (result.ok && result.result.file_path) {
          return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${result.result.file_path}`
        }
        return null
      } catch (error) {
        console.error('Error getting file URL:', error)
        return null
      }
    }

    // Commande /start
    if (message.text === '/start') {
      console.log('Processing /start command')

      try {
        const { data: user, error } = await supabaseClient.rpc('create_user_if_not_exists', {
          p_telegram_id: telegramId,
          p_telegram_username: telegramUsername,
          p_pseudo: firstName
        })

        if (error) {
          console.error('Error creating user:', error)
          await sendMessage('❌ Erreur lors de l\'inscription. Veuillez réessayer.')
          return new Response('Error', { status: 500 })
        }

        const welcomeText = `🌱 <b>Bienvenue sur La Ligne Verte !</b>

Bonjour ${firstName} ! Vous êtes inscrit(e) avec <b>${user.points_himpact} points Himpact</b>.

<b>📍 Comment signaler :</b>
1. 📸 Envoyez une photo du problème
2. 📍 Partagez votre localisation
3. ✅ C'est tout !

<b>⚡ Commandes :</b>
/points - Voir vos points
/aide - Aide complète`

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🗺️ Carte', url: 'https://ligneverte.xyz/carte' },
              { text: '🛒 Marketplace', url: 'https://ligneverte.xyz/marketplace' }
            ]
          ]
        }

        await sendMessage(welcomeText, keyboard)
        return new Response('OK', { status: 200 })
      } catch (error) {
        console.error('/start error:', error)
        await sendMessage('❌ Erreur système')
        return new Response('Error', { status: 500 })
      }
    }

    // Commande /points
    if (message.text === '/points') {
      try {
        const { data: user, error } = await supabaseClient.rpc('get_user_by_telegram_id', {
          p_telegram_id: telegramId
        })

        if (error || !user) {
          await sendMessage('❌ Utilisateur non trouvé. Tapez /start pour vous inscrire.')
          return new Response('User not found', { status: 404 })
        }

        const pointsText = `💰 <b>Vos points Himpact</b>

Vous avez <b>${user.points_himpact} points</b> ! 🎉

<b>Comment gagner plus :</b>
• 📸 Signaler un problème (+10 points)
• ✅ Signalement validé (+50 points bonus)`

        const keyboard = {
          inline_keyboard: [
            [{ text: '🛒 Marketplace', url: 'https://ligneverte.xyz/marketplace' }]
          ]
        }

        await sendMessage(pointsText, keyboard)
        return new Response('OK', { status: 200 })
      } catch (error) {
        console.error('/points error:', error)
        await sendMessage('❌ Erreur lors de la récupération des points')
        return new Response('Error', { status: 500 })
      }
    }

    // Commande /aide
    if (message.text === '/aide' || message.text === '/help') {
      const helpText = `🌱 <b>Aide - La Ligne Verte</b>

<b>📍 Signaler un problème :</b>
1. 📸 Envoyez une photo
2. 📍 Partagez votre localisation

<b>⚡ Commandes :</b>
/start - S'inscrire
/points - Voir vos points
/aide - Cette aide

<b>🎯 Récompenses :</b>
• Signalement : +10 points
• Validation : +50 points bonus`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Carte', url: 'https://ligneverte.xyz/carte' },
            { text: '🛒 Marketplace', url: 'https://ligneverte.xyz/marketplace' }
          ]
        ]
      }

      await sendMessage(helpText, keyboard)
      return new Response('OK', { status: 200 })
    }

    // GESTION DES PHOTOS
    if (message.photo && message.photo.length > 0) {
      console.log('📸 Processing photo message - Photo array:', message.photo)

      try {
        // Vérifier l'utilisateur
        console.log('🔍 Checking user with telegram_id:', telegramId)
        const { data: user, error: userError } = await supabaseClient.rpc('get_user_by_telegram_id', {
          p_telegram_id: telegramId
        })

        console.log('👤 User lookup result:', { user, userError })

        if (userError || !user) {
          console.error('❌ User not found for photo:', userError)
          await sendMessage('❌ Tapez /start pour vous inscrire d\'abord.')
          return new Response('User not found', { status: 404 })
        }

        // Sélectionner la meilleure photo (plus grande taille)
        const bestPhoto = message.photo.reduce((prev, current) => 
          (current.file_size || current.width * current.height) > (prev.file_size || prev.width * prev.height) ? current : prev
        )

        console.log('📸 Best photo selected:', {
          file_id: bestPhoto.file_id,
          width: bestPhoto.width,
          height: bestPhoto.height,
          file_size: bestPhoto.file_size
        })

        // Sauvegarder dans pending_reports avec logs détaillés
        console.log('💾 Calling upsert_pending_report with:', {
          p_telegram_id: telegramId,
          p_file_id: bestPhoto.file_id
        })

        const { data: pendingReport, error: pendingError } = await supabaseClient.rpc('upsert_pending_report', {
          p_telegram_id: telegramId,
          p_file_id: bestPhoto.file_id
        })

        console.log('💾 Pending report upsert result:', {
          pendingReport,
          pendingError,
          errorMessage: pendingError?.message,
          errorDetails: pendingError?.details
        })

        if (pendingError) {
          console.error('❌ Error saving pending report:', pendingError)
          await sendMessage('❌ Erreur lors de la sauvegarde de la photo. Réessayez.')
          return new Response('Error', { status: 500 })
        }

        // Vérifier que l'enregistrement a bien été créé
        const { data: verification, error: verificationError } = await supabaseClient
          .from('pending_reports')
          .select('*')
          .eq('telegram_id', telegramId)

        console.log('🔍 Verification of saved pending report:', {
          verification,
          verificationError
        })

        await sendMessage(`📸 <b>Photo reçue et sauvegardée !</b>

Maintenant, partagez votre localisation pour finaliser le signalement.

💡 <i>Utilisez le bouton "📍 Partager la localisation" de Telegram</i>`)

        return new Response('Photo saved', { status: 200 })
      } catch (error) {
        console.error('❌ Photo processing error:', error)
        await sendMessage('❌ Erreur lors du traitement de la photo')
        return new Response('Error', { status: 500 })
      }
    }

    // GESTION DE LA LOCALISATION
    if (message.location) {
      console.log('📍 Processing location message')

      try {
        const { latitude, longitude } = message.location
        console.log('📍 Location coordinates:', { latitude, longitude })

        // Vérifier l'utilisateur
        const { data: user, error: userError } = await supabaseClient.rpc('get_user_by_telegram_id', {
          p_telegram_id: telegramId
        })

        if (userError || !user) {
          await sendMessage('❌ Tapez /start pour vous inscrire d\'abord.')
          return new Response('User not found', { status: 404 })
        }

        // Récupérer et supprimer le signalement en attente
        const { data: pendingReport, error: pendingError } = await supabaseClient.rpc('get_and_delete_pending_report', {
          p_telegram_id: telegramId
        })

        console.log('🔍 Pending report lookup:', { pendingReport, pendingError })

        if (pendingError || !pendingReport || !pendingReport.file_id) {
          console.log('❌ No pending photo found')
          await sendMessage(`❌ <b>Aucune photo en attente</b>

Processus à suivre :
1. 📸 Envoyez d'abord une photo
2. 📍 Puis partagez votre localisation

Recommencez en envoyant une photo ! 🔄`)
          return new Response('No pending photo', { status: 400 })
        }

        // Obtenir l'URL de la photo via l'API Telegram
        const photoUrl = await getFileUrl(pendingReport.file_id)
        
        if (!photoUrl) {
          console.error('❌ Failed to get photo URL')
          await sendMessage('❌ Erreur photo. Renvoyez votre photo et localisation.')
          return new Response('Photo URL error', { status: 500 })
        }

        console.log('📸 Photo URL obtained:', photoUrl)

        // Créer le signalement complet
        const { data: report, error: reportError } = await supabaseClient.rpc('create_report', {
          p_user_telegram_id: telegramId,
          p_photo_url: photoUrl,
          p_description: 'Signalement via bot Telegram',
          p_location_lat: latitude,
          p_location_lng: longitude
        })

        if (reportError) {
          console.error('❌ Error creating report:', reportError)
          await sendMessage('❌ Erreur création signalement. Réessayez.')
          return new Response('Report error', { status: 500 })
        }

        console.log('✅ Report created successfully:', report.id)

        // Ajouter des points
        const { error: pointsError } = await supabaseClient.rpc('add_points_to_user', {
          p_telegram_id: telegramId,
          p_points: 10
        })

        if (pointsError) {
          console.log('⚠️ Points addition warning:', pointsError)
        }

        const successText = `✅ <b>Signalement créé avec succès !</b>

📍 <b>Position :</b> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
📸 <b>Photo :</b> Sauvegardée
🎯 <b>Points :</b> +10 points Himpact
⏰ <b>Statut :</b> En attente de validation

Vous recevrez +50 points bonus si validé ! 🎉`

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🗺️ Voir carte', url: 'https://ligneverte.xyz/carte' },
              { text: '💰 Mes points', callback_data: 'points' }
            ]
          ]
        }

        await sendMessage(successText, keyboard)
        return new Response('Report created', { status: 200 })
      } catch (error) {
        console.error('❌ Location processing error:', error)
        await sendMessage('❌ Erreur traitement localisation')
        return new Response('Error', { status: 500 })
      }
    }

    // Ignorer les messages vides ou non reconnus SANS répondre
    if (!message.text && !message.photo && !message.location) {
      console.log('Empty or unrecognized message type, ignoring silently')
      return new Response('OK', { status: 200 })
    }

    // Messages texte non reconnus (seulement si c'est vraiment du texte)
    if (message.text && !message.text.startsWith('/')) {
      await sendMessage(`🤖 <b>Message non reconnu</b>

Pour signaler un problème :
1. 📸 Envoyez une photo
2. 📍 Partagez votre localisation

Tapez /aide pour plus d'infos.`)
    }

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
