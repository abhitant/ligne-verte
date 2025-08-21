import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

export class DETRAnalyzer {
  private hf: HfInference | null = null
  private readonly HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
  
  // DETR peut détecter ces classes d'objets COCO, beaucoup sont des déchets potentiels
  private readonly WASTE_CLASSES = [
    'bottle', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich',
    'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'wine glass',
    'toothbrush', 'hair drier', 'cell phone', 'book', 'scissors', 'teddy bear',
    'frisbee', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard',
    'surfboard', 'tennis racket', 'remote', 'keyboard', 'mouse', 'microwave',
    'oven', 'toaster', 'sink', 'refrigerator', 'blender'
  ]

  // Objets clairement identifiables comme déchets avec score élevé
  private readonly HIGH_CONFIDENCE_WASTE = [
    'bottle', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'wine glass', 'toothbrush',
    'cell phone', 'scissors', 'remote', 'keyboard', 'mouse'
  ]

  // Déchets alimentaires organiques
  private readonly ORGANIC_WASTE = [
    'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 
    'hot dog', 'pizza', 'donut', 'cake'
  ]

  constructor() {
    if (this.HF_TOKEN) {
      this.hf = new HfInference(this.HF_TOKEN)
      console.log('✅ DETR Analyzer initialized with Hugging Face token')
    } else {
      console.warn('⚠️ No Hugging Face token found, DETR analysis will be limited')
    }
  }

  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number; bbox?: number[] }>
    imageHash: string
    wasteCategory?: string
    disposalInstructions?: string
    confidenceLevel: 'high' | 'medium' | 'low'
  }> {
    console.log('🎯 Starting DETR Analysis...')
    
    try {
      const imageHash = await this.calculateImageHash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Vérification de base de la taille de l'image
      if (imageData.length < 5000) {
        console.log('❌ Image too small for DETR analysis')
        return this.createFallbackResult(imageData, imageHash)
      }

      if (!this.hf) {
        console.log('⚠️ No Hugging Face client, using heuristic analysis')
        return this.createHeuristicResult(imageData, imageHash)
      }

      // Utiliser DETR pour la détection d'objets
      const base64Image = this.uint8ArrayToBase64(imageData)
      
      console.log('🔍 Calling DETR model for object detection...')
      
      // Utiliser le modèle DETR de Facebook
      const detections = await this.hf.objectDetection({
        data: base64Image,
        model: 'facebook/detr-resnet-50' // Modèle DETR optimisé
      })

      console.log('📈 DETR detections received:', detections.length, 'objects')
      
      if (!detections || detections.length === 0) {
        console.log('⚠️ No objects detected by DETR')
        return this.createFallbackResult(imageData, imageHash)
      }

      // Traiter les détections DETR
      const processedDetections = this.processDetrDetections(detections)
      const wasteAnalysis = this.analyzeForWaste(processedDetections)

      return {
        isGarbageDetected: wasteAnalysis.isWaste,
        detectedObjects: processedDetections.slice(0, 5), // Top 5 objets
        imageHash,
        wasteCategory: wasteAnalysis.category,
        disposalInstructions: wasteAnalysis.instructions,
        confidenceLevel: wasteAnalysis.confidence
      }

    } catch (error) {
      console.error('❌ DETR Analysis error:', error)
      const imageHash = await this.calculateImageHash(imageData)
      
      // Fallback conservateur : rejeter en cas d'erreur pour éviter les faux positifs
      return {
        isGarbageDetected: false,
        detectedObjects: [{ 
          label: `DETR analysis failed: ${error.message}`, 
          score: 0 
        }],
        imageHash,
        confidenceLevel: 'low' as const
      }
    }
  }

  private processDetrDetections(detections: any[]): Array<{ label: string; score: number; bbox?: number[] }> {
    return detections
      .map(detection => ({
        label: detection.label.toLowerCase(),
        score: Math.round(detection.score * 100),
        bbox: detection.box ? [detection.box.xmin, detection.box.ymin, detection.box.xmax, detection.box.ymax] : undefined
      }))
      .filter(detection => detection.score >= 30) // Seuil minimum de confiance
      .sort((a, b) => b.score - a.score) // Trier par confiance décroissante
  }

  private analyzeForWaste(detections: Array<{ label: string; score: number; bbox?: number[] }>): {
    isWaste: boolean
    category?: string
    instructions?: string
    confidence: 'high' | 'medium' | 'low'
  } {
    let isWaste = false
    let category = 'GENERAL'
    let instructions = 'Jetez dans la poubelle générale'
    let confidence: 'high' | 'medium' | 'low' = 'low'

    for (const detection of detections) {
      const { label, score } = detection
      
      console.log(`🎯 DETR detected: ${label} (${score}%)`)

      // Objets clairement identifiables comme déchets avec score élevé
      if (this.HIGH_CONFIDENCE_WASTE.includes(label) && score >= 60) {
        isWaste = true
        confidence = 'high'
        
        if (['bottle', 'cup', 'wine glass'].includes(label)) {
          category = 'RECYCLABLE'
          instructions = '♻️ À recycler : Videz et rincez avant de mettre dans le bac de recyclage'
        } else if (['fork', 'knife', 'spoon'].includes(label)) {
          category = 'GENERAL'
          instructions = '🗑️ Couverts usagés : Jetez dans la poubelle générale après nettoyage'
        } else if (['cell phone', 'keyboard', 'mouse'].includes(label)) {
          category = 'HAZARDOUS'
          instructions = '⚡ Déchets électroniques : Apportez dans un point de collecte spécialisé'
        }
        break // Première détection fiable trouvée
      }

      // Déchets alimentaires organiques
      if (this.ORGANIC_WASTE.includes(label) && score >= 50) {
        isWaste = true
        confidence = score >= 70 ? 'high' : 'medium'
        category = 'ORGANIC'
        instructions = '🌱 Déchets organiques : Compostez ou jetez dans le bac à déchets organiques'
        break
      }

      // Autres objets potentiels avec seuil plus élevé
      if (this.WASTE_CLASSES.includes(label) && score >= 70) {
        isWaste = true
        confidence = 'medium'
        category = 'GENERAL'
        instructions = '🗑️ Jetez dans la poubelle générale appropriée'
      }
    }

    console.log(`🎯 DETR Waste Analysis: ${isWaste ? 'WASTE DETECTED' : 'NO WASTE'} (${confidence} confidence, ${category})`)
    
    return {
      isWaste,
      category: isWaste ? category : undefined,
      instructions: isWaste ? instructions : undefined,
      confidence
    }
  }

  private createHeuristicResult(imageData: Uint8Array, imageHash: string): {
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
    confidenceLevel: 'low'
  } {
    const imageSize = imageData.length
    
    // Heuristique conservative basée sur la taille
    if (imageSize < 50000) { // < 50KB
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Image trop petite pour analyse fiable', score: 10 }],
        imageHash,
        confidenceLevel: 'low' as const
      }
    }

    // Pour les images moyennes/grandes sans IA, être conservateur
    return {
      isGarbageDetected: false,
      detectedObjects: [{ label: 'Analyse DETR indisponible - vérification manuelle requise', score: 25 }],
      imageHash,
      confidenceLevel: 'low' as const
    }
  }

  private createFallbackResult(imageData: Uint8Array, imageHash: string): {
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
    confidenceLevel: 'low'
  } {
    return {
      isGarbageDetected: false,
      detectedObjects: [{ label: 'DETR analysis failed - manual review needed', score: 20 }],
      imageHash,
      confidenceLevel: 'low' as const
    }
  }

  private async calculateImageHash(data: Uint8Array): Promise<string> {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
    } catch (error) {
      console.error('❌ Error calculating hash:', error)
      return `hash_${Date.now()}_${data.length}`
    }
  }

  private uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = ''
    const len = uint8Array.byteLength
    const chunkSize = 8192
    
    for (let i = 0; i < len; i += chunkSize) {
      const chunk = uint8Array.slice(i, Math.min(i + chunkSize, len))
      binary += String.fromCharCode(...chunk)
    }
    
    return btoa(binary)
  }

  generateValidationMessage(result: {
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number; bbox?: number[] }>
    confidenceLevel: 'high' | 'medium' | 'low'
    wasteCategory?: string
    disposalInstructions?: string
  }): string {
    if (result.isGarbageDetected) {
      let message = "✅ <b>Analyse DETR : Déchets détectés !</b> 🎯\n\n"
      
      if (result.confidenceLevel === 'high') {
        message += "🔥 <b>Confiance élevée</b> - Détection précise par DETR\n"
      } else if (result.confidenceLevel === 'medium') {
        message += "📊 <b>Confiance moyenne</b> - Objets identifiés par DETR\n"
      } else {
        message += "⚠️ <b>Confiance faible</b> - Vérification supplémentaire\n"
      }
      
      if (result.detectedObjects.length > 0) {
        const topObjects = result.detectedObjects.slice(0, 3)
        message += "\n🎯 <b>Objets détectés :</b>\n"
        topObjects.forEach(obj => {
          message += `• ${obj.label} (${obj.score}%)\n`
        })
      }
      
      if (result.wasteCategory && result.disposalInstructions) {
        message += `\n📋 <b>Catégorie :</b> ${result.wasteCategory}\n`
        message += `♻️ <b>Instructions :</b> ${result.disposalInstructions}`
      }
      
      return message
    } else {
      let message = "❌ <b>DETR : Aucun déchet clairement identifié</b>\n\n"
      
      if (result.detectedObjects.length > 0 && !result.detectedObjects[0].label.includes('failed')) {
        message += "🔍 <b>Objets détectés :</b>\n"
        result.detectedObjects.slice(0, 3).forEach(obj => {
          message += `• ${obj.label} (${obj.score}%)\n`
        })
        message += "\n💡 Ces objets ne correspondent pas à des déchets typiques."
      }
      
      message += "\n📸 Veuillez prendre une photo plus claire des déchets ou vérifier qu'il s'agit bien de déchets à signaler."
      
      return message
    }
  }
}