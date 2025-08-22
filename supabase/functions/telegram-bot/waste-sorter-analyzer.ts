export class WasteSorterAnalyzer {
  
  // Seuils de confiance pour la validation
  private readonly CONFIDENCE_THRESHOLDS = {
    HIGH: 0.7,      // Confiance élevée - validation automatique
    MEDIUM: 0.4,    // Confiance moyenne - accepter avec réserve
    LOW: 0.2        // Confiance faible - rejeter
  }

  // Timeout pour les requêtes API (5 secondes)
  private readonly API_TIMEOUT = 5000

  // Types de déchets basés sur le projet waste-sorter
  private readonly WASTE_CATEGORIES = {
    RECYCLABLE: {
      name: 'Recyclable',
      emoji: '♻️',
      color: 'green',
      items: ['plastic bottle', 'glass bottle', 'aluminum can', 'paper', 'cardboard', 'metal', 'tin can']
    },
    ORGANIC: {
      name: 'Organique',
      emoji: '🌱',
      color: 'brown',
      items: ['food waste', 'fruit peel', 'vegetable', 'organic matter', 'compost']
    },
    HAZARDOUS: {
      name: 'Dangereux',
      emoji: '⚠️',
      color: 'red',
      items: ['battery', 'electronics', 'chemical', 'medical waste', 'toxic', 'paint']
    },
    GENERAL: {
      name: 'Non-recyclable',
      emoji: '🗑️',
      color: 'gray',
      items: ['general waste', 'mixed waste', 'non-recyclable plastic', 'cigarette butt']
    }
  }

  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
    wasteCategory?: string
    disposalInstructions?: string
    confidence?: number
    processingTime?: number
  }> {
    const startTime = Date.now()
    
    try {
      console.log('🗂️ Starting optimized waste classification analysis...')
      console.log('📊 Original image size:', imageData.length, 'bytes')
      
      const imageHash = await this.calculateImageHash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Vérifications de base
      if (imageData.length < 5000) {
        console.log('❌ Image too small for analysis (<5KB)')
        return {
          isGarbageDetected: false,
          detectedObjects: [{ label: 'Image trop petite pour une analyse fiable', score: 0 }],
          imageHash,
          confidence: 0,
          processingTime: Date.now() - startTime
        }
      }

      // Compression optimisée de l'image pour réduire la latence
      const compressedImageData = await this.compressImage(imageData)
      console.log('🗜️ Image compressed:', compressedImageData.length, 'bytes (-', 
        Math.round((1 - compressedImageData.length / imageData.length) * 100), '%)')
      
      // Analyse IA avec timeout et gestion d'erreur améliorée

      const analysisResult = await this.performWasteClassificationWithTimeout(compressedImageData)
      
      if (!analysisResult.success) {
        console.log('⚠️ Analysis failed - fallback to manual review')
        return {
          isGarbageDetected: false, // Rejeter si l'analyse échoue
          detectedObjects: [{ label: 'Analyse indisponible - veuillez réessayer', score: 0 }],
          imageHash,
          confidence: 0,
          processingTime: Date.now() - startTime
        }
      }

      // Analyser et classifier les résultats avec seuils de confiance
      const classification = this.classifyWasteFromResultsWithConfidence(analysisResult.results)
      
      const processingTime = Date.now() - startTime
      console.log(`⏱️ Total processing time: ${processingTime}ms`)
      console.log(`🎯 Final result: ${classification.isWaste ? 'WASTE DETECTED' : 'NO WASTE'} (confidence: ${classification.confidence})`)
      
      return {
        isGarbageDetected: classification.isWaste,
        detectedObjects: analysisResult.results.slice(0, 5),
        imageHash,
        wasteCategory: classification.category,
        disposalInstructions: classification.instructions,
        confidence: classification.confidence,
        processingTime
      }
    } catch (error) {
      console.error('❌ Waste classification error:', error)
      
      const imageHash = await this.calculateImageHash(imageData)
      const processingTime = Date.now() - startTime
      
      return {
        isGarbageDetected: false, // Rejeter en cas d'erreur pour éviter les faux positifs
        detectedObjects: [{ label: `Erreur d'analyse: ${error.message}`, score: 0 }],
        imageHash,
        confidence: 0,
        processingTime
      }
    }
  }

  // Compression d'image optimisée pour réduire la latence
  private async compressImage(imageData: Uint8Array): Promise<Uint8Array> {
    try {
      // Pour les images déjà petites, pas de compression nécessaire
      if (imageData.length < 100000) {
        return imageData
      }
      
      // Simple compression par troncature pour les très grandes images
      // TODO: Implémenter une vraie compression JPEG si nécessaire
      const maxSize = 500000 // 500KB max
      if (imageData.length > maxSize) {
        console.log('🗜️ Large image detected, applying basic compression')
        // Garde les premiers octets (header JPEG) + échantillonnage
        const headerSize = Math.min(20000, Math.floor(imageData.length * 0.1))
        const sampleStep = Math.floor(imageData.length / maxSize)
        
        const compressed = new Uint8Array(maxSize)
        let index = 0
        
        // Copier l'en-tête
        for (let i = 0; i < headerSize && index < maxSize; i++) {
          compressed[index++] = imageData[i]
        }
        
        // Échantillonner le reste
        for (let i = headerSize; i < imageData.length && index < maxSize; i += sampleStep) {
          compressed[index++] = imageData[i]
        }
        
        return compressed.slice(0, index)
      }
      
      return imageData
    } catch (error) {
      console.error('❌ Image compression failed:', error)
      return imageData
    }
  }

  private async performWasteClassificationWithTimeout(imageData: Uint8Array): Promise<{
    success: boolean
    results: Array<{ label: string; score: number }>
  }> {
    try {
      const base64Image = this.uint8ArrayToBase64(imageData)
      
      console.log('🔍 Starting AI classification with timeout...')
      
      // Promesse avec timeout pour éviter les blocages
      const classificationPromise = this.performClassificationRequest(base64Image)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), this.API_TIMEOUT)
      )
      
      const results = await Promise.race([classificationPromise, timeoutPromise]) as Array<{ label: string; score: number }>
      
      if (!results || results.length === 0) {
        console.log('⚠️ No results from AI classification')
        return { success: false, results: [] }
      }
      
      // Log des résultats bruts pour audit
      console.log('📊 Raw AI results:', results.slice(0, 5).map(r => `${r.label}:${r.score}%`).join(', '))
      
      return {
        success: true,
        results: results.slice(0, 10) // Limiter à 10 résultats
      }
    } catch (error) {
      if (error.message === 'API timeout') {
        console.error('⏰ API request timeout after', this.API_TIMEOUT, 'ms')
      } else {
        console.error('❌ Classification request failed:', error)
      }
      return { success: false, results: [] }
    }
  }

  private async performClassificationRequest(base64Image: string): Promise<Array<{ label: string; score: number }>> {
    // Modèle principal optimisé pour la détection de déchets
    const primaryModel = "google/vit-base-patch16-224"
    
    try {
      console.log(`🔍 Using primary model: ${primaryModel}`)
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${primaryModel}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: base64Image,
            options: {
              wait_for_model: false,
              use_cache: true
            }
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const results = await response.json()
      
      if (!Array.isArray(results) || results.length === 0) {
        throw new Error('Invalid or empty response from AI model')
      }

      return results.map((result: any) => ({
        label: result.label || 'unknown',
        score: Math.round((result.score || 0) * 100)
      }))
    } catch (error) {
      console.error(`❌ Primary model ${primaryModel} failed:`, error)
      throw error
    }

  }

  private classifyWasteFromResultsWithConfidence(results: Array<{ label: string; score: number }>): {
    isWaste: boolean
    category: string
    instructions: string
    confidence: number
  } {
    if (results.length === 0) {
      console.log('❌ No results to classify')
      return {
        isWaste: false,
        category: 'UNKNOWN',
        instructions: 'Impossible de classifier cette image.',
        confidence: 0
      }
    }

    // Analyser chaque résultat pour déterminer la catégorie avec seuils de confiance
    let bestMatch = {
      category: 'GENERAL',
      confidence: 0,
      isWaste: false
    }

    console.log('🔍 Analyzing classification results with confidence thresholds:')

    for (const result of results) {
      const lowerLabel = result.label.toLowerCase()
      console.log(`   🔎 Checking: ${result.label} (${result.score}%)`)
      
      // Vérifier chaque catégorie de déchets
      for (const [categoryKey, categoryData] of Object.entries(this.WASTE_CATEGORIES)) {
        for (const item of categoryData.items) {
          if (lowerLabel.includes(item.toLowerCase()) || lowerLabel.includes(item.toLowerCase().replace(/\s+/g, ''))) {
            const confidence = result.score
            if (confidence > bestMatch.confidence) {
              console.log(`   ✅ Match found: ${item} -> ${categoryKey} (confidence: ${confidence}%)`)
              bestMatch = {
                category: categoryKey,
                confidence,
                isWaste: true
              }
            }
          }
        }
      }

      // Mots-clés généraux de déchets
      const wasteKeywords = ['trash', 'garbage', 'waste', 'litter', 'debris', 'rubbish', 'bottle', 'can', 'cup', 'container']
      const hasWasteKeyword = wasteKeywords.some(keyword => lowerLabel.includes(keyword))
      
      if (hasWasteKeyword && result.score > bestMatch.confidence) {
        console.log(`   🗑️ General waste keyword found: ${result.label}`)
        bestMatch = {
          category: 'GENERAL',
          confidence: result.score,
          isWaste: true
        }
      }
    }

    // Application des seuils de confiance
    const finalConfidence = bestMatch.confidence / 100 // Convertir en décimale pour comparaison
    let isValidWaste = false
    
    if (finalConfidence >= this.CONFIDENCE_THRESHOLDS.HIGH) {
      console.log(`🎯 HIGH confidence detection (${finalConfidence.toFixed(2)} >= ${this.CONFIDENCE_THRESHOLDS.HIGH})`)
      isValidWaste = bestMatch.isWaste
    } else if (finalConfidence >= this.CONFIDENCE_THRESHOLDS.MEDIUM) {
      console.log(`📊 MEDIUM confidence detection (${finalConfidence.toFixed(2)} >= ${this.CONFIDENCE_THRESHOLDS.MEDIUM})`)
      isValidWaste = bestMatch.isWaste
    } else if (finalConfidence >= this.CONFIDENCE_THRESHOLDS.LOW) {
      console.log(`⚠️ LOW confidence detection (${finalConfidence.toFixed(2)} >= ${this.CONFIDENCE_THRESHOLDS.LOW}) - REJECTED`)
      isValidWaste = false // Rejeter les détections peu fiables
    } else {
      console.log(`❌ Very low confidence (${finalConfidence.toFixed(2)} < ${this.CONFIDENCE_THRESHOLDS.LOW}) - REJECTED`)
      isValidWaste = false
    }

    const category = this.WASTE_CATEGORIES[bestMatch.category as keyof typeof this.WASTE_CATEGORIES]
    
    console.log(`🎯 Final decision: ${isValidWaste ? 'WASTE DETECTED' : 'NO WASTE'} | Category: ${bestMatch.category} | Confidence: ${finalConfidence.toFixed(2)}`)
    
    return {
      isWaste: isValidWaste,
      category: bestMatch.category,
      instructions: this.getDisposalInstructions(bestMatch.category, category),
      confidence: finalConfidence
    }
  }

  private getDisposalInstructions(categoryKey: string, category: any): string {
    const instructions = {
      RECYCLABLE: `${category.emoji} Jetez dans le bac de recyclage. Ces matériaux peuvent être transformés en nouveaux produits.`,
      ORGANIC: `${category.emoji} Compostez si possible ou jetez dans le bac à déchets organiques. Bon pour l'environnement !`,
      HAZARDOUS: `${category.emoji} ATTENTION ! À déposer dans un point de collecte spécialisé. Ne pas jeter dans les poubelles ordinaires.`,
      GENERAL: `${category.emoji} À jeter dans la poubelle générale. Malheureusement non-recyclable.`,
      UNKNOWN: '❓ Classification incertaine. Consultez les consignes locales de tri.'
    }

    return instructions[categoryKey as keyof typeof instructions] || instructions.UNKNOWN
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

  generateValidationMessage(result: {
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    wasteCategory?: string
    disposalInstructions?: string
    confidence?: number
    processingTime?: number
  }): string {
    const { isGarbageDetected, detectedObjects, wasteCategory, disposalInstructions, confidence, processingTime } = result
    if (isGarbageDetected) {
      const category = wasteCategory ? this.WASTE_CATEGORIES[wasteCategory as keyof typeof this.WASTE_CATEGORIES] : null
      
      let message = "✅ <b>Déchets détectés et classifiés !</b>\n\n"
      
      // Afficher la confiance si disponible
      if (confidence !== undefined) {
        const confidencePercent = Math.round(confidence * 100)
        let confidenceIcon = "📊"
        if (confidence >= this.CONFIDENCE_THRESHOLDS.HIGH) confidenceIcon = "🎯"
        else if (confidence >= this.CONFIDENCE_THRESHOLDS.MEDIUM) confidenceIcon = "📈"
        
        message += `${confidenceIcon} <b>Confiance:</b> ${confidencePercent}%\n`
      }
      
      if (category) {
        message += `📋 <b>Type de déchet:</b> ${category.emoji} ${category.name}\n\n`
      }
      
      const topDetections = detectedObjects
        .filter(obj => obj.score > 30)
        .slice(0, 3)
        .map(obj => `• ${obj.label} (${obj.score}%)`)
      
      if (topDetections.length > 0) {
        message += `🎯 <b>Éléments identifiés:</b>\n${topDetections.join('\n')}\n\n`
      }
      
      if (disposalInstructions) {
        message += `♻️ <b>Instructions de tri:</b>\n${disposalInstructions}\n\n`
      }
      
      if (processingTime) {
        message += `⏱️ <b>Analysé en:</b> ${processingTime}ms\n\n`
      }
      
      message += "🤖 <b>Signalement validé automatiquement</b> par notre IA optimisée."
      
      return message
    } else {
      let message = "❌ <b>Aucun déchet clairement identifié.</b>\n\n"
      
      // Afficher la confiance même en cas d'échec
      if (confidence !== undefined) {
        const confidencePercent = Math.round(confidence * 100)
        message += `📊 <b>Confiance:</b> ${confidencePercent}% (seuil minimum: ${Math.round(this.CONFIDENCE_THRESHOLDS.LOW * 100)}%)\n\n`
      }
      
      if (processingTime) {
        message += `⏱️ <b>Analysé en:</b> ${processingTime}ms\n\n`
      }
      
      if (detectedObjects.length > 0 && !detectedObjects[0].label.includes('Erreur')) {
        const items = detectedObjects.slice(0, 3)
          .filter(obj => obj.score > 0)
          .map(obj => `${obj.label} (${obj.score}%)`)
        
        if (items.length > 0) {
          message += `🔍 <b>Éléments détectés:</b>\n${items.join('\n')}\n\n`
          message += "⚠️ Confiance insuffisante pour validation automatique.\n\n"
        }
      }
      
      message += "💡 <b>Pour améliorer la détection:</b>\n"
      message += "• Prenez une photo plus nette et bien éclairée\n"
      message += "• Cadrez les déchets au centre de l'image\n"
      message += "• Évitez les arrière-plans complexes"
      
      return message
    }
  }
}