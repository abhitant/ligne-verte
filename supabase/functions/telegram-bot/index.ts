
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is required')
    }

    const update: TelegramUpdate = await req.json()
    console.log('Received update:', JSON.stringify(update, null, 2))

    if (!update.message) {
      return new Response('No message in update', { status: 200 })
    }

    const { message } = update
    const chatId = message.chat.id
    const telegramId = message.from.id.toString()
    const telegramUsername = message.from.username
    const firstName = message.from.first_name

    // Fonction pour envoyer un message Telegram
    async function sendMessage(text: string, replyMarkup?: any) {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup
        })
      })
      return response.json()
    }

    // Commande /start
    if (message.text === '/start') {
      // Créer ou récupérer l'utilisateur
      const { data: user, error } = await supabaseClient.rpc('create_user_if_not_exists', {
        p_telegram_id: telegramId,
        p_telegram_username: telegramUsername,
        p_pseudo: firstName
      })

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
    }

    // Commande /points
    if (message.text === '/points') {
      const { data: user, error } = await supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (error || !user) {
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
    }

    // Commande /aide
    if (message.text === '/aide' || message.text === '/help') {
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
      // Vérifier que l'utilisateur existe
      const { data: user, error: userError } = await supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (userError || !user) {
        await sendMessage('❌ Utilisateur non trouvé. Tapez /start pour vous inscrire.')
        return new Response('User not found', { status: 404 })
      }

      // Prendre la photo de meilleure qualité
      const bestPhoto = message.photo.reduce((prev, current) => 
        (prev.file_size || 0) > (current.file_size || 0) ? prev : current
      )

      // Stocker temporairement les données de la photo pour attendre la localisation
      const photoData = {
        file_id: bestPhoto.file_id,
        telegram_id: telegramId,
        timestamp: Date.now()
      }

      // Pour cette démo, on stocke dans une variable globale
      // En production, utilisez Redis ou une autre solution de cache
      console.log('Photo received:', photoData)

      await sendMessage(`📸 <b>Photo reçue !</b>

Maintenant, partagez votre localisation pour finaliser le signalement.

<i>💡 Astuce : Utilisez le bouton "📍 Partager la localisation" de Telegram</i>`)

      return new Response('Photo received', { status: 200 })
    }

    // Gestion de la localisation
    if (message.location) {
      const { latitude, longitude } = message.location

      // Vérifier que l'utilisateur existe
      const { data: user, error: userError } = await supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (userError || !user) {
        await sendMessage('❌ Utilisateur non trouvé. Tapez /start pour vous inscrire.')
        return new Response('User not found', { status: 404 })
      }

      // Créer le signalement (pour cette démo, on utilise une photo par défaut)
      const { data: report, error: reportError } = await supabaseClient.rpc('create_report', {
        p_user_telegram_id: telegramId,
        p_photo_url: `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/photo_placeholder`,
        p_description: 'Signalement via bot Telegram',
        p_location_lat: latitude,
        p_location_lng: longitude
      })

      if (reportError) {
        console.error('Error creating report:', reportError)
        await sendMessage('❌ Erreur lors de la création du signalement. Veuillez réessayer.')
        return new Response('Error creating report', { status: 500 })
      }

      // Ajouter des points à l'utilisateur
      await supabaseClient.rpc('add_points_to_user', {
        p_telegram_id: telegramId,
        p_points: 10
      })

      const successText = `✅ <b>Signalement créé avec succès !</b>

📍 <b>Localisation :</b> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
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
    }

    // Message par défaut pour les autres types de messages
    await sendMessage(`🤖 <b>Message non reconnu</b>

Pour signaler un problème :
1. 📸 Envoyez une photo
2. 📍 Partagez votre localisation

Tapez /aide pour plus d'informations.`)

    return new Response('Message processed', { status: 200 })

  } catch (error) {
    console.error('Error processing telegram update:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
