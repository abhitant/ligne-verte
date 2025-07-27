export class HuggingFaceAnalyzer {
  
  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
  }> {
    try {
      console.log('🤖 Starting Hugging Face Vision analysis...')
      
      // Calculate hash of the image
      const imageHash = await this.calculateImageHash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Convert to base64 for Hugging Face API
      const base64Image = this.uint8ArrayToBase64(imageData)
      
      console.log('🔍 Sending image to Hugging Face API...')
      
      // Using Hugging Face Inference API for image classification
      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
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

      if (!response.ok) {
        console.error('❌ Hugging Face API error:', response.status)
        throw new Error(`Hugging Face API error: ${response.status}`)
      }

      const results = await response.json()
      console.log('📈 Hugging Face response received:', results)

      let isGarbageDetected = false
      const detectedObjects: Array<{ label: string; score: number }> = []

      // Liste des mots-clés qui indiquent des déchets ou de la pollution
      const garbageKeywords = [
        'trash', 'garbage', 'waste', 'litter', 'bottle', 'can', 'cup', 'bag', 
        'food', 'wrapper', 'container', 'debris', 'rubbish', 'junk', 'plastic',
        'carton', 'paper', 'cigarette', 'tissue', 'napkin', 'plate', 'box',
        'packaging', 'metal', 'glass', 'aluminum', 'beverage', 'soda', 'water'
      ]

      // Analyser les résultats de classification
      if (Array.isArray(results)) {
        for (const result of results.slice(0, 10)) { // Top 10 predictions
          const { label, score } = result
          const scorePercent = Math.round(score * 100)
          
          detectedObjects.push({ label, score: scorePercent })
          console.log(`🎯 Detected: ${label} (${scorePercent}%)`)

          // Vérifier si le label contient des mots-clés de déchets
          const lowerLabel = label.toLowerCase()
          const isGarbageKeyword = garbageKeywords.some(keyword => 
            lowerLabel.includes(keyword) || lowerLabel.includes(keyword.replace(/s$/, ''))
          )
          
          // Seuil bas pour les mots-clés de déchets (30%), plus élevé pour les autres (60%)
          const threshold = isGarbageKeyword ? 0.3 : 0.6
          
          if (isGarbageKeyword && score >= threshold) {
            isGarbageDetected = true
            console.log(`✅ Garbage detected: ${label} with ${scorePercent}% confidence`)
          }

          // Détecter aussi les objets qui sont souvent jetés
          const commonTrashObjects = [
            'bottle', 'can', 'cup', 'plate', 'bowl', 'fork', 'knife', 'spoon',
            'bag', 'box', 'carton', 'food', 'fruit', 'snack'
          ]
          
          const isCommonTrash = commonTrashObjects.some(item => 
            lowerLabel.includes(item)
          )
          
          if (isCommonTrash && score >= 0.4) {
            isGarbageDetected = true
            console.log(`✅ Common trash object detected: ${label} with ${scorePercent}% confidence`)
          }
        }
      }

      // Si aucun objet spécifique détecté avec haute confiance, accepter quand même pour examen manuel
      if (!isGarbageDetected && detectedObjects.length > 0) {
        const highestScore = Math.max(...detectedObjects.map(obj => obj.score))
        if (highestScore < 80) { // Si l'IA n'est pas très confiante sur ce qu'elle voit
          isGarbageDetected = true
          console.log('✅ Low confidence detection - accepting for manual review')
          detectedObjects.push({ label: 'Uncertain - manual review needed', score: 70 })
        }
      }

      console.log(`🤖 Hugging Face Analysis result: ${isGarbageDetected ? 'GARBAGE DETECTED' : 'NO GARBAGE DETECTED'}`)

      return {
        isGarbageDetected,
        detectedObjects: detectedObjects.slice(0, 5), // Limit to top 5 objects
        imageHash
      }
    } catch (error) {
      console.error('❌ Hugging Face analysis error:', error)
      
      // Fallback: calculate hash and allow manual review
      const imageHash = await this.calculateImageHash(imageData)
      return {
        isGarbageDetected: true, // Allow for manual review when AI fails
        detectedObjects: [{ label: 'AI analysis failed - manual review needed', score: 50 }],
        imageHash
      }
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
      const hasAIFailure = detectedObjects.some(obj => obj.label.includes('AI analysis failed'))
      const hasUncertain = detectedObjects.some(obj => obj.label.includes('Uncertain'))
      
      if (hasAIFailure) {
        return "⚠️ <b>Photo acceptée !</b> Notre système d'analyse IA a rencontré un problème technique, mais votre photo sera examinée manuellement. Merci pour votre contribution !"
      }
      
      if (hasUncertain) {
        return "🔍 <b>Photo acceptée pour examen !</b> L'IA n'est pas certaine du contenu, mais votre signalement sera vérifié manuellement. Merci pour votre vigilance !"
      }
      
      const detectedItems = detectedObjects
        .filter(obj => obj.score > 30 && !obj.label.includes('manual') && !obj.label.includes('failed'))
        .map(obj => obj.label)
      
      let message = "✅ <b>Déchets détectés par l'IA !</b> Excellente contribution pour lutter contre la pollution.\n\n"
      
      if (detectedItems.length > 0) {
        message += `🎯 <b>Éléments identifiés :</b> ${detectedItems.slice(0, 3).join(', ')}\n\n`
      }
      
      message += "Votre signalement a été validé automatiquement par notre IA gratuite."
      return message
    } else {
      let message = "❌ <b>Aucun déchet clairement détecté.</b> L'analyse automatique n'a pas identifié de déchets évidents dans cette image.\n\n"
      
      if (detectedObjects.length > 0) {
        const items = detectedObjects.slice(0, 2).map(obj => `${obj.label} (${obj.score}%)`).join(', ')
        message += `ℹ️ Éléments détectés : ${items}\n\n`
      }
      
      message += "Si vous voyez des déchets, veuillez prendre une photo plus nette et plus proche. Merci de réessayer !"
      
      return message
    }
  }
}