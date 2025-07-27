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
      // Use a lighter object detection model suitable for edge functions
      this.detector = await pipeline('object-detection', 'Xenova/detr-resnet-50', {
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
      // Calculate MD5 hash of the image
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

      for (const result of results) {
        const { label, score } = result
        const scorePercent = Math.round(score * 100)
        
        detectedObjects.push({ label, score: scorePercent })
        console.log(`🎯 Detected: ${label} (${scorePercent}%)`)

        // Check if detected object is potential garbage with sufficient confidence
        if (this.POTENTIAL_GARBAGE_CLASSES.includes(label) && score >= this.CONFIDENCE_THRESHOLD) {
          isGarbageDetected = true
          console.log(`✅ Garbage detected: ${label} with ${scorePercent}% confidence`)
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
      throw error
    }
  }

  private async calculateMD5Hash(data: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('MD5', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
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