
import { TelegramAPI } from './telegram-api.ts'
import type { TelegramUpdate } from './types.ts'

export class PhotoHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
  }

  async handlePhoto(chatId: number, telegramId: string, photos: any[], telegramUsername?: string, firstName?: string) {
    console.log('📸 Processing photo message - Photo array:', photos)
    console.log('👤 User info:', { telegramId, telegramUsername, firstName })

    try {
      // Vérifier ou créer l'utilisateur
      console.log('🔍 Checking or creating user with telegram_id:', telegramId)
      
      let { data: user, error: userError } = await this.supabaseClient.rpc('get_user_by_telegram_id', {
        p_telegram_id: telegramId
      })

      console.log('👤 User lookup result:', { user, userError })

      // Si l'utilisateur n'existe pas, le créer
      if (userError || !user || !user.telegram_id) {
        console.log('👤 User not found, creating new user...')
        
        // Utiliser le nom d'utilisateur Telegram ou le prénom comme pseudo
        const pseudo = telegramUsername ? `@${telegramUsername}` : firstName || `User ${telegramId.slice(-4)}`
        
        const { data: newUser, error: createError } = await this.supabaseClient.rpc('create_user_if_not_exists', {
          p_telegram_id: telegramId,
          p_telegram_username: telegramUsername,
          p_pseudo: pseudo
        })

        if (createError) {
          console.error('❌ Error creating user:', createError)
          await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la création du profil utilisateur.')
          return { success: false, error: createError }
        }

        user = newUser
        console.log('✅ User created successfully:', user)
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

      // Message de succès uniquement si tout s'est bien passé
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
