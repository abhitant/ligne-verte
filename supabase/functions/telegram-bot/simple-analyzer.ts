export class SimpleAnalyzer {
  
  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
  }> {
    try {
      console.log('📊 Starting simple image analysis...')
      
      // Calculate hash of the image
      const imageHash = await this.calculateImageHash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Simple heuristic analysis based on image properties
      const imageSize = imageData.length
      console.log('📏 Image size:', imageSize, 'bytes')

      // For now, we'll use a simple rule-based approach
      // In a real scenario, you could send to external AI service like OpenAI Vision
      let isGarbageDetected = true // Default to accepting photos for manual review
      const detectedObjects = [
        { label: 'Image accepted for manual review', score: 90 }
      ]

      // Basic size validation - reject very small images
      if (imageSize < 10000) { // Less than 10KB
        isGarbageDetected = false
        detectedObjects[0] = { label: 'Image too small or corrupted', score: 0 }
        console.log('❌ Image rejected: too small')
      } else {
        console.log('✅ Image accepted for manual review')
      }

      return {
        isGarbageDetected,
        detectedObjects,
        imageHash
      }
    } catch (error) {
      console.error('❌ Simple analysis error:', error)
      
      // Ultimate fallback
      const fallbackHash = `fallback_${Date.now()}_${imageData.length}`
      return {
        isGarbageDetected: true, // Accept for manual review
        detectedObjects: [{ label: 'Analysis error - manual review needed', score: 50 }],
        imageHash: fallbackHash
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

  generateValidationMessage(
    isGarbageDetected: boolean, 
    detectedObjects: Array<{ label: string; score: number }>
  ): string {
    if (isGarbageDetected) {
      const hasError = detectedObjects.some(obj => 
        obj.label.includes('error') || obj.label.includes('failed')
      )
      
      if (hasError) {
        return "⚠️ <b>Photo acceptée !</b> Notre système rencontre un problème technique mais votre photo sera examinée manuellement. Merci pour votre contribution !"
      }
      
      return "✅ <b>Photo acceptée !</b> Votre signalement sera traité. Merci pour votre contribution à l'amélioration de notre environnement !"
    } else {
      let message = "❌ <b>Photo non acceptée.</b> "
      
      if (detectedObjects.length > 0 && detectedObjects[0].label.includes('too small')) {
        message += "L'image semble trop petite ou corrompue. Veuillez prendre une photo plus nette et plus grande."
      } else {
        message += "Veuillez réessayer avec une photo plus claire."
      }
      
      return message
    }
  }
}