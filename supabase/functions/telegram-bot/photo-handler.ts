
import { TelegramAPI } from './telegram-api.ts'
import type { TelegramUpdate } from './types.ts'
import { OptimizedFreeAnalyzer } from './optimized-free-analyzer.ts'
import { SimpleAnalyzer } from './simple-analyzer.ts'
import { DETRAnalyzer } from './detr-analyzer.ts'
import { WasteSorterAnalyzer } from './waste-sorter-analyzer.ts'

export class PhotoHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any
  private optimizedAnalyzer: OptimizedFreeAnalyzer
  private simpleAnalyzer: SimpleAnalyzer
  private detrAnalyzer: DETRAnalyzer
  private wasteSorterAnalyzer: WasteSorterAnalyzer

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
    this.optimizedAnalyzer = new OptimizedFreeAnalyzer()
    this.simpleAnalyzer = new SimpleAnalyzer()
    this.detrAnalyzer = new DETRAnalyzer()
    this.wasteSorterAnalyzer = new WasteSorterAnalyzer()
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

      // Message d'analyse en cours
      await this.telegramAPI.sendMessage(chatId, '🤖 Analyse d\'image en cours par Debora...')

      // Choisir l'analyseur selon le mode configuré
      const analyzerMode = Deno.env.get('BOT_ANALYZER_MODE') || 'simple'
      console.log('🔬 Using analyzer mode:', analyzerMode)
      
      let analysisResult
      if (analyzerMode === 'simple') {
        console.log('📊 Starting simple analysis...')
        analysisResult = await this.simpleAnalyzer.analyzeImage(photoUint8Array)
      } else if (analyzerMode === 'detr') {
        console.log('🎯 Starting DETR analysis...')
        analysisResult = await this.detrAnalyzer.analyzeImage(photoUint8Array)
      } else if (analyzerMode === 'waste-sorter') {
        console.log('🗂️ Starting optimized waste-sorter analysis...')
        analysisResult = await this.wasteSorterAnalyzer.analyzeImage(photoUint8Array)
      } else {
        console.log('🎯 Starting optimized free analysis...')
        analysisResult = await this.optimizedAnalyzer.analyzeImage(photoUint8Array)
      }
      
      // Fallback complet si nécessaire
      if (!analysisResult.imageHash) {
        analysisResult.imageHash = await this.calculateFallbackHash(photoUint8Array)
      }

      // Envoyer le message de validation selon l'analyseur utilisé
      let validationMessage
      if (analyzerMode === 'simple') {
        validationMessage = this.simpleAnalyzer.generateValidationMessage(
          analysisResult.isGarbageDetected, 
          analysisResult.detectedObjects
        )
      } else if (analyzerMode === 'detr') {
        validationMessage = this.detrAnalyzer.generateValidationMessage(analysisResult)
      } else if (analyzerMode === 'waste-sorter') {
        validationMessage = this.wasteSorterAnalyzer.generateValidationMessage(analysisResult)
      } else {
        validationMessage = this.optimizedAnalyzer.generateOptimizedValidationMessage(analysisResult)
      }
      await this.telegramAPI.sendMessage(chatId, validationMessage, { parse_mode: 'HTML' })

      // VALIDATION PRÉCOCE : Si l'analyse rejette la photo, arrêter immédiatement
      if (!analysisResult.isGarbageDetected) {
        console.log('❌ Analysis rejected image - no waste detected, stopping process before upload/save')
        return { success: false, error: 'Image rejected by analysis - no waste detected' }
      }


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

      // Sauvegarder dans pending_reports avec les données de classification
      console.log('💾 Saving pending report with waste classification:', {
        p_telegram_id: telegramId,
        p_photo_url: supabasePhotoUrl,
        p_image_hash: analysisResult.imageHash,
        p_waste_category: (analysisResult as any).wasteCategory,
        p_disposal_instructions: (analysisResult as any).disposalInstructions
      })

      const { data: pendingReport, error: pendingError } = await this.supabaseClient.rpc('upsert_pending_report_with_waste_data', {
        p_telegram_id: telegramId,
        p_photo_url: supabasePhotoUrl,
        p_image_hash: analysisResult.imageHash,
        p_waste_category: (analysisResult as any).wasteCategory,
        p_disposal_instructions: (analysisResult as any).disposalInstructions,
        p_ai_validated: true
      })

      if (pendingError) {
        console.error('❌ Error saving pending report:', pendingError)
        // Fallback to the existing function if the new one doesn't exist yet
        const { data: fallbackReport, error: fallbackError } = await this.supabaseClient.rpc('upsert_pending_report_with_url', {
          p_telegram_id: telegramId,
          p_photo_url: supabasePhotoUrl
        })
        
        if (fallbackError) {
          console.error('❌ Error with fallback save:', fallbackError)
          await this.telegramAPI.sendMessage(chatId, '❌ Erreur lors de la sauvegarde de la photo. Réessayez.')
          return { success: false, error: fallbackError }
        }
      }

      // Toujours demander la localisation après validation de photo (comportement original)
      const locationKeyboard = {
        keyboard: [
          [{ text: '📍 Partager ma localisation maintenant', request_location: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }

      await this.telegramAPI.sendMessage(chatId, `✅ <b>Photo validée !</b> 📸

📍 <b>Maintenant, partagez votre localisation pour finaliser le signalement</b>

⏳ Vos points Himpact seront en attente jusqu'à validation par l'équipe !`, locationKeyboard)

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
