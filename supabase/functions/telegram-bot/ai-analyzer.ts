import { pipeline, env } from 'https://esm.sh/@huggingface/transformers@3.7.0'

// Configure transformers.js
env.allowLocalModels = false
env.useBrowserCache = false

export class AIAnalyzer {
  private detector: any = null
  private initialized = false

  // Liste des catégories d'objets détectées par l'IA qui sont considérées comme des ordures potentielles
  private readonly POTENTIAL_GARBAGE_CLASSES = [
    "bottle", "cup", "bowl", "plate", "food", "banana", "apple", "sandwich",
    "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake",
    "bag", "backpack", "suitcase", "frisbee", "sports ball", "kite",
    "wine glass", "fork", "knife", "spoon", "blender",
    "book", "cell phone", "keyboard", "mouse", "remote", "tv", "laptop",
    "chair", "couch", "bed", "toilet", "dining table", "potted plant",
    "oven", "microwave", "toaster", "sink", "refrigerator",
    "umbrella", "tie", "scissors", "toothbrush", "hair drier",
    "traffic light", "fire hydrant", "stop sign", "parking meter", "bench"
  ]

  private readonly CONFIDENCE_THRESHOLD = 0.85

  async initialize() {
    if (this.initialized) return

    try {
      console.log('🤖 Initializing AI object detection model...')
      // Use a simpler, faster model for edge functions
      this.detector = await pipeline('image-classification', 'Xenova/vit-base-patch16-224', {
        device: 'cpu' // Use CPU for edge functions
      })
      this.initialized = true
      console.log('✅ AI model initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize AI model:', error)
      throw error
    }
  }

  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
  }> {
    if (!this.initialized) {
      await this.initialize()
    }

    try {
      // Calculate hash of the image
      const imageHash = await this.calculateMD5Hash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Convert Uint8Array to base64 for the AI model
      const base64Image = this.uint8ArrayToBase64(imageData)
      const imageUrl = `data:image/jpeg;base64,${base64Image}`

      console.log('🔍 Starting AI analysis...')
      const results = await this.detector(imageUrl)
      console.log('📈 AI analysis results:', results)

      let isGarbageDetected = false
      const detectedObjects: Array<{ label: string; score: number }> = []

      // Process classification results
      if (Array.isArray(results)) {
        for (const result of results.slice(0, 10)) { // Top 10 predictions
          const { label, score } = result
          const scorePercent = Math.round(score * 100)
          
          detectedObjects.push({ label, score: scorePercent })
          console.log(`🎯 Detected: ${label} (${scorePercent}%)`)

          // Check for garbage-related keywords in labels
          const lowerLabel = label.toLowerCase()
          const garbageKeywords = [
            'trash', 'garbage', 'waste', 'litter', 'bottle', 'can', 'cup', 'bag', 
            'food', 'wrapper', 'container', 'debris', 'rubbish', 'junk'
          ]
          
          const isGarbageKeyword = garbageKeywords.some(keyword => lowerLabel.includes(keyword))
          
          if (isGarbageKeyword && score >= 0.3) { // Lower threshold for keywords
            isGarbageDetected = true
            console.log(`✅ Garbage detected: ${label} with ${scorePercent}% confidence`)
          }
          
          // Also check our predefined garbage classes with higher threshold
          if (this.POTENTIAL_GARBAGE_CLASSES.includes(lowerLabel) && score >= this.CONFIDENCE_THRESHOLD) {
            isGarbageDetected = true
            console.log(`✅ Garbage detected from predefined list: ${label} with ${scorePercent}% confidence`)
          }
        }
      }

      console.log(`🤖 AI Analysis result: ${isGarbageDetected ? 'GARBAGE DETECTED' : 'NO GARBAGE DETECTED'}`)

      return {
        isGarbageDetected,
        detectedObjects: detectedObjects.slice(0, 5), // Limit to top 5 objects
        imageHash
      }
    } catch (error) {
      console.error('❌ AI analysis error:', error)
      // Fallback: if AI fails, assume it might be garbage to avoid blocking legitimate reports
      const imageHash = await this.calculateMD5Hash(imageData)
      console.log('⚠️ AI analysis failed, using fallback detection')
      return {
        isGarbageDetected: true, // Fallback to allowing the photo
        detectedObjects: [{ label: 'AI analysis failed - manual review needed', score: 50 }],
        imageHash
      }
    }
  }

  private async calculateMD5Hash(data: Uint8Array): Promise<string> {
    // Use SHA-256 since MD5 is not available in crypto.subtle
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32) // Truncate to simulate MD5 length
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
      if (hasAIFailure) {
        return "⚠️ <b>Image acceptée !</b> Notre système d'analyse automatique a rencontré un problème technique, mais votre photo a été acceptée pour examen manuel. Merci pour votre contribution !"
      }
      return "✅ <b>Image validée !</b> Des éléments ressemblant à des ordures ont été détectés. C'est une excellente contribution !"
    } else {
      let message = "❌ <b>Votre image n'a pas été détectée comme une ordure.</b> Aucun déchet clair n'a été identifié avec une confiance suffisante dans cette photo.\n\n"
      
      if (detectedObjects.length > 0) {
        const objectsList = detectedObjects.slice(0, 3).map(obj => `${obj.label} (${obj.score}%)`).join(', ')
        message += `Pour information, nous avons identifié : ${objectsList}.\n`
      }
      
      message += "Si vous pensez vraiment qu'il s'agit d'une erreur, veuillez envoyer une photo plus nette ou sous un angle différent. Merci de réessayer !"
      
      return message
    }
  }
}