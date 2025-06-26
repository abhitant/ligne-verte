
import { TelegramAPI } from './telegram-api.ts'

export class LocationHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
  }

  async handleLocation(chatId: number, telegramId: string, latitude: number, longitude: number) {
    console.log('📍 Processing location message')
    console.log('📍 Location coordinates:', { latitude, longitude })

    try {
      // Vérifier l'utilisateur
      const { data: user, error: userError } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      if (userError || !user) {
        await this.telegramAPI.sendMessage(chatId, '❌ Tapez /start pour vous inscrire d\'abord.')
        return { success: false, error: 'User not found' }
      }

      // Récupérer et supprimer le signalement en attente
      const { data: pendingReport, error: pendingError } = await this.supabaseClient.rpc('get_and_delete_pending_report', {
        p_telegram_id: telegramId
      })

      console.log('🔍 Pending report lookup:', { pendingReport, pendingError })

      if (pendingError || !pendingReport || !pendingReport.file_id) {
        console.log('❌ No pending photo found')
        await this.telegramAPI.sendMessage(chatId, `❌ <b>Aucune photo en attente</b>

Processus à suivre :
1. 📸 Envoyez d'abord une photo
2. 📍 Puis partagez votre localisation

Recommencez en envoyant une photo ! 🔄`)
        return { success: false, error: 'No pending photo' }
      }

      // Obtenir l'URL de la photo via l'API Telegram
      const telegramAPI = new TelegramAPI(Deno.env.get('TELEGRAM_BOT_TOKEN')!)
      const photoUrl = await telegramAPI.getFileUrl(pendingReport.file_id)
      
      if (!photoUrl) {
        console.error('❌ Failed to get photo URL')
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur photo. Renvoyez votre photo et localisation.')
        return { success: false, error: 'Photo URL error' }
      }

      console.log('📸 Photo URL obtained:', photoUrl)

      // Créer le signalement complet
      const { data: report, error: reportError } = await this.supabaseClient.rpc('create_report', {
        p_user_telegram_id: telegramId,
        p_photo_url: photoUrl,
        p_description: 'Signalement via bot Telegram',
        p_location_lat: latitude,
        p_location_lng: longitude
      })

      if (reportError) {
        console.error('❌ Error creating report:', reportError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur création signalement. Réessayez.')
        return { success: false, error: reportError }
      }

      console.log('✅ Report created successfully:', report.id)

      // Ajouter des points
      const { error: pointsError } = await this.supabaseClient.rpc('add_points_to_user', {
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

      await this.telegramAPI.sendMessage(chatId, successText, keyboard)
      return { success: true }
    } catch (error) {
      console.error('❌ Location processing error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur traitement localisation')
      return { success: false, error }
    }
  }
}
