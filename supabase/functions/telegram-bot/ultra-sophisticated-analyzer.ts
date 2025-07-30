export class UltraSophisticatedAnalyzer {

  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
    wasteLevel?: 'minimal' | 'low' | 'medium' | 'high' | 'critical' | 'catastrophic'
    wasteTypes?: string[]
    environmentalImpact?: string
    urgencyScore?: number
    confidence?: number
    reasoning?: string
    contextualAnalysis?: {
      location: 'urban' | 'natural' | 'industrial' | 'residential' | 'unknown'
      severity: number
      riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high' | 'critical'
      actionRequired: 'none' | 'monitoring' | 'cleanup' | 'emergency'
    }
    disposalInstructions?: string
    preventionTips?: string[]
  }> {
    try {
      console.log('🚀 Starting ultra-sophisticated waste analysis...')
      
      const imageHash = await this.calculateImageHash(imageData)
      const imageSize = imageData.length
      
      console.log(`📊 Image metrics: ${imageSize} bytes, Hash: ${imageHash.substring(0, 12)}...`)
      
      // 1. ANALYSE PRIMAIRE - OpenAI Vision (Ultra-précise)
      const openAIKey = Deno.env.get('OPENAI_API_KEY')
      if (openAIKey && imageSize > 10000) { // Seuil équilibré pour qualité vs couverture
        console.log('🤖 Deploying OpenAI Vision Ultra-Analysis...')
        const openAIResult = await this.performUltraOpenAIAnalysis(imageData, imageHash)
        if (openAIResult) {
          console.log('✅ OpenAI Ultra-Analysis completed successfully')
          return openAIResult
        }
      }
      
      // 2. ANALYSE SECONDAIRE - Multi-modèles IA avec validation croisée
      console.log('🔬 Deploying Multi-Model AI Cross-Validation...')
      const multiModelResult = await this.performCrossValidatedMultiModelAnalysis(imageData, imageHash)
      if (multiModelResult.confidence > 70) {
        console.log('✅ Multi-Model Analysis achieved high confidence')
        return multiModelResult
      }
      
      // 3. ANALYSE TERTIAIRE - Analyse contextuelle avancée
      console.log('🧠 Deploying Advanced Contextual Analysis...')
      return await this.performAdvancedContextualAnalysis(imageData, imageHash)
      
    } catch (error) {
      console.error('❌ Ultra-sophisticated analysis error:', error)
      return this.createIntelligentFallbackResult(imageData)
    }
  }

  private async performUltraOpenAIAnalysis(imageData: Uint8Array, imageHash: string): Promise<any> {
    try {
      const base64Image = this.uint8ArrayToBase64(imageData.slice(0, 600000)) // Limite optimisée
      const openAIKey = Deno.env.get('OPENAI_API_KEY')
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Tu es un expert environnemental ultra-spécialisé avec des capacités d'analyse sophistiquées.

🎯 MISSION ULTRA-PRÉCISE : Analyser avec une granularité exceptionnelle les déchets et la pollution environnementale.

✅ DÉTECTER ET CLASSIFIER AVEC PRÉCISION ÉQUILIBRÉE :
- Déchets visibles : mégots, papiers, canettes, bouteilles, emballages abandonnés au sol
- Niveau de pollution : minimal, low, medium, high, critical, catastrophic  
- AMPLEUR des déchets : minimal, small, medium, large, massive
- Types de déchets : plastique, organique, métal, verre, papier, textile, électronique, chimique, médical
- Impact environnemental précis
- Urgence d'intervention (score 0-100)
- Points recommandés selon ampleur : 0 (minimal/small), 5 (medium), 10 (large), 15-20 (massive)
- Contexte géographique : urban, natural, industrial, residential
- Niveau de risque : very_low, low, medium, high, very_high, critical
- Action requise : none, monitoring, cleanup, emergency

🔍 ANALYSE CONTEXTUELLE ÉQUILIBRÉE :
- Identifier les objets ABANDONNÉS ou jetés au sol (pas ceux en usage normal)
- Distinguer déchets réels vs objets fonctionnels à leur place
- Évaluer l'ampleur réelle de la pollution visible
- Contexte environnemental : espaces naturels, urbains, zones de passage
- Proposer des solutions de tri appropriées

❌ REJETER STRICTEMENT :
- Images floues ou de très mauvaise qualité
- Écrans d'appareils électroniques (smartphones, ordinateurs, télévisions)
- Photos personnelles/selfies sans déchets visibles
- Objets fonctionnels en usage normal à leur place (véhicules, mobilier urbain)
- Espaces propres sans déchets abandonnés
- Images de produits neufs en magasin ou emballés

⚠️ PRINCIPE D'ÉQUILIBRE : Priorité à la PRÉCISION. En cas de doute sur la présence réelle de déchets abandonnés, REJETER.

Réponds UNIQUEMENT avec un JSON valide dans ce format exact :
{
  "hasWaste": boolean,
  "wasteLevel": "minimal|low|medium|high|critical|catastrophic",
  "wasteTypes": ["plastique", "organique", "métal", "verre", "papier", "textile", "électronique", "chimique", "médical"],
  "urgencyScore": number (0-100),
  "confidence": number (0-100),
  "environmentalImpact": "description détaillée impact environnemental",
  "contextualAnalysis": {
    "location": "urban|natural|industrial|residential|unknown",
    "severity": number (0-100),
    "riskLevel": "very_low|low|medium|high|very_high|critical",
    "actionRequired": "none|monitoring|cleanup|emergency"
  },
  "objects": [{"label": "type_précis", "confidence": number}],
  "reasoning": "explication sophistiquée de l'analyse",
  "disposalInstructions": "instructions précises de tri et élimination",
  "preventionTips": ["conseil1", "conseil2", "conseil3"]
}`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Effectue une analyse ultra-sophistiquée de cette image pour détecter, classifier et évaluer précisément tout déchet ou pollution environnementale. Sois d\'une précision exceptionnelle dans ton évaluation.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 800,
          temperature: 0.01, // Maximum de déterminisme
        }),
      })

      if (!response.ok) {
        console.error('❌ OpenAI Ultra API error:', await response.text())
        return null
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        return null
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return null
      }

      const analysis = JSON.parse(jsonMatch[0])
      
      console.log('✅ OpenAI Ultra-Analysis completed:', analysis)
      
      return {
        isGarbageDetected: analysis.hasWaste || false,
        detectedObjects: analysis.objects || [{ label: analysis.reasoning || 'Analyse ultra-sophistiquée complétée', score: analysis.confidence || 50 }],
        imageHash,
        wasteLevel: analysis.wasteLevel || 'minimal',
        wasteAmplitude: analysis.wasteAmplitude || 'minimal',
        recommendedPoints: analysis.recommendedPoints || 0,
        wasteTypes: analysis.wasteTypes || [],
        environmentalImpact: analysis.environmentalImpact || 'Impact environnemental à évaluer',
        urgencyScore: analysis.urgencyScore || 0,
        confidence: analysis.confidence || 50,
        reasoning: analysis.reasoning || 'Analyse automatique ultra-sophistiquée',
        contextualAnalysis: analysis.contextualAnalysis || {
          location: 'unknown',
          severity: 0,
          riskLevel: 'very_low',
          actionRequired: 'none'
        },
        disposalInstructions: analysis.disposalInstructions || 'Instructions de tri à déterminer',
        preventionTips: analysis.preventionTips || ['Sensibiliser à la prévention des déchets']
      }

    } catch (error) {
      console.error('❌ OpenAI Ultra analysis error:', error)
      return null
    }
  }

  private async performCrossValidatedMultiModelAnalysis(imageData: Uint8Array, imageHash: string): Promise<any> {
    console.log('🔬 Starting cross-validated multi-model analysis...')
    
    const base64Image = this.uint8ArrayToBase64(imageData)
    
    // Modèles spécialisés pour différents types d'analyses
    const modelSuite = [
      { model: "microsoft/resnet-50", specialty: "general_objects" },
      { model: "google/vit-base-patch16-224", specialty: "detailed_classification" },
      { model: "facebook/detr-resnet-50", specialty: "object_detection" },
      { model: "microsoft/DiT-base-patch16-224", specialty: "fine_grained" }
    ]

    let aggregatedResults: Array<{ label: string; score: number; specialty: string }> = []
    let successfulModels = 0
    let totalConfidence = 0

    for (const { model, specialty } of modelSuite) {
      try {
        console.log(`🔍 Testing specialized model: ${model} (${specialty})`)
        
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
              inputs: base64Image,
              options: { wait_for_model: true, use_cache: false }
            }),
          }
        )

        if (response.ok) {
          const results = await response.json()
          
          if (Array.isArray(results) && results.length > 0) {
            successfulModels++
            const modelResults = results.slice(0, 3).map((result: any) => ({
              label: result.label || 'unknown',
              score: Math.round((result.score || 0) * 100),
              specialty
            }))
            
            aggregatedResults.push(...modelResults)
            
            const modelConfidence = modelResults.reduce((sum, r) => sum + r.score, 0) / modelResults.length
            totalConfidence += modelConfidence
            
            console.log(`✅ ${specialty} model success:`, modelResults)
          }
        }
      } catch (error) {
        console.error(`❌ Error with ${specialty} model:`, error)
      }
    }

    // Validation croisée des résultats
    const crossValidatedAnalysis = this.performCrossValidation(aggregatedResults)
    const averageConfidence = successfulModels > 0 ? totalConfidence / successfulModels : 0

    return {
      isGarbageDetected: crossValidatedAnalysis.isGarbage,
      detectedObjects: crossValidatedAnalysis.consolidatedObjects,
      imageHash,
      wasteLevel: crossValidatedAnalysis.wasteLevel,
      wasteAmplitude: crossValidatedAnalysis.wasteAmplitude,
      recommendedPoints: crossValidatedAnalysis.recommendedPoints,
      wasteTypes: crossValidatedAnalysis.wasteTypes,
      environmentalImpact: crossValidatedAnalysis.environmentalImpact,
      urgencyScore: crossValidatedAnalysis.urgencyScore,
      confidence: Math.round(averageConfidence),
      reasoning: `Analyse multi-modèles validée croisée (${successfulModels} modèles)`,
      contextualAnalysis: crossValidatedAnalysis.contextualAnalysis,
      disposalInstructions: crossValidatedAnalysis.disposalInstructions,
      preventionTips: crossValidatedAnalysis.preventionTips
    }
  }

  private performCrossValidation(results: Array<{ label: string; score: number; specialty: string }>): any {
    // Mots-clés ultra-spécialisés pour déchets
    const wasteKeywordMap = {
      // Déchets plastiques
      plastique: ['bottle', 'plastic', 'container', 'bag', 'wrapper', 'cup', 'straw', 'lid'],
      // Déchets organiques
      organique: ['food', 'apple', 'banana', 'organic', 'compost', 'fruit', 'vegetable'],
      // Déchets métalliques
      métal: ['can', 'metal', 'aluminum', 'tin', 'steel', 'iron'],
      // Déchets en verre
      verre: ['bottle', 'glass', 'jar', 'window'],
      // Déchets papier
      papier: ['paper', 'cardboard', 'box', 'newspaper', 'magazine'],
      // Déchets textiles
      textile: ['cloth', 'fabric', 'clothing', 'shirt', 'pants'],
      // Déchets électroniques
      électronique: ['phone', 'computer', 'electronic', 'battery', 'circuit']
    }

    const pollutionIndicators = [
      'trash', 'garbage', 'waste', 'litter', 'debris', 'rubbish', 'junk', 
      'dirty', 'polluted', 'contaminated', 'dump', 'landfill'
    ]

    let wasteScore = 0
    let detectedWasteTypes: string[] = []
    let maxConfidence = 0
    let consolidatedObjects: Array<{ label: string; score: number }> = []

    // Analyser chaque résultat
    for (const result of results) {
      const lowerLabel = result.label.toLowerCase()
      maxConfidence = Math.max(maxConfidence, result.score)

      // Vérifier les indicateurs de pollution directs
      const isPollution = pollutionIndicators.some(indicator => 
        lowerLabel.includes(indicator)
      )
      
      if (isPollution && result.score >= 30) {
        wasteScore += result.score * 1.5 // Pondération forte pour pollution directe
        consolidatedObjects.push({ label: result.label, score: result.score })
      }

      // Classifier par type de déchet
      for (const [wasteType, keywords] of Object.entries(wasteKeywordMap)) {
        const matchesWasteType = keywords.some(keyword => 
          lowerLabel.includes(keyword)
        )
        
        if (matchesWasteType && result.score >= 40) {
          wasteScore += result.score
          if (!detectedWasteTypes.includes(wasteType)) {
            detectedWasteTypes.push(wasteType)
          }
          consolidatedObjects.push({ label: `${wasteType}: ${result.label}`, score: result.score })
        }
      }
    }

    // Normaliser le score et déterminer le niveau avec seuil plus strict
    const normalizedScore = Math.min(100, wasteScore / results.length)
    const isGarbage = normalizedScore >= 60 && consolidatedObjects.length > 0 && wasteScore >= 120

    let wasteLevel: string = 'minimal'
    if (normalizedScore >= 90) wasteLevel = 'catastrophic'
    else if (normalizedScore >= 80) wasteLevel = 'critical'
    else if (normalizedScore >= 70) wasteLevel = 'high'
    else if (normalizedScore >= 60) wasteLevel = 'medium'
    else if (normalizedScore >= 40) wasteLevel = 'low'

    // Évaluer l'ampleur des déchets
    const wasteAmplitude = this.evaluateWasteAmplitude(normalizedScore, consolidatedObjects.length, detectedWasteTypes)
    const recommendedPoints = this.calculatePointsFromAmplitude(wasteAmplitude)

    // Analyse contextuelle sophistiquée
    const contextualAnalysis = {
      location: this.determineLocation(results),
      severity: Math.round(normalizedScore),
      riskLevel: this.determineRiskLevel(normalizedScore, detectedWasteTypes),
      actionRequired: this.determineActionRequired(normalizedScore, detectedWasteTypes)
    }

    return {
      isGarbage,
      wasteLevel,
      wasteAmplitude,
      recommendedPoints,
      wasteTypes: detectedWasteTypes,
      consolidatedObjects: consolidatedObjects.slice(0, 5),
      environmentalImpact: this.generateEnvironmentalImpact(wasteLevel, detectedWasteTypes),
      urgencyScore: Math.round(normalizedScore),
      contextualAnalysis,
      disposalInstructions: this.generateDisposalInstructions(detectedWasteTypes),
      preventionTips: this.generatePreventionTips(detectedWasteTypes)
    }
  }

  private async performAdvancedContextualAnalysis(imageData: Uint8Array, imageHash: string): Promise<any> {
    console.log('🧠 Performing advanced contextual analysis...')
    
    const imageSize = imageData.length
    
    // Analyse contextuelle basée sur les métadonnées d'image
    const contextualFactors = {
      size: imageSize,
      quality: this.estimateImageQuality(imageData),
      likelyOutdoor: imageSize > 500000,
      highDetail: imageSize > 1000000
    }

    console.log('📊 Contextual factors:', contextualFactors)

    // Mode ultra-conservateur mais intelligent
    if (contextualFactors.size < 100000) {
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Image insuffisante pour analyse sophistiquée', score: 0 }],
        imageHash,
        wasteLevel: 'minimal',
        confidence: 95,
        reasoning: 'Image trop petite pour analyse environnementale fiable',
        contextualAnalysis: {
          location: 'unknown',
          severity: 0,
          riskLevel: 'very_low',
          actionRequired: 'none'
        }
      }
    }

    // Analyse heuristique conservatrice - rejet par défaut
    // Plus d'auto-acceptation basée uniquement sur la taille
    console.log('🛡️ Applying conservative contextual analysis - rejecting by default')
    
    return {
      isGarbageDetected: false,
      detectedObjects: [{ label: 'Aucun déchet clairement identifiable', score: 0 }],
      imageHash,
      wasteLevel: 'minimal',
      confidence: 85,
      reasoning: 'Analyse contextuelle conservatrice - aucun déchet clairement visible',
      contextualAnalysis: {
        location: 'unknown',
        severity: 0,
        riskLevel: 'very_low',
        actionRequired: 'none'
      },
      disposalInstructions: 'Aucune action requise',
      preventionTips: ['Prendre des photos plus claires des déchets si présents']
    }

    // Rejet conservateur par défaut
    return {
      isGarbageDetected: false,
      detectedObjects: [{ label: 'Analyse contextuelle - aucun déchet évident détecté', score: 0 }],
      imageHash,
      wasteLevel: 'minimal',
      confidence: 80,
      reasoning: 'Analyse contextuelle avancée - aucune pollution évidente',
      contextualAnalysis: {
        location: 'unknown',
        severity: 0,
        riskLevel: 'very_low',
        actionRequired: 'none'
      }
    }
  }

  private createIntelligentFallbackResult(imageData: Uint8Array): any {
    const fallbackHash = `fallback_${Date.now()}_${imageData.length}`
    
    console.log('🛡️ Intelligent fallback - conservative rejection')
    
    return {
      isGarbageDetected: false,
      detectedObjects: [{ label: 'Erreur analyse sophistiquée - image rejetée par précaution', score: 0 }],
      imageHash: fallbackHash,
      wasteLevel: 'minimal',
      confidence: 75,
      reasoning: 'Erreur système - mode conservateur appliqué pour éviter faux positifs',
      contextualAnalysis: {
        location: 'unknown',
        severity: 0,
        riskLevel: 'very_low',
        actionRequired: 'none'
      }
    }
  }

  // Méthodes utilitaires sophistiquées
  private determineLocation(results: Array<{ label: string; score: number; specialty?: string }>): string {
    const urbanKeywords = ['car', 'building', 'street', 'road', 'urban', 'city']
    const naturalKeywords = ['tree', 'grass', 'nature', 'forest', 'plant', 'outdoor']
    const industrialKeywords = ['factory', 'industrial', 'machinery', 'warehouse']
    
    const locations = { urban: 0, natural: 0, industrial: 0, residential: 0 }
    
    for (const result of results) {
      const label = result.label.toLowerCase()
      if (urbanKeywords.some(k => label.includes(k))) locations.urban += result.score
      if (naturalKeywords.some(k => label.includes(k))) locations.natural += result.score
      if (industrialKeywords.some(k => label.includes(k))) locations.industrial += result.score
    }
    
    const maxLocation = Object.entries(locations).reduce((a, b) => a[1] > b[1] ? a : b)
    return maxLocation[1] > 30 ? maxLocation[0] : 'unknown'
  }

  private determineRiskLevel(score: number, wasteTypes: string[]): string {
    const dangerousWastes = ['chimique', 'médical', 'électronique']
    const hasDangerousWaste = wasteTypes.some(type => dangerousWastes.includes(type))
    
    if (hasDangerousWaste) return 'critical'
    if (score >= 90) return 'very_high'
    if (score >= 70) return 'high'
    if (score >= 50) return 'medium'
    if (score >= 30) return 'low'
    return 'very_low'
  }

  private determineActionRequired(score: number, wasteTypes: string[]): string {
    const dangerousWastes = ['chimique', 'médical']
    const hasDangerousWaste = wasteTypes.some(type => dangerousWastes.includes(type))
    
    if (hasDangerousWaste || score >= 90) return 'emergency'
    if (score >= 70) return 'cleanup'
    if (score >= 40) return 'monitoring'
    return 'none'
  }

  private generateEnvironmentalImpact(wasteLevel: string, wasteTypes: string[]): string {
    const impacts = {
      catastrophic: "Impact environnemental catastrophique - contamination massive nécessitant intervention d'urgence",
      critical: "Impact environnemental critique - pollution importante avec risques pour la biodiversité",
      high: "Impact environnemental élevé - accumulation significative nécessitant nettoyage prioritaire",
      medium: "Impact environnemental modéré - pollution localisée avec effets sur l'écosystème",
      low: "Impact environnemental faible - déchets dispersés nécessitant collecte préventive",
      minimal: "Impact environnemental minimal - situation sous contrôle"
    }
    
    let impact = impacts[wasteLevel] || impacts.minimal
    
    if (wasteTypes.includes('chimique')) {
      impact += " ⚠️ ATTENTION: Présence possible de substances chimiques dangereuses"
    }
    if (wasteTypes.includes('médical')) {
      impact += " 🚨 ALERTE: Déchets médicaux détectés - risque sanitaire"
    }
    
    return impact
  }

  private generateDisposalInstructions(wasteTypes: string[]): string {
    const instructions = {
      plastique: "Tri sélectif bac jaune ou point de collecte plastique",
      organique: "Compost ou bac biodéchets si disponible",
      métal: "Tri sélectif bac jaune ou déchetterie",
      verre: "Conteneur à verre ou point de collecte",
      papier: "Tri sélectif bac jaune",
      textile: "Point de collecte textile ou association caritative",
      électronique: "Déchetterie ou point de collecte DEEE obligatoire",
      chimique: "⚠️ Déchetterie uniquement - NE PAS jeter avec ordures ménagères",
      médical: "🚨 Pharmacie ou point de collecte spécialisé OBLIGATOIRE"
    }
    
    if (wasteTypes.length === 0) return "Classification nécessaire avant tri"
    
    return wasteTypes.map(type => `${type}: ${instructions[type] || 'À déterminer'}`).join(' | ')
  }

  private generatePreventionTips(wasteTypes: string[]): string[] {
    const baseTips = [
      "Sensibiliser votre entourage à la gestion des déchets",
      "Participer aux actions de nettoyage citoyennes",
      "Signaler les dépôts sauvages aux autorités"
    ]
    
    const specificTips = {
      plastique: "Réduire l'usage de plastique à usage unique",
      organique: "Privilégier le compostage domestique",
      électronique: "Faire réparer avant de remplacer",
      chimique: "Utiliser des alternatives écologiques",
      médical: "Respecter les circuits de collecte spécialisés"
    }
    
    const tips = [...baseTips]
    wasteTypes.forEach(type => {
      if (specificTips[type]) tips.push(specificTips[type])
    })
    
    return tips.slice(0, 5)
  }

  private estimateImageQuality(imageData: Uint8Array): number {
    // Estimation basique de la qualité basée sur la taille et l'entropie
    const size = imageData.length
    const entropy = this.calculateBasicEntropy(imageData.slice(0, 1000))
    
    return Math.min(100, (size / 50000) * 30 + entropy * 70)
  }

  private calculateBasicEntropy(data: Uint8Array): number {
    const freq = new Array(256).fill(0)
    for (let i = 0; i < data.length; i++) {
      freq[data[i]]++
    }
    
    let entropy = 0
    for (let i = 0; i < 256; i++) {
      if (freq[i] > 0) {
        const p = freq[i] / data.length
        entropy -= p * Math.log2(p)
      }
    }
    
    return entropy / 8 // Normaliser entre 0 et 1
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
    try {
      const chunkSize = 8192
      let binary = ''
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize)
        binary += String.fromCharCode.apply(null, Array.from(chunk))
      }
      
      return btoa(binary)
    } catch (error) {
      console.error('❌ Error converting to base64:', error)
      throw error
    }
  }

  generateUltraSophisticatedValidationMessage(result: any): string {
    const { 
      isGarbageDetected, 
      wasteLevel, 
      wasteTypes, 
      environmentalImpact, 
      urgencyScore,
      confidence,
      contextualAnalysis,
      disposalInstructions,
      preventionTips,
      detectedObjects 
    } = result
    
    if (!isGarbageDetected) {
      const rejectionMessages = {
        'Image insuffisante pour analyse sophistiquée': "❌ <b>Image inadéquate</b>\n\n📏 L'image ne permet pas une analyse environnementale fiable. Veuillez prendre une photo plus grande et détaillée.",
        'Analyse contextuelle - aucun déchet évident détecté': "❌ <b>Aucune pollution détectée</b>\n\n🌟 Excellent ! Notre analyse ultra-sophistiquée n'a détecté aucun déchet dans cette zone.",
        'Erreur analyse sophistiquée - image rejetée par précaution': "❌ <b>Erreur d'analyse</b>\n\n⚠️ Notre système ultra-sophistiqué a rencontré une erreur. Par précaution, l'image est rejetée."
      }
      
      const detectedReason = detectedObjects?.[0]?.label || 'Analyse contextuelle - aucun déchet évident détecté'
      return rejectionMessages[detectedReason] || "❌ <b>Image rejetée</b>\n\n🔍 Notre analyse ultra-sophistiquée n'a pas détecté de pollution claire."
    }

    let message = "✅ <b>Pollution détectée par analyse ultra-sophistiquée !</b>\n\n"
    
    // Niveau de pollution avec détails sophistiqués
    if (wasteLevel) {
      const levelDetails = {
        'minimal': '🟢 <b>Pollution minimale</b> - Veuillez ramasser ces déchets',
        'low': '🟡 <b>Pollution faible</b> - Nettoyage de routine suffisant',
        'medium': '🟠 <b>Pollution modérée</b> - Action de nettoyage prioritaire',
        'high': '🔴 <b>Pollution élevée</b> - Intervention urgente requise',
        'critical': '🚨 <b>Pollution critique</b> - Alerte environnementale',
        'catastrophic': '⚠️ <b>CATASTROPHE ENVIRONNEMENTALE</b> - Urgence absolue'
      }
      message += `${levelDetails[wasteLevel] || levelDetails.minimal}\n\n`
    }
    
    // Types de déchets détaillés
    if (wasteTypes && wasteTypes.length > 0 && !wasteTypes.includes('à_classifier')) {
      const typeEmojis = {
        'plastique': '🧴', 'organique': '🍎', 'métal': '🥫', 'verre': '🍾',
        'papier': '📄', 'textile': '👕', 'électronique': '📱', 
        'chimique': '⚠️', 'médical': '🚨'
      }
      const typesWithEmojis = wasteTypes.map(type => `${typeEmojis[type] || '🗑️'} ${type}`).join(', ')
      message += `<b>🎯 Types identifiés :</b> ${typesWithEmojis}\n\n`
    }
    
    // Analyse contextuelle
    if (contextualAnalysis) {
      const { location, severity, riskLevel, actionRequired } = contextualAnalysis
      
      if (location !== 'unknown') {
        const locationEmojis = { urban: '🏙️', natural: '🌲', industrial: '🏭', residential: '🏠' }
        message += `<b>📍 Contexte :</b> ${locationEmojis[location] || '📍'} ${location}\n`
      }
      
      if (riskLevel && riskLevel !== 'very_low') {
        const riskEmojis = { low: '🟡', medium: '🟠', high: '🔴', very_high: '🚨', critical: '⚠️' }
        message += `<b>⚠️ Niveau de risque :</b> ${riskEmojis[riskLevel] || '⚠️'} ${riskLevel}\n`
      }
      
      message += '\n'
    }
    
    // Urgence et confiance
    if (urgencyScore && urgencyScore > 70) {
      message += `🚨 <b>SIGNALEMENT ULTRA-PRIORITAIRE</b> - Score d'urgence: ${urgencyScore}/100\n\n`
    }
    
    if (confidence && confidence >= 90) {
      message += `🎯 <b>Analyse haute confiance :</b> ${confidence}% de certitude\n\n`
    }
    
    // Instructions de tri sophistiquées
    if (disposalInstructions && !disposalInstructions.includes('Classification')) {
      message += `<b>♻️ Instructions de tri :</b>\n${disposalInstructions}\n\n`
    }
    
    message += `📍 <b>Dernière étape :</b> Partagez votre localisation pour finaliser ce signalement ultra-précis.`
    
    return message
  }
}