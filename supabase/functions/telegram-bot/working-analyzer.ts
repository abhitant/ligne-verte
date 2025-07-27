export class WorkingAnalyzer {
  
  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
  }> {
    try {
      console.log('🔍 Starting image analysis...')
      
      // Calculate hash of the image
      const imageHash = await this.calculateImageHash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Analyse de base basée sur la taille et les propriétés de l'image
      const imageSize = imageData.length
      console.log('📏 Image size:', imageSize, 'bytes')

      // Analyse simple mais efficace
      let isGarbageDetected = true // Par défaut, accepter pour examen manuel
      const detectedObjects = []

      // Vérifications basiques
      if (imageSize < 5000) { // Moins de 5KB
        isGarbageDetected = false
        detectedObjects.push({ label: 'Image trop petite', score: 0 })
        console.log('❌ Image rejected: too small')
      } else if (imageSize > 10 * 1024 * 1024) { // Plus de 10MB
        isGarbageDetected = false
        detectedObjects.push({ label: 'Image trop volumineuse', score: 0 })
        console.log('❌ Image rejected: too large')
      } else {
        // Image de taille acceptable, accepter pour examen manuel
        detectedObjects.push({ label: 'Image acceptée pour analyse manuelle', score: 90 })
        console.log('✅ Image accepted for manual review')
        
        // Tentative d'analyse IA avec Hugging Face (optionnelle)
        try {
          console.log('🤖 Attempting AI analysis with Hugging Face...')
          const aiResult = await this.tryHuggingFaceAnalysis(imageData)
          if (aiResult.success) {
            detectedObjects.push(...aiResult.objects)
            console.log('✅ AI analysis successful')
          } else {
            console.log('⚠️ AI analysis failed, using manual review fallback')
          }
        } catch (aiError) {
          console.error('⚠️ AI analysis error (using fallback):', aiError)
          // Continue avec l'acceptation manuelle
        }
      }

      return {
        isGarbageDetected,
        detectedObjects,
        imageHash
      }
    } catch (error) {
      console.error('❌ Analysis error:', error)
      
      // Ultimate fallback
      const fallbackHash = `fallback_${Date.now()}_${imageData.length}`
      return {
        isGarbageDetected: true, // Accept for manual review
        detectedObjects: [{ label: 'Erreur technique - examen manuel requis', score: 50 }],
        imageHash: fallbackHash
      }
    }
  }

  private async tryHuggingFaceAnalysis(imageData: Uint8Array): Promise<{
    success: boolean
    objects: Array<{ label: string; score: number }>
  }> {
    try {
      const base64Image = this.uint8ArrayToBase64(imageData)
      
      // Essayer plusieurs modèles Hugging Face
      const models = [
        "microsoft/resnet-50",
        "google/vit-base-patch16-224",
        "facebook/detr-resnet-50"
      ]

      for (const model of models) {
        try {
          console.log(`🤖 Trying model: ${model}`)
          
          const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                inputs: base64Image,
                options: {
                  wait_for_model: true
                }
              }),
            }
          )

          if (response.ok) {
            const results = await response.json()
            console.log(`✅ Model ${model} responded:`, results)
            
            if (Array.isArray(results) && results.length > 0) {
              const objects = results.slice(0, 3).map((result: any) => ({
                label: result.label || 'Objet détecté',
                score: Math.round((result.score || 0.5) * 100)
              }))
              
              return { success: true, objects }
            }
          } else {
            console.log(`⚠️ Model ${model} failed with status:`, response.status)
          }
        } catch (modelError) {
          console.error(`❌ Error with model ${model}:`, modelError)
          continue
        }
      }

      return { success: false, objects: [] }
    } catch (error) {
      console.error('❌ Hugging Face analysis failed:', error)
      return { success: false, objects: [] }
    }
  }

  private async calculateImageHash(data: Uint8Array): Promise<string> {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
    } catch (error) {
      console.error('❌ Error calculating hash:', error)
      return `fallback_${Date.now()}_${data.length}`
    }
  }

  private uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = ''
    const len = uint8Array.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    return btoa(binary)
  }

  generateValidationMessage(
    isGarbageDetected: boolean, 
    detectedObjects: Array<{ label: string; score: number }>
  ): string {
    if (isGarbageDetected) {
      const hasError = detectedObjects.some(obj => 
        obj.label.includes('Erreur') || obj.label.includes('erreur')
      )
      
      if (hasError) {
        return "⚠️ <b>Photo acceptée malgré un problème technique !</b> Votre signalement sera traité manuellement. Merci pour votre contribution !"
      }
      
      const aiDetected = detectedObjects.filter(obj => 
        !obj.label.includes('manuelle') && obj.score > 50
      )
      
      if (aiDetected.length > 0) {
        const items = aiDetected.map(obj => obj.label).join(', ')
        return `🤖 <b>Analyse IA réussie !</b> Éléments détectés : ${items}\n\nVotre signalement a été validé automatiquement. Merci pour votre contribution !`
      }
      
      return "✅ <b>Photo acceptée !</b> Votre signalement sera examiné par nos équipes. Merci pour votre contribution à l'amélioration de l'environnement !"
    } else {
      let message = "❌ <b>Photo non acceptée.</b> "
      
      if (detectedObjects.length > 0) {
        if (detectedObjects[0].label.includes('petite')) {
          message += "L'image est trop petite. Veuillez prendre une photo plus grande et plus claire."
        } else if (detectedObjects[0].label.includes('volumineuse')) {
          message += "L'image est trop volumineuse. Veuillez compresser l'image ou prendre une photo de taille normale."
        } else {
          message += "Veuillez réessayer avec une photo plus claire."
        }
      }
      
      return message
    }
  }
}