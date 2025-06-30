
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
    console.log('👤 User info received:', { telegramId, telegramUsername, firstName })

    try {
      // Préparer les données utilisateur avec le bon nom d'utilisateur
      const actualTelegramUsername = telegramUsername || null;
      const pseudoToUse = actualTelegramUsername ? actualTelegramUsername : (firstName || `User ${telegramId.slice(-4)}`);
      
      console.log('👤 User data to save:', {
        p_telegram_id: telegramId,
        p_telegram_username: actualTelegramUsername,
        p_pseudo: pseudoToUse
      });

      // Vérifier ou créer l'utilisateur avec les bonnes données
      const { data: user, error: userError } = await this.supabaseClient.rpc('create_user_if_not_exists', {
        p_telegram_id: telegramId,
        p_telegram_username: actualTelegramUsername,
        p_pseudo: pseudoToUse
      })

      if (userError) {
        console.error('❌ Error creating/updating user:', userError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la création du profil utilisateur.')
        return { success: false, error: userError }
      }

      console.log('✅ User created/updated successfully:', user)

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

      // Télécharger la photo depuis Telegram et l'uploader vers Supabase
      const photoUrl = await this.telegramAPI.getFileUrl(bestPhoto.file_id)
      if (!photoUrl) {
        console.error('❌ Failed to get photo URL from Telegram')
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors du téléchargement de la photo.')
        return { success: false, error: 'Failed to get photo URL' }
      }

      console.log('📸 Photo URL from Telegram:', photoUrl)

      // Télécharger la photo
      const photoResponse = await fetch(photoUrl)
      if (!photoResponse.ok) {
        console.error('❌ Failed to download photo from Telegram')
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors du téléchargement de la photo.')
        return { success: false, error: 'Failed to download photo' }
      }

      const photoBlob = await photoResponse.blob()
      const photoArrayBuffer = await photoBlob.arrayBuffer()
      const photoUint8Array = new Uint8Array(photoArrayBuffer)

      // Générer un nom de fichier unique
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `${telegramId}-${timestamp}-${bestPhoto.file_id}.jpg`
      const filePath = `reports/${fileName}`

      console.log('📤 Uploading photo to Supabase Storage:', filePath)

      // Uploader vers Supabase Storage
      const { data: uploadData, error: uploadError } = await this.supabaseClient.storage
        .from('report-photos')
        .upload(filePath, photoUint8Array, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('❌ Error uploading photo to Supabase:', uploadError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la sauvegarde de la photo.')
        return { success: false, error: uploadError }
      }

      console.log('✅ Photo uploaded successfully:', uploadData)

      // Obtenir l'URL publique de la photo uploadée
      const { data: publicUrlData } = this.supabaseClient.storage
        .from('report-photos')
        .getPublicUrl(filePath)

      const supabasePhotoUrl = publicUrlData.publicUrl
      console.log('📸 Supabase photo URL:', supabasePhotoUrl)

      // Sauvegarder dans pending_reports avec l'URL Supabase
      console.log('💾 Calling upsert_pending_report with Supabase URL:', {
        p_telegram_id: telegramId,
        p_photo_url: supabasePhotoUrl
      })

      const { data: pendingReport, error: pendingError } = await this.supabaseClient.rpc('upsert_pending_report_with_url', {
        p_telegram_id: telegramId,
        p_photo_url: supabasePhotoUrl
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
