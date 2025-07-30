export class OptimizedFreeAnalyzer {
  private cache: Map<string, any> = new Map()
  private rateLimitCount = 0
  private lastRequestTime = 0
  private readonly RATE_LIMIT_PER_MINUTE = 50
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
    wasteLevel?: 'minimal' | 'low' | 'medium' | 'high' | 'critical'
    wasteAmplitude?: 'trace' | 'minimal' | 'moderate' | 'massive'
    wasteTypes?: string[]
    environmentalImpact?: string
    urgencyScore?: number
    confidence?: number
    reasoning?: string
    wasteCategory?: string
    disposalInstructions?: string
    preventionTips?: string[]
  }> {
    try {
      console.log('🎯 Starting optimized free analysis (Hugging Face Vision)...')
      
      // Calculate image hash for caching and duplicate detection
      const imageHash = await this.calculateImageHash(imageData)
      
      // Check cache first
      if (this.cache.has(imageHash)) {
        const cachedResult = this.cache.get(imageHash)
        if (Date.now() - cachedResult.timestamp < this.CACHE_TTL) {
          console.log('💾 Using cached analysis result')
          return cachedResult.data
        }
        this.cache.delete(imageHash)
      }
      
      // Rate limiting check
      if (!this.checkRateLimit()) {
        console.log('⏱️ Rate limit exceeded, using intelligent fallback')
        return this.createIntelligentFallback(imageData, imageHash)
      }

      // Primary analysis with Microsoft Phi-3.5 Vision (free, high-performance)
      let result = await this.performPhiVisionAnalysis(imageData, imageHash)
      
      // If primary fails or low confidence, try Google ViT
      if (!result || result.confidence < 60) {
        console.log('🔄 Primary analysis insufficient, trying Google ViT...')
        const vitResult = await this.performViTAnalysis(imageData, imageHash)
        if (vitResult && vitResult.confidence > result?.confidence) {
          result = vitResult
        }
      }
      
      // Final result processing
      if (!result) {
        result = this.createIntelligentFallback(imageData, imageHash)
      }
      
      // Cache the result
      this.cache.set(imageHash, {
        data: result,
        timestamp: Date.now()
      })
      
      // Clean old cache entries
      this.cleanCache()
      
      console.log(`✅ Optimized analysis completed: ${result.isGarbageDetected ? 'WASTE DETECTED' : 'NO WASTE'}`)
      return result
      
    } catch (error) {
      console.error('❌ Optimized analysis error:', error)
      const imageHash = await this.calculateImageHash(imageData)
      return this.createIntelligentFallback(imageData, imageHash)
    }
  }

  private async performPhiVisionAnalysis(imageData: Uint8Array, imageHash: string): Promise<any> {
    try {
      console.log('🤖 Using Microsoft Phi-3.5 Vision for advanced analysis...')
      
      const base64Image = this.uint8ArrayToBase64(imageData)
      
      // Enhanced prompt for waste detection and classification (in French)
      const prompt = `Analysez cette image pour détecter la pollution environnementale et les déchets. Fournissez une réponse JSON détaillée UNIQUEMENT EN FRANÇAIS avec :
{
  "isGarbageDetected": boolean,
  "wasteLevel": "minimal|low|medium|high|critical",
  "wasteAmplitude": "trace|minimal|moderate|massive", 
  "wasteTypes": ["objets déchets spécifiques trouvés EN FRANÇAIS"],
  "wasteCategory": "recyclable|organic|hazardous|electronic|general",
  "urgencyScore": number (0-100),
  "confidence": number (0-100),
  "reasoning": "explication détaillée EN FRANÇAIS",
  "environmentalImpact": "description EN FRANÇAIS",
  "disposalInstructions": "comment bien éliminer EN FRANÇAIS",
  "preventionTips": ["suggestions de prévention EN FRANÇAIS"]
}

Concentrez-vous sur : bouteilles plastique, déchets alimentaires, mégots, emballages, électronique, produits chimiques, détritus, décharge sauvage. RÉPONDEZ UNIQUEMENT EN FRANÇAIS.`

      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/Phi-3.5-vision-instruct",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: {
              image: base64Image,
              text: prompt
            },
            options: {
              wait_for_model: true,
              use_cache: false
            }
          }),
        }
      )

      if (!response.ok) {
        console.error('❌ Phi Vision API error:', response.status)
        throw new Error(`Phi Vision API error: ${response.status}`)
      }

      const result = await response.json()
      console.log('📊 Phi Vision raw response:', result)
      
      // Parse the AI response
      return this.parseAIResponse(result, imageHash, 'phi-vision')
      
    } catch (error) {
      console.error('❌ Phi Vision analysis failed:', error)
      return null
    }
  }

  private async performViTAnalysis(imageData: Uint8Array, imageHash: string): Promise<any> {
    try {
      console.log('🔍 Using Google ViT for classification fallback...')
      
      const base64Image = this.uint8ArrayToBase64(imageData)
      
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
        console.error('❌ ViT API error:', response.status)
        throw new Error(`ViT API error: ${response.status}`)
      }

      const results = await response.json()
      console.log('📈 ViT classification results:', results)

      return this.processViTResults(results, imageHash)
      
    } catch (error) {
      console.error('❌ ViT analysis failed:', error)
      return null
    }
  }

  private parseAIResponse(aiResponse: any, imageHash: string, modelType: string): any {
    try {
      // Extract JSON from AI response
      let jsonData: any = null
      
      if (Array.isArray(aiResponse) && aiResponse[0]?.generated_text) {
        const text = aiResponse[0].generated_text
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[0])
        }
      }
      
      if (!jsonData) {
        throw new Error('No valid JSON found in AI response')
      }
      
      // Validate and enhance the response
      const detectedObjects = jsonData.wasteTypes?.map((type: string, index: number) => ({
        label: type,
        score: Math.max(60 - index * 5, 30) // Decreasing confidence scores
      })) || []
      
      return {
        isGarbageDetected: jsonData.isGarbageDetected || false,
        detectedObjects,
        imageHash,
        wasteLevel: jsonData.wasteLevel || 'minimal',
        wasteAmplitude: jsonData.wasteAmplitude || 'minimal',
        wasteTypes: jsonData.wasteTypes || [],
        environmentalImpact: jsonData.environmentalImpact || 'Faible impact environnemental détecté',
        urgencyScore: jsonData.urgencyScore || 20,
        confidence: jsonData.confidence || 70,
        reasoning: jsonData.reasoning || `Analysé par le modèle ${modelType}`,
        wasteCategory: jsonData.wasteCategory || 'general',
        disposalInstructions: jsonData.disposalInstructions || 'Jetez dans les poubelles appropriées',
        preventionTips: jsonData.preventionTips || ['Maintenir la propreté des zones', 'Utiliser des méthodes d\'élimination appropriées']
      }
      
    } catch (error) {
      console.error('❌ Error parsing AI response:', error)
      return null
    }
  }

  private processViTResults(results: any[], imageHash: string): any {
    const wasteKeywords = [
      'trash', 'garbage', 'waste', 'litter', 'bottle', 'can', 'cup', 'bag', 
      'food', 'wrapper', 'container', 'debris', 'rubbish', 'junk', 'plastic',
      'carton', 'paper', 'cigarette', 'tissue', 'napkin', 'plate', 'box',
      'packaging', 'metal', 'glass', 'aluminum', 'beverage', 'pollution'
    ]

    let isGarbageDetected = false
    const detectedObjects: Array<{ label: string; score: number }> = []
    let maxScore = 0

    if (Array.isArray(results)) {
      for (const result of results.slice(0, 10)) {
        const { label, score } = result
        const scorePercent = Math.round(score * 100)
        maxScore = Math.max(maxScore, scorePercent)
        
        detectedObjects.push({ label, score: scorePercent })
        
        const lowerLabel = label.toLowerCase()
        const isWasteRelated = wasteKeywords.some(keyword => 
          lowerLabel.includes(keyword)
        )
        
        if (isWasteRelated && score >= 0.25) {
          isGarbageDetected = true
          console.log(`✅ Waste detected: ${label} (${scorePercent}%)`)
        }
      }
    }

    // Smart fallback: if no clear waste but low overall confidence, flag for review
    if (!isGarbageDetected && maxScore < 70) {
      isGarbageDetected = true
      console.log('⚠️ Low confidence detection - flagging for manual review')
    }

    return {
      isGarbageDetected,
      detectedObjects: detectedObjects.slice(0, 5),
      imageHash,
      wasteLevel: isGarbageDetected ? 'low' : 'minimal',
      wasteAmplitude: isGarbageDetected ? 'minimal' : 'trace',
      wasteTypes: detectedObjects.filter(obj => obj.score > 30).map(obj => obj.label),
      environmentalImpact: isGarbageDetected ? 'Préoccupation environnementale potentielle détectée' : 'Aucun impact environnemental significatif',
      urgencyScore: isGarbageDetected ? Math.min(maxScore, 40) : 10,
      confidence: maxScore,
      reasoning: 'Analyse de classification Google ViT',
      wasteCategory: 'general',
      disposalInstructions: isGarbageDetected ? 'Veuillez jeter correctement dans les poubelles' : 'Aucune action d\'élimination nécessaire',
      preventionTips: ['Maintenir l\'environnement propre', 'Utiliser une élimination appropriée des déchets']
    }
  }

  private createIntelligentFallback(imageData: Uint8Array, imageHash: string): any {
    console.log('🔄 Creating intelligent fallback result...')
    
    // Conservative approach: assume waste present for manual review
    return {
      isGarbageDetected: true,
      detectedObjects: [{ label: 'Nécessite une vérification manuelle', score: 50 }],
      imageHash,
      wasteLevel: 'minimal' as const,
      wasteAmplitude: 'minimal' as const,
      wasteTypes: ['Inconnu - vérification manuelle nécessaire'],
      environmentalImpact: 'Vérification manuelle requise pour évaluer l\'impact',
      urgencyScore: 30,
      confidence: 50,
      reasoning: 'Analyse IA indisponible - solution de repli conservatrice appliquée',
      wasteCategory: 'general',
      disposalInstructions: 'Évaluation manuelle nécessaire pour l\'élimination appropriée',
      preventionTips: ['Suivez les directives locales de gestion des déchets']
    }
  }

  private checkRateLimit(): boolean {
    const now = Date.now()
    const oneMinute = 60 * 1000
    
    // Reset counter if more than a minute has passed
    if (now - this.lastRequestTime > oneMinute) {
      this.rateLimitCount = 0
    }
    
    this.lastRequestTime = now
    this.rateLimitCount++
    
    return this.rateLimitCount <= this.RATE_LIMIT_PER_MINUTE
  }

  private cleanCache(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key)
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

  generateOptimizedValidationMessage(result: any): string {
    if (!result.isGarbageDetected) {
      return `❌ <b>Aucun déchet détecté</b>

🔍 <b>Analyse IA gratuite :</b> ${result.confidence}% de confiance
${result.reasoning}

Si vous voyez des déchets, prenez une photo plus nette et proche. Merci !`
    }

    const urgencyLevel = result.urgencyScore > 60 ? 'ÉLEVÉE' : result.urgencyScore > 30 ? 'MODÉRÉE' : 'FAIBLE'
    const urgencyEmoji = result.urgencyScore > 60 ? '🚨' : result.urgencyScore > 30 ? '⚠️' : '✅'
    
    let message = `${urgencyEmoji} <b>Déchets détectés !</b> Analyse IA gratuite

🎯 <b>Objets identifiés :</b> ${result.wasteTypes?.slice(0, 3).join(', ') || 'Divers déchets'}
🗂️ <b>Catégorie :</b> ${this.translateCategory(result.wasteCategory)}
📊 <b>Niveau :</b> ${this.translateLevel(result.wasteLevel)} (${result.confidence}% confiance)
⚡ <b>Urgence :</b> ${urgencyLevel}

♻️ <b>Instructions :</b> ${result.disposalInstructions}

💡 <b>Prévention :</b> ${result.preventionTips?.slice(0, 2).join(', ') || 'Maintenir la propreté'}

🤖 <i>Analysé par IA gratuite Hugging Face</i>`

    return message
  }

  private translateCategory(category: string): string {
    const translations: { [key: string]: string } = {
      'recyclable': 'Recyclable ♻️',
      'organic': 'Organique 🍃',
      'hazardous': 'Dangereux ⚠️',
      'electronic': 'Électronique 🔌',
      'general': 'Général 🗑️'
    }
    return translations[category] || 'Général 🗑️'
  }

  private translateLevel(level: string): string {
    const translations: { [key: string]: string } = {
      'minimal': 'Minimal',
      'low': 'Faible', 
      'medium': 'Moyen',
      'high': 'Élevé',
      'critical': 'Critique'
    }
    return translations[level] || 'Inconnu'
  }
}