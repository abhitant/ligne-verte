export class WasteSorterAnalyzer {
  
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
  }> {
    try {
      console.log('🗂️ Starting waste classification analysis...')
      
      const imageHash = await this.calculateImageHash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Vérifications de base
      const imageSize = imageData.length
      if (imageSize < 5000) {
        return {
          isGarbageDetected: false,
          detectedObjects: [{ label: 'Image trop petite', score: 0 }],
          imageHash
        }
      }

      // Analyse IA avec classification des déchets
      const analysisResult = await this.performWasteClassification(imageData)
      
      if (!analysisResult.success) {
        // Fallback: accepter pour examen manuel
        return {
          isGarbageDetected: true,
          detectedObjects: [{ label: 'Classification manuelle requise', score: 70 }],
          imageHash,
          wasteCategory: 'GENERAL',
          disposalInstructions: 'Votre signalement sera examiné manuellement pour classification.'
        }
      }

      // Analyser et classifier les résultats
      const classification = this.classifyWasteFromResults(analysisResult.results)
      
      return {
        isGarbageDetected: classification.isWaste,
        detectedObjects: analysisResult.results,
        imageHash,
        wasteCategory: classification.category,
        disposalInstructions: classification.instructions
      }
    } catch (error) {
      console.error('❌ Waste classification error:', error)
      
      const imageHash = await this.calculateImageHash(imageData)
      return {
        isGarbageDetected: true, // Accepter en cas d'erreur
        detectedObjects: [{ label: 'Erreur de classification - examen manuel', score: 60 }],
        imageHash,
        wasteCategory: 'GENERAL'
      }
    }
  }

  private async performWasteClassification(imageData: Uint8Array): Promise<{
    success: boolean
    results: Array<{ label: string; score: number }>
  }> {
    const base64Image = this.uint8ArrayToBase64(imageData)
    
    try {
      // Utiliser plusieurs modèles pour une meilleure classification
      const models = [
        "microsoft/resnet-50", // Classification générale
        "google/vit-base-patch16-224", // Vision Transformer
      ]

      let bestResults: Array<{ label: string; score: number }> = []
      let maxScore = 0

      for (const model of models) {
        try {
          console.log(`🔍 Testing classification model: ${model}`)
          
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
                  wait_for_model: false,
                  use_cache: true
                }
              }),
            }
          )

          if (response.ok) {
            const results = await response.json()
            
            if (Array.isArray(results) && results.length > 0) {
              const processedResults = results.slice(0, 10).map((result: any) => ({
                label: result.label || 'unknown',
                score: Math.round((result.score || 0) * 100)
              }))
              
              const topScore = Math.max(...processedResults.map(r => r.score))
              if (topScore > maxScore) {
                maxScore = topScore
                bestResults = processedResults
              }
              
              console.log(`✅ Model ${model} results:`, processedResults.slice(0, 3))
            }
          }
        } catch (modelError) {
          console.error(`❌ Error with model ${model}:`, modelError)
        }
      }

      return {
        success: bestResults.length > 0,
        results: bestResults
      }
    } catch (error) {
      console.error('❌ Waste classification failed:', error)
      return { success: false, results: [] }
    }
  }

  private classifyWasteFromResults(results: Array<{ label: string; score: number }>): {
    isWaste: boolean
    category: string
    instructions: string
  } {
    if (results.length === 0) {
      return {
        isWaste: false,
        category: 'UNKNOWN',
        instructions: 'Impossible de classifier cette image.'
      }
    }

    // Analyser chaque résultat pour déterminer la catégorie
    let bestMatch = {
      category: 'GENERAL',
      confidence: 0,
      isWaste: false
    }

    for (const result of results) {
      const lowerLabel = result.label.toLowerCase()
      
      // Vérifier chaque catégorie de déchets
      for (const [categoryKey, categoryData] of Object.entries(this.WASTE_CATEGORIES)) {
        for (const item of categoryData.items) {
          if (lowerLabel.includes(item.toLowerCase()) || lowerLabel.includes(item.toLowerCase().replace(/\s+/g, ''))) {
            const confidence = result.score
            if (confidence > bestMatch.confidence) {
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
      const wasteKeywords = ['trash', 'garbage', 'waste', 'litter', 'debris', 'rubbish']
      const hasWasteKeyword = wasteKeywords.some(keyword => lowerLabel.includes(keyword))
      
      if (hasWasteKeyword && result.score > bestMatch.confidence) {
        bestMatch = {
          category: 'GENERAL',
          confidence: result.score,
          isWaste: true
        }
      }
    }

    // Si on n'a pas trouvé de déchets spécifiques, mais qu'on a des objets jetables
    if (!bestMatch.isWaste) {
      const commonTrashItems = ['bottle', 'can', 'cup', 'bag', 'container', 'wrapper', 'box']
      for (const result of results) {
        const lowerLabel = result.label.toLowerCase()
        const hasCommonTrash = commonTrashItems.some(item => lowerLabel.includes(item))
        
        if (hasCommonTrash && result.score >= 50) {
          bestMatch = {
            category: 'RECYCLABLE', // Supposer recyclable par défaut
            confidence: result.score,
            isWaste: true
          }
          break
        }
      }
    }

    const category = this.WASTE_CATEGORIES[bestMatch.category as keyof typeof this.WASTE_CATEGORIES]
    
    return {
      isWaste: bestMatch.isWaste,
      category: bestMatch.category,
      instructions: this.getDisposalInstructions(bestMatch.category, category)
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

  generateValidationMessage(
    isGarbageDetected: boolean, 
    detectedObjects: Array<{ label: string; score: number }>,
    wasteCategory?: string,
    disposalInstructions?: string
  ): string {
    if (isGarbageDetected) {
      const category = wasteCategory ? this.WASTE_CATEGORIES[wasteCategory as keyof typeof this.WASTE_CATEGORIES] : null
      
      let message = "✅ <b>Déchets détectés et classifiés !</b>\n\n"
      
      if (category) {
        message += `📋 <b>Type de déchet :</b> ${category.emoji} ${category.name}\n\n`
      }
      
      const topDetections = detectedObjects
        .filter(obj => obj.score > 30)
        .slice(0, 3)
        .map(obj => `• ${obj.label} (${obj.score}%)`)
      
      if (topDetections.length > 0) {
        message += `🎯 <b>Éléments identifiés :</b>\n${topDetections.join('\n')}\n\n`
      }
      
      if (disposalInstructions) {
        message += `♻️ <b>Instructions de tri :</b>\n${disposalInstructions}\n\n`
      }
      
      message += "🤖 <b>Signalement validé automatiquement</b> par notre IA de classification des déchets."
      
      return message
    } else {
      let message = "❌ <b>Aucun déchet détecté dans cette image.</b>\n\n"
      
      if (detectedObjects.length > 0) {
        const obj = detectedObjects[0]
        if (obj.label.includes('petite')) {
          message += "📏 L'image est trop petite. Prenez une photo plus grande et plus nette."
        } else {
          const items = detectedObjects.slice(0, 3).map(obj => obj.label)
          message += `ℹ️ <b>Éléments détectés :</b> ${items.join(', ')}\n\n`
          message += "💡 <b>Conseils pour un bon signalement :</b>\n"
          message += "• Prenez la photo plus près des déchets\n"
          message += "• Assurez-vous que les déchets sont bien visibles\n"
          message += "• Évitez les photos floues"
        }
      }
      
      return message
    }
  }
}