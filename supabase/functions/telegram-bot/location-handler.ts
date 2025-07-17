
import { TelegramAPI } from './telegram-api.ts'

export class LocationHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
  }

  async handleLocation(chatId: number, telegramId: string, latitude: number, longitude: number, telegramUsername: string | undefined, firstName: string) {
    console.log('Processing location:', latitude, longitude, 'for telegram ID:', telegramId)

    try {
      // Vérifier si l'utilisateur existe
      const { data: user, error: userError } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (userError) {
        console.error('Error getting user:', userError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur utilisateur. Tapez /start pour vous inscrire.')
        return { success: false, error: userError }
      }

      // Si l'utilisateur n'existe pas, le créer avec un nom par défaut
      if (!user) {
        const defaultPseudo = firstName || `User ${telegramId.slice(-4)}`
        const { data: newUser, error: createError } = await this.supabaseClient.rpc('create_user_if_not_exists', {
          p_telegram_id: telegramId,
          p_telegram_username: telegramUsername,
          p_pseudo: defaultPseudo
        })

        if (createError) {
          console.error('Error creating user:', createError)
          await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la création du compte')
          return { success: false, error: createError }
        }
        console.log('Created new user:', newUser)
      }

      // Récupérer le signalement en attente avec l'URL de la photo
      const { data: pendingReport, error: pendingError } = await this.supabaseClient.rpc('get_and_delete_pending_report_with_url', {
        p_telegram_id: telegramId
      })

      if (pendingError) {
        console.error('Error getting pending report:', pendingError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la récupération du signalement')
        return { success: false, error: pendingError }
      }

      if (!pendingReport || !pendingReport.photo_url) {
        await this.telegramAPI.sendMessage(chatId, `📍 <b>Localisation reçue !</b>

Mais je n'ai pas trouvé de photo associée. 

<b>Pour signaler un problème :</b>
1. 📸 Envoyez d'abord une photo
2. 📍 Puis partagez votre localisation

Les deux sont nécessaires pour créer un signalement complet.`)
        return { success: false, error: 'No pending photo found' }
      }

      // Créer le signalement avec la photo en attente
      const { data: report, error: reportError } = await this.supabaseClient.rpc('create_report', {
        p_user_telegram_id: telegramId,
        p_photo_url: pendingReport.photo_url,
        p_description: 'Signalement via Telegram',
        p_location_lat: latitude,
        p_location_lng: longitude
      })

      if (reportError) {
        console.error('Error creating report:', reportError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la création du signalement')
        return { success: false, error: reportError }
      }

      // Ajouter des points à l'utilisateur
      const { data: updatedUser, error: pointsError } = await this.supabaseClient.rpc('add_points_to_user', {
        p_telegram_id: telegramId,
        p_points: 10
      })

      if (pointsError) {
        console.error('Error adding points:', pointsError)
      }

      const currentPoints = updatedUser?.points_himpact || (user?.points_himpact || 0) + 10
      const userPseudo = updatedUser?.pseudo || user?.pseudo || firstName || `User ${telegramId.slice(-4)}`

      const successText = `✅ <b>Signalement créé avec succès !</b>

🎯 <b>+10 points Himpact</b> gagnés !
💰 Vous avez maintenant <b>${currentPoints} points</b>

📍 <b>Localisation :</b> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
👤 <b>Signalé par :</b> ${userPseudo}

Votre signalement est maintenant visible sur la carte et sera examiné par nos équipes.

<b>Continuez à contribuer pour améliorer notre environnement !</b> 🌱`

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗺️ Voir carte', url: 'https://399fedd2-7cd7-4dbf-aeb9-30ca307b3ea9.lovableproject.com/map' },
            { text: '💰 Mes points', callback_data: 'points' }
          ]
        ]
      }

      await this.telegramAPI.sendMessage(chatId, successText, keyboard)
      return { success: true, report_id: report.id }

    } catch (error) {
      console.error('Location handling error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur système')
      return { success: false, error }
    }
  }
}
