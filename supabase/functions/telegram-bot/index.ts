
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

serve(async (req) => {
  console.log('=== NEW REQUEST ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Vérification des variables d'environnement
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')

    console.log('Environment check:')
    console.log('SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'MISSING')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING')
    console.log('TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration')
    }

    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is required')
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Nettoyage automatique des signalements en attente trop anciens
    try {
      const { data: cleanupResult, error: cleanupError } = await supabaseClient.rpc('cleanup_old_pending_reports')
      if (cleanupResult > 0) {
        console.log(`Cleaned up ${cleanupResult} old pending reports`)
      }
    } catch (cleanupError) {
      console.log('Cleanup warning:', cleanupError)
    }

    // Lecture du body de la requête
    let update: TelegramUpdate
    try {
      const body = await req.text()
      console.log('Raw request body:', body)
      update = JSON.parse(body)
      console.log('Parsed update:', JSON.stringify(update, null, 2))
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return new Response('Invalid JSON', { status: 400 })
    }

    if (!update.message) {
      console.log('No message in update, ignoring')
      return new Response('No message in update', { status: 200 })
    }

    const { message } = update
    const chatId = message.chat.id
    const telegramId = message.from.id.toString()
    const telegramUsername = message.from.username
    const firstName = message.from.first_name

    console.log('Message details:')
    console.log('Chat ID:', chatId)
    console.log('Telegram ID:', telegramId)
    console.log('Username:', telegramUsername)
    console.log('First Name:', firstName)
    console.log('Message text:', message.text)

    // Fonction pour envoyer un message Telegram
    async function sendMessage(text: string, replyMarkup?: any) {
      console.log('Sending message:', text)
      console.log('Reply markup:', replyMarkup)

      const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      }

      console.log('Telegram API payload:', JSON.stringify(payload, null, 2))

      try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const result = await response.json()
        console.log('Telegram API response status:', response.status)
        console.log('Telegram API response:', result)

        if (!response.ok) {
          console.error('Telegram API error:', result)
        }

        return result
      } catch (error) {
        console.error('Error calling Telegram API:', error)
        throw error
      }
    }

    // Fonction pour obtenir l'URL d'un fichier Telegram
    async function getFileUrl(fileId: string): Promise<string | null> {
      try {
        console.log('Getting file URL for file_id:', fileId)
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`)
        const result = await response.json()
        
        console.log('getFile API response:', result)
        
        if (result.ok && result.result.file_path) {
          const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${result.result.file_path}`
          console.log('File URL:', fileUrl)
          return fileUrl
        } else {
          console.error('Error getting file:', result)
          return null
        }
      } catch (error) {
        console.error('Error calling getFile API:', error)
        return null
      }
    }

    // Commande /start
    if (message.text === '/start') {
      console.log('Processing /start command')

      try {
        // Créer ou récupérer l'utilisateur
        console.log('Creating/getting user with RPC call')
        const { data: user, error } = await supabaseClient.rpc('create_user_if_not_exists', {
          p_telegram_id: telegramId,
          p_telegram_username: telegramUsername,
          p_pseudo: firstName
        })

        console.log('RPC result:', { user, error })

        if (error) {
          console.error('Error creating user:', error)
          await sendMessage('❌ Erreur lors de l\'inscription. Veuillez réessayer.')
          return new Response('Error creating user', { status: 500 })
        }

        const welcomeText = `🌱 <b>Bienvenue sur La Ligne Verte !</b>

Bonjour ${firstName} ! Vous êtes maintenant inscrit(e) avec <b>${user.points_himpact} points Himpact</b>.

<b>📍 Comment signaler un problème :</b>
1. Envoyez-moi une photo du problème environnemental
2. Partagez votre localisation
3. Ajoutez une description (optionnel)

<b>⚡ Commandes disponibles :</b>
/points - Voir vos points Himpact
/aide - Afficher cette aide

Votre engagement compte pour l'environnement ! 🌍`

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🗺️ Voir la carte', url: 'https://ligneverte.xyz/carte' },
              { text: '🛒 Marketplace', url: 'https://ligneverte.xyz/marketplace' }
            ]
          ]
        }

        await sendMessage(welcomeText, keyboard)
        return new Response('Welcome message sent', { status: 200 })
      } catch (startError) {
        console.error('/start command error:', startError)
        await sendMessage('❌ Erreur lors du traitement de la commande /start')
        return new Response('Start command error', { status: 500 })
      }
    }

    // Commande /points
    if (message.text === '/points') {
      console.log('Processing /points command')

      try {
        const { data: user, error } = await supabaseClient.rpc('get_user_by_telegram_id', {
          p_telegram_id: telegramId
        })

        console.log('Get user result:', { user, error })

        if (error || !user) {
          console.log('User not found for /points')
          await sendMessage('❌ Utilisateur non trouvé. Tapez /start pour vous inscrire.')
          return new Response('User not found', { status: 404 })
        }

        const pointsText = `💰 <b>Vos points Himpact</b>

Vous avez actuellement <b>${user.points_himpact} points</b> ! 🎉

<b>Comment gagner plus de points :</b>
• 📸 Signaler un problème environnemental (+10 points)
• ✅ Signalement validé par un admin (+50 points bonus)

Utilisez vos points sur la marketplace pour des récompenses ! 🛒`

        const keyboard = {
          inline_keyboard: [
            [{ text: '🛒 Accéder à la Marketplace', url: 'https://ligneverte.xyz/marketplace' }]
          ]
        }

        await sendMessage(pointsText, keyboard)
        return new Response('Points info sent', { status: 200 })
      } catch (pointsError) {
        console.error('/points command error:', pointsError)
        await sendMessage('❌ Erreur lors de la récupération des points')
        return new Response('Points command error', { status: 500 })
      }
    }

    // Commande /aide
    if (message.text === '/aide' || message.text === '/help') {
      console.log('Processing /aide command')

      const helpText = `🌱 <b>Aide - La Ligne Verte</b>

<b>📍 Pour signaler un problème :</b>
1. Envoyez une photo du problème
2. Partagez votre localisation
3. Ajoutez une description (optionnel)

<b>⚡ Commandes :</b>
/start - S'inscrire ou se reconnecter
/points - Voir vos points Himpact
/aide - Afficher cette aide

<b>🎯 Récompenses :</b>
• Signalement : +10 points
• Signalement validé : +50 points bonus

<b>🔗 Liens utiles :</b>
• Carte des signalements
• Marketplace Himpact`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Voir la carte', url: 'https://ligneverte.xyz/carte' },
            { text: '🛒 Marketplace', url: 'https://ligneverte.xyz/marketplace' }
          ]
        ]
      }

      await sendMessage(helpText, keyboard)
      return new Response('Help sent', { status: 200 })
    }

    // Gestion des photos (signalement)
    if (message.photo && message.photo.length > 0) {
      console.log('Processing photo message')

      try {
        // Vérifier que l'utilisateur existe
        const { data: user, error: userError } = await supabaseClient.rpc('get_user_by_telegram_id', {
          p_telegram_id: telegramId
        })

        console.log('User check for photo:', { user, userError })

        if (userError || !user) {
          await sendMessage('❌ Utilisateur non trouvé. Tapez /start pour vous inscrire.')
          return new Response('User not found', { status: 404 })
        }

        // Prendre la photo de meilleure qualité
        const bestPhoto = message.photo.reduce((prev, current) => 
          (prev.file_size || 0) > (current.file_size || 0) ? prev : current
        )

        console.log('Best photo selected:', bestPhoto)

        // Sauvegarder le file_id dans pending_reports
        const { data: pendingReport, error: pendingError } = await supabaseClient.rpc('upsert_pending_report', {
          p_telegram_id: telegramId,
          p_file_id: bestPhoto.file_id
        })

        console.log('Pending report creation result:', { pendingReport, pendingError })

        if (pendingError) {
          console.error('Error creating pending report:', pendingError)
          await sendMessage('❌ Erreur lors de la sauvegarde de la photo. Veuillez réessayer.')
          return new Response('Error creating pending report', { status: 500 })
        }

        await sendMessage(`📸 <b>Photo reçue et sauvegardée !</b>

Maintenant, partagez votre localisation pour finaliser le signalement.

<i>💡 Astuce : Utilisez le bouton "📍 Partager la localisation" de Telegram</i>`)

        return new Response('Photo saved', { status: 200 })
      } catch (photoError) {
        console.error('Photo processing error:', photoError)
        await sendMessage('❌ Erreur lors du traitement de la photo')
        return new Response('Photo processing error', { status: 500 })
      }
    }

    // Gestion de la localisation
    if (message.location) {
      console.log('Processing location message')

      try {
        const { latitude, longitude } = message.location
        console.log('Location:', { latitude, longitude })

        // Vérifier que l'utilisateur existe
        const { data: user, error: userError } = await supabaseClient.rpc('get_user_by_telegram_id', {
          p_telegram_id: telegramId
        })

        console.log('User check for location:', { user, userError })

        if (userError || !user) {
          await sendMessage('❌ Utilisateur non trouvé. Tapez /start pour vous inscrire.')
          return new Response('User not found', { status: 404 })
        }

        // Récupérer et supprimer le signalement en attente
        const { data: pendingReport, error: pendingError } = await supabaseClient.rpc('get_and_delete_pending_report', {
          p_telegram_id: telegramId
        })

        console.log('Pending report retrieval result:', { pendingReport, pendingError })

        if (pendingError || !pendingReport || !pendingReport.file_id) {
          console.log('No pending photo found for user')
          await sendMessage(`❌ <b>Aucune photo en attente trouvée</b>

Veuillez d'abord envoyer une photo du problème environnemental, puis partagez votre localisation.

<i>💡 Processus :</i>
1. 📸 Envoyez une photo
2. 📍 Partagez votre localisation`)
          return new Response('No pending photo found', { status: 400 })
        }

        // Obtenir l'URL réelle de la photo via l'API Telegram
        const photoUrl = await getFileUrl(pendingReport.file_id)
        
        if (!photoUrl) {
          await sendMessage('❌ Erreur lors de la récupération de la photo. Veuillez renvoyer votre photo et localisation.')
          return new Response('Error getting photo URL', { status: 500 })
        }

        // Créer le signalement avec la vraie URL de la photo
        console.log('Creating report with RPC call')
        const { data: report, error: reportError } = await supabaseClient.rpc('create_report', {
          p_user_telegram_id: telegramId,
          p_photo_url: photoUrl,
          p_description: 'Signalement via bot Telegram',
          p_location_lat: latitude,
          p_location_lng: longitude
        })

        console.log('Report creation result:', { report, reportError })

        if (reportError) {
          console.error('Error creating report:', reportError)
          await sendMessage('❌ Erreur lors de la création du signalement. Veuillez réessayer.')
          return new Response('Error creating report', { status: 500 })
        }

        // Ajouter des points à l'utilisateur
        console.log('Adding points to user')
        const { data: updatedUser, error: pointsError } = await supabaseClient.rpc('add_points_to_user', {
          p_telegram_id: telegramId,
          p_points: 10
        })

        console.log('Points addition result:', { updatedUser, pointsError })

        const successText = `✅ <b>Signalement créé avec succès !</b>

📍 <b>Localisation :</b> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
📸 <b>Photo :</b> Sauvegardée et associée
🎯 <b>Points gagnés :</b> +10 points Himpact
⏰ <b>Statut :</b> En attente de validation

Votre signalement sera examiné par nos équipes. Vous recevrez +50 points bonus si il est validé ! 🎉`

        const keyboard = {
          inline_keyboard: [
            [
              { text: '🗺️ Voir sur la carte', url: 'https://ligneverte.xyz/carte' },
              { text: '💰 Mes points', callback_data: 'check_points' }
            ]
          ]
        }

        await sendMessage(successText, keyboard)
        return new Response('Report created', { status: 200 })
      } catch (locationError) {
        console.error('Location processing error:', locationError)
        await sendMessage('❌ Erreur lors du traitement de la localisation')
        return new Response('Location processing error', { status: 500 })
      }
    }

    // Message par défaut pour les autres types de messages
    console.log('Unrecognized message type, sending default response')
    await sendMessage(`🤖 <b>Message non reconnu</b>

Pour signaler un problème :
1. 📸 Envoyez une photo
2. 📍 Partagez votre localisation

Tapez /aide pour plus d'informations.`)

    return new Response('Message processed', { status: 200 })

  } catch (error) {
    console.error('=== GLOBAL ERROR ===')
    console.error('Error processing telegram update:', error)
    console.error('Error stack:', error.stack)
    
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
