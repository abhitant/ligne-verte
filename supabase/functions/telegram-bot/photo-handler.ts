
import { TelegramAPI } from './telegram-api.ts'
import type { TelegramUpdate } from './types.ts'
import { WasteSorterAnalyzer } from './waste-sorter-analyzer.ts'
import { EnhancedWasteAnalyzer } from './enhanced-waste-analyzer.ts'
import { UltraSophisticatedAnalyzer } from './ultra-sophisticated-analyzer.ts'

export class PhotoHandler {
  private telegramAPI: TelegramAPI
  private supabaseClient: any
  private wasteAnalyzer: WasteSorterAnalyzer
  private enhancedAnalyzer: EnhancedWasteAnalyzer
  private ultraSophisticatedAnalyzer: UltraSophisticatedAnalyzer

  constructor(telegramAPI: TelegramAPI, supabaseClient: any) {
    this.telegramAPI = telegramAPI
    this.supabaseClient = supabaseClient
    this.wasteAnalyzer = new WasteSorterAnalyzer()
    this.enhancedAnalyzer = new EnhancedWasteAnalyzer()
    this.ultraSophisticatedAnalyzer = new UltraSophisticatedAnalyzer()
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
      await this.telegramAPI.sendMessage(chatId, 'Analyse de l\'image en cours de traitement...')

      // Analyser avec notre analyseur ultra-sophistiqué
      console.log('🚀 Starting ultra-sophisticated waste analysis...')
      let analysisResult = await this.ultraSophisticatedAnalyzer.analyzeImage(photoUint8Array)
      
      // Si l'analyseur ultra-sophistiqué ne détecte pas de déchets avec certitude, essayer l'edge function
      if (!analysisResult.isGarbageDetected || (analysisResult.urgencyScore && analysisResult.urgencyScore < 30)) {
        console.log('🚀 Using waste sorter app for additional classification...')
        
        // Convertir en base64 pour l'edge function (compatible Deno) 
        const base64Data = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, Array.from(photoUint8Array.slice(0, 8192))))}`
        
        try {
          const analyzeResponse = await this.supabaseClient.functions.invoke('analyze-image-with-waste-sorter', {
            body: { imageData: base64Data }
          })

          if (!analyzeResponse.error && analyzeResponse.data) {
            // Fusionner les résultats des deux analyses
            const wasteAnalysis = analyzeResponse.data
            analysisResult = {
              ...analysisResult,
              isGarbageDetected: wasteAnalysis.isGarbageDetected || analysisResult.isGarbageDetected,
              wasteCategory: wasteAnalysis.wasteCategory,
              disposalInstructions: wasteAnalysis.disposalInstructions,
              detectedObjects: [...analysisResult.detectedObjects, ...wasteAnalysis.detectedObjects]
            }
            console.log('✅ Combined ultra-sophisticated analysis completed:', analysisResult)
          }
        } catch (analysisError) {
          console.error('❌ Waste sorter analysis failed, using ultra-sophisticated analysis only:', analysisError)
        }
      }
      
      // Fallback complet si nécessaire
      if (!analysisResult.imageHash) {
        analysisResult.imageHash = await this.calculateFallbackHash(photoUint8Array)
      }

      // Envoyer le message de validation ultra-sophistiqué
      const validationMessage = this.ultraSophisticatedAnalyzer.generateUltraSophisticatedValidationMessage(analysisResult)
      await this.telegramAPI.sendMessage(chatId, validationMessage, { parse_mode: 'HTML' })

      // VALIDATION PRÉCOCE : Si l'analyse rejette la photo, arrêter immédiatement
      if (!analysisResult.isGarbageDetected) {
        console.log('❌ Analysis rejected image - no waste detected, stopping process before upload/save')
        return { success: false, error: 'Image rejected by analysis - no waste detected' }
      }

      // Vérifier les doublons d'images via hash MD5
      console.log('🔍 Checking for duplicate images...')
      const { data: duplicateImages, error: duplicateError } = await this.supabaseClient
        .from('reports')
        .select('id')
        .eq('image_hash', analysisResult.imageHash)
        .limit(1)

      if (duplicateError) {
        console.error('❌ Error checking duplicate images:', duplicateError)
      } else if (duplicateImages && duplicateImages.length > 0) {
        await this.telegramAPI.sendMessage(chatId, '🚫 <b>Signalement dupliqué !</b> Cette photo a déjà été signalée. Merci pour votre vigilance, mais nous avons déjà cette information.')
        return { success: false, error: 'Duplicate image detected' }
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

      // Vérifier l'amplitude des déchets pour décider du message
      const wasteAmplitude = (analysisResult as any).wasteAmplitude || 'minimal'
      
      if (wasteAmplitude === 'minimal' || wasteAmplitude === 'trace') {
        // Pour pollution minimale : pas de partage de localisation, juste un message d'action
        await this.telegramAPI.sendMessage(chatId, `✅ <b>Photo validée !</b> 📸

🧹 <b>Pollution minimale détectée</b>
Veuillez ramasser ces déchets si possible.

💡 <i>Merci de contribuer à un environnement plus propre !</i>`)
      } else {
        // Pour pollution importante : message d'urgence et demande de localisation
        const locationKeyboard = {
          keyboard: [
            [{ text: '📍 Partager ma localisation maintenant', request_location: true }]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }

        await this.telegramAPI.sendMessage(chatId, `🚨 <b>POLLUTION IMPORTANTE DÉTECTÉE !</b> 📸

⚠️ <b>URGENCE :</b> Cette zone nécessite une intervention rapide.

📍 <b>Partagez immédiatement votre localisation pour alerter les autorités :</b>`, locationKeyboard)
      }

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
