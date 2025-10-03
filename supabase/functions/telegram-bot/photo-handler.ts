
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

      // Message de confirmation simple
      await this.telegramAPI.sendMessage(chatId, '📸 Photo reçue ! Elle sera analysée manuellement par l\'équipe.')


      // Générer un nom de fichier unique
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `${telegramId}-${timestamp}-${bestPhoto.file_id}.jpg`
      const filePath = `reports/${fileName}`

      console.log('📤 Uploading validated photo to Supabase Storage:', filePath)

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

      // 🤖 Analyse automatique avec Gemini AI
      console.log('🤖 Analyzing image with Gemini AI...')
      await this.telegramAPI.sendMessage(chatId, '🤖 Analyse de la photo en cours...')
      
      let wasteCategory = null
      let disposalInstructions = null
      let aiDescription = null
      let wasteType = null
      let brand = null

      try {
        const { data: analysisData, error: analysisError } = await this.supabaseClient.functions.invoke('analyze-waste-image', {
          body: { imageUrl: supabasePhotoUrl }
        })

        if (analysisError) {
          console.error('❌ AI analysis error:', analysisError)
          await this.telegramAPI.sendMessage(chatId, '⚠️ Analyse automatique impossible, validation manuelle nécessaire.')
        } else if (analysisData?.success && analysisData?.analysis) {
          const analysis = analysisData.analysis
          console.log('✅ AI Analysis result:', analysis)

          if (analysis.isWaste) {
            wasteCategory = analysis.category
            disposalInstructions = analysis.disposalInstructions
            aiDescription = analysis.description
            wasteType = analysis.wasteType
            brand = analysis.brand

            await this.telegramAPI.sendMessage(chatId, `✅ <b>Photo analysée !</b> 🤖

🗑️ <b>Type:</b> ${wasteType}
📦 <b>Catégorie:</b> ${wasteCategory}
${brand ? `🏷️ <b>Marque:</b> ${brand}` : ''}

📝 ${aiDescription}

♻️ <b>Instructions:</b> ${disposalInstructions}

<i>Cette analyse est automatique et sera vérifiée par l'équipe.</i>`)
          } else {
            await this.telegramAPI.sendMessage(chatId, '⚠️ Cela ne semble pas être un déchet. Veuillez envoyer une photo claire d\'un déchet.')
            return { success: false, error: 'Not a waste item' }
          }
        }
      } catch (aiError) {
        console.error('❌ Error calling AI analysis:', aiError)
        await this.telegramAPI.sendMessage(chatId, '⚠️ Analyse automatique impossible, validation manuelle nécessaire.')
      }

      // Générer un hash simple pour la photo
      const imageHash = await this.calculateFallbackHash(photoUint8Array)

      // Sauvegarder dans pending_reports avec les données d'analyse IA
      console.log('💾 Saving pending report with AI analysis:', {
        p_telegram_id: telegramId,
        p_photo_url: supabasePhotoUrl,
        p_image_hash: imageHash,
        p_waste_category: wasteCategory,
        p_disposal_instructions: disposalInstructions
      })

      const { data: pendingReport, error: pendingError } = await this.supabaseClient.rpc('upsert_pending_report_with_waste_data', {
        p_telegram_id: telegramId,
        p_photo_url: supabasePhotoUrl,
        p_image_hash: imageHash,
        p_waste_category: wasteCategory,
        p_disposal_instructions: disposalInstructions
      })

      if (pendingError) {
        console.error('❌ Error saving pending report:', pendingError)
        await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la sauvegarde de la photo. Réessayez.')
        return { success: false, error: pendingError }
      }

      // Toujours demander la localisation après validation de photo (comportement original)
      const locationKeyboard = {
        keyboard: [
          [{ text: '📍 Partager ma localisation maintenant', request_location: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }

      console.log('📸 Photo analyzed and saved successfully, prompting for location...')
      await this.telegramAPI.sendMessage(chatId, `📍 <b>Dernière étape : Partagez votre localisation !</b>

Cliquez sur le bouton ci-dessous pour partager où vous avez pris cette photo.

✅ Votre signalement sera ensuite validé par l'équipe.`, locationKeyboard)
      console.log('✅ Location request message sent')

      return { success: true }
    } catch (error) {
      console.error('❌ Photo processing error:', error)
      await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors du traitement de la photo')
      return { success: false, error }
    }
  }

  private async calculateFallbackHash(data: Uint8Array): Promise<string> {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
    } catch (error) {
      console.error('❌ Error calculating fallback hash:', error)
      // Ultimate fallback: use timestamp + size
      return `fallback_${Date.now()}_${data.length}`
    }
  }
}
