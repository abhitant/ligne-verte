
import { TelegramAPI } from './telegram-api.ts'
import type { TelegramUpdate } from './types.ts'

export class PhotoHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
  }

  async handlePhoto(chatId: number, telegramId: string, photos: any[]) {
    console.log('📸 Processing photo message - Photo array:', photos)

    try {
      // Vérifier l'utilisateur
      console.log('🔍 Checking user with telegram_id:', telegramId)
      const { data: user, error: userError } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      console.log('👤 User lookup result:', { user, userError })

      if (userError || !user) {
        console.error('❌ User not found for photo:', userError)
        await this.telegramAPI.sendMessage(chatId, '❌ Tapez /start pour vous inscrire d\'abord.')
        return { success: false, error: 'User not found' }
      }

      // Sélectionner la meilleure photo (plus grande taille)
      const bestPhoto = photos.reduce((prev, current) => 
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

      const { data: pendingReport, error: pendingError } = await this.supabaseClient.rpc('upsert_pending_report', {
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
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la sauvegarde de la photo. Réessayez.')
        return { success: false, error: pendingError }
      }

      // Vérifier que l'enregistrement a bien été créé
      const { data: verification, error: verificationError } = await this.supabaseClient
        .from('pending_reports')
        .select('*')
        .eq('telegram_id', telegramId)

      console.log('🔍 Verification of saved pending report:', {
        verification,
        verificationError
      })

      await this.telegramAPI.sendMessage(chatId, `📸 <b>Photo reçue et sauvegardée !</b>

Maintenant, partagez votre localisation pour finaliser le signalement.

💡 <i>Utilisez le bouton "📍 Partager la localisation" de Telegram</i>`)

      return { success: true }
    } catch (error) {
      console.error('❌ Photo processing error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors du traitement de la photo')
      return { success: false, error }
    }
  }
}
