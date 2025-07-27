export class AutomaticAIAnalyzer {
  
  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
  }> {
    try {
      console.log('🤖 Starting automatic AI analysis...')
      
      // Calculate hash of the image
      const imageHash = await this.calculateImageHash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Vérifications basiques d'abord
      const imageSize = imageData.length
      if (imageSize < 5000) {
        return {
          isGarbageDetected: false,
          detectedObjects: [{ label: 'Image trop petite', score: 0 }],
          imageHash
        }
      }

      if (imageSize > 10 * 1024 * 1024) {
        return {
          isGarbageDetected: false,
          detectedObjects: [{ label: 'Image trop volumineuse', score: 0 }],
          imageHash
        }
      }

      // Analyser avec plusieurs modèles IA pour une meilleure précision
      const aiResult = await this.performMultiModelAnalysis(imageData)
      
      if (!aiResult.success) {
        // Si l'IA échoue complètement, on rejette par sécurité
        console.log('❌ AI analysis completely failed, rejecting image')
        return {
          isGarbageDetected: false,
          detectedObjects: [{ label: 'Analyse IA impossible - réessayez', score: 0 }],
          imageHash
        }
      }

      // Analyser les résultats pour détecter des déchets
      const isGarbageDetected = this.detectGarbageFromResults(aiResult.results)
      
      console.log(`🤖 AI Decision: ${isGarbageDetected ? 'GARBAGE DETECTED' : 'NO GARBAGE DETECTED'}`)

      return {
        isGarbageDetected,
        detectedObjects: aiResult.results,
        imageHash
      }
    } catch (error) {
      console.error('❌ Critical analysis error:', error)
      
      const imageHash = await this.calculateImageHash(imageData)
      // En cas d'erreur critique, rejeter l'image
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Erreur système - veuillez réessayer', score: 0 }],
        imageHash
      }
    }
  }

  private async performMultiModelAnalysis(imageData: Uint8Array): Promise<{
    success: boolean
    results: Array<{ label: string; score: number }>
  }> {
    const base64Image = this.uint8ArrayToBase64(imageData)
    
    // Modèles spécialisés pour la détection d'objets
    const models = [
      "microsoft/resnet-50",
      "google/vit-base-patch16-224",
      "facebook/detr-resnet-50"
    ]

    let allResults: Array<{ label: string; score: number }> = []
    let successCount = 0

    for (const model of models) {
      try {
        console.log(`🔍 Testing model: ${model}`)
        
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
                wait_for_model: true,
                use_cache: false
              }
            }),
          }
        )

        if (response.ok) {
          const results = await response.json()
          
          if (Array.isArray(results) && results.length > 0) {
            successCount++
            const modelResults = results.slice(0, 5).map((result: any) => ({
              label: result.label || 'unknown',
              score: Math.round((result.score || 0) * 100)
            }))
            
            allResults.push(...modelResults)
            console.log(`✅ Model ${model} success:`, modelResults)
            
            // Si on a déjà une bonne détection, on peut s'arrêter
            if (this.hasHighConfidenceGarbage(modelResults)) {
              console.log(`🎯 High confidence detection found, stopping here`)
              break
            }
          }
        } else {
          console.log(`⚠️ Model ${model} returned status:`, response.status)
        }
      } catch (error) {
        console.error(`❌ Error with model ${model}:`, error)
      }
    }

    return {
      success: successCount > 0,
      results: allResults.slice(0, 10) // Garder les 10 meilleurs résultats
    }
  }

  private hasHighConfidenceGarbage(results: Array<{ label: string; score: number }>): boolean {
    const garbageKeywords = [
      'trash', 'garbage', 'waste', 'litter', 'bottle', 'can', 'cup', 'bag',
      'plastic', 'paper', 'wrapper', 'container', 'debris', 'rubbish'
    ]

    return results.some(result => {
      const lowerLabel = result.label.toLowerCase()
      const isGarbageKeyword = garbageKeywords.some(keyword => 
        lowerLabel.includes(keyword)
      )
      return isGarbageKeyword && result.score >= 70 // Seuil élevé pour haute confiance
    })
  }

  private detectGarbageFromResults(results: Array<{ label: string; score: number }>): boolean {
    if (results.length === 0) return false

    // Mots-clés spécifiques aux déchets
    const strongGarbageKeywords = [
      'trash', 'garbage', 'waste', 'litter', 'debris', 'rubbish', 'junk'
    ]

    // Objets souvent jetés comme déchets
    const garbageObjects = [
      'bottle', 'can', 'cup', 'plate', 'bowl', 'fork', 'knife', 'spoon',
      'bag', 'wrapper', 'container', 'box', 'carton', 'plastic', 'paper',
      'cigarette', 'tissue', 'napkin', 'straw', 'lid'
    ]

    // Vérifier les détections avec scores
    for (const result of results) {
      const lowerLabel = result.label.toLowerCase()
      const score = result.score

      // Mots-clés forts de déchets (seuil plus bas)
      const hasStrongKeyword = strongGarbageKeywords.some(keyword => 
        lowerLabel.includes(keyword)
      )
      if (hasStrongKeyword && score >= 30) {
        console.log(`✅ Strong garbage keyword detected: ${result.label} (${score}%)`)
        return true
      }

      // Objets potentiellement jetés (seuil plus élevé)
      const hasGarbageObject = garbageObjects.some(object => 
        lowerLabel.includes(object)
      )
      if (hasGarbageObject && score >= 60) {
        console.log(`✅ Garbage object detected: ${result.label} (${score}%)`)
        return true
      }

      // Détection de contexte de pollution
      const pollutionContext = ['dirty', 'abandoned', 'scattered', 'littered', 'dumped']
      const hasPollutionContext = pollutionContext.some(context => 
        lowerLabel.includes(context)
      )
      if (hasPollutionContext && score >= 50) {
        console.log(`✅ Pollution context detected: ${result.label} (${score}%)`)
        return true
      }
    }

    console.log('❌ No garbage clearly detected in results')
    return false
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
      const detectedItems = detectedObjects
        .filter(obj => obj.score > 30)
        .map(obj => `${obj.label} (${obj.score}%)`)
        .slice(0, 3)
      
      let message = "✅ <b>Déchets détectés automatiquement par l'IA !</b>\n\n"
      
      if (detectedItems.length > 0) {
        message += `🎯 <b>Éléments identifiés :</b>\n${detectedItems.join('\n')}\n\n`
      }
      
      message += "🤖 Votre signalement a été <b>validé automatiquement</b> par notre système d'intelligence artificielle. Excellente contribution !"
      
      return message
    } else {
      let message = "❌ <b>Aucun déchet détecté par l'IA.</b>\n\n"
      
      if (detectedObjects.length > 0) {
        const obj = detectedObjects[0]
        if (obj.label.includes('petite')) {
          message += "📏 L'image est trop petite. Veuillez prendre une photo plus grande et plus nette."
        } else if (obj.label.includes('volumineuse')) {
          message += "📁 L'image est trop volumineuse. Veuillez compresser l'image."
        } else if (obj.label.includes('Erreur') || obj.label.includes('impossible')) {
          message += "⚠️ Problème technique temporaire. Veuillez réessayer dans quelques instants."
        } else {
          const detectedItems = detectedObjects
            .filter(obj => obj.score > 20)
            .map(obj => obj.label)
            .slice(0, 3)
          
          if (detectedItems.length > 0) {
            message += `ℹ️ <b>Éléments détectés :</b> ${detectedItems.join(', ')}\n\n`
          }
          
          message += "L'IA n'a pas identifié de déchets clairs. Si vous voyez des déchets, veuillez :\n"
          message += "• Prendre une photo plus proche\n"
          message += "• Améliorer l'éclairage\n"
          message += "• Cadrer directement les déchets"
        }
      }
      
      return message
    }
  }
}