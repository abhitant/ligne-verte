export class EnhancedWasteAnalyzer {
  
  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
    wasteLevel?: 'low' | 'medium' | 'high' | 'critical'
    wasteTypes?: string[]
    environmentalImpact?: string
    urgencyScore?: number
  }> {
    try {
      console.log('🔍 Starting enhanced waste analysis...')
      
      const imageHash = await this.calculateImageHash(imageData)
      const imageSize = imageData.length
      
      // 1. PRIORISER OPENAI VISION - Réduire le seuil à 20KB
      const openAIKey = Deno.env.get('OPENAI_API_KEY')
      if (openAIKey && imageSize > 20000) { // Seuil réduit de 50KB à 20KB
        console.log(`🤖 Using OpenAI Vision (image: ${imageSize} bytes > 20KB threshold)`)
        return await this.performOpenAIAnalysis(imageData, imageHash)
      }
      
      // Analyse de fallback basée sur la taille et l'heuristique
      return await this.performHeuristicAnalysis(imageData, imageHash)
      
    } catch (error) {
      console.error('❌ Enhanced analysis error:', error)
      return this.createFallbackResult(imageData)
    }
  }

  private async performOpenAIAnalysis(imageData: Uint8Array, imageHash: string): Promise<any> {
    try {
      console.log('🤖 Using OpenAI Vision for waste analysis...')
      
      const base64Image = this.uint8ArrayToBase64(imageData.slice(0, 500000)) // Limiter la taille
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
              content: `Tu es un expert environnemental avec une mission STRICTE : rejeter les faux positifs.

              🎯 MISSION CRITIQUE : Éviter la sur-détection ! Être ultra-sélectif.
              
              ✅ SIGNALER UNIQUEMENT SI :
              - Déchets CLAIREMENT visibles et éparpillés
              - Accumulation ÉVIDENTE d'ordures 
              - Pollution environnementale MANIFESTE
              - Impact négatif ÉVIDENT sur l'espace

              ❌ REJETER IMPÉRATIVEMENT :
              - Images floues ou de mauvaise qualité
              - Espaces propres ou neutres
              - Objets utilisables ou en bon état
              - Poubelles fermées ou organisées
              - Véhicules, construction, infrastructure
              - Personnes, animaux, intérieurs
              - Nourriture fraîche
              - Cas douteux ou ambigus
              - Photos de selfies ou personnelles
              - Images sans déchets évidents

              🔍 EXEMPLES NÉGATIFS à rejeter :
              - "Une canette sur le sol" (trop mineur)
              - "Photo de nourriture" (non concerné)
              - "Selfie dans rue propre" (pas de pollution)
              - "Voiture garée" (infrastructure normale)
              - "Photo floue" (non analysable)

              ⚠️ SOYEZ CONSERVATEUR : En cas de doute, REJETER.
              
              Réponds UNIQUEMENT avec un JSON valide dans ce format exact :
              {
                "hasWaste": boolean,
                "wasteTypes": ["plastique", "organique", "métal", "verre", "papier", "mégots", "électronique"],
                "wasteLevel": "low|medium|high|critical", 
                "urgencyScore": number (0-100),
                "environmentalImpact": "description précise en 1-2 phrases",
                "objects": [{"label": "type_déchet", "confidence": number}],
                "confidence": number (0-100),
                "reasoning": "explication courte de la décision"
              }`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyse cette image pour détecter des déchets mal gérés ou de la pollution. Sois stricte : seuls les vrais problèmes environnementaux doivent être signalés.'
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
          max_tokens: 400,
          temperature: 0.05, // Plus déterministe pour la précision
        }),
      })

      if (!response.ok) {
        console.error('❌ OpenAI API error:', await response.text())
        return this.performHeuristicAnalysis(imageData, imageHash)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        return this.performHeuristicAnalysis(imageData, imageHash)
      }

      // Extraire le JSON de la réponse
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return this.performHeuristicAnalysis(imageData, imageHash)
      }

      const analysis = JSON.parse(jsonMatch[0])
      
      console.log('✅ OpenAI analysis completed:', analysis)
      
      return {
        isGarbageDetected: analysis.hasWaste || false,
        detectedObjects: analysis.objects || [{ label: analysis.reasoning || 'Analyse IA complétée', score: analysis.confidence || 50 }],
        imageHash,
        wasteLevel: analysis.wasteLevel || 'low',
        wasteTypes: analysis.wasteTypes || [],
        environmentalImpact: analysis.environmentalImpact || 'Impact à évaluer',
        urgencyScore: analysis.urgencyScore || 50,
        confidence: analysis.confidence || 50,
        reasoning: analysis.reasoning || 'Analyse automatique'
      }

    } catch (error) {
      console.error('❌ OpenAI analysis error:', error)
      return this.performHeuristicAnalysis(imageData, imageHash)
    }
  }

  private async performHeuristicAnalysis(imageData: Uint8Array, imageHash: string): Promise<any> {
    console.log('📊 Using conservative heuristic analysis (AI Vision unavailable)...')
    
    const imageSize = imageData.length
    
    // 2. INVERSER LA LOGIQUE PAR DÉFAUT - Mode conservateur strict
    console.log(`🔍 Conservative analysis - Size: ${imageSize} bytes`)
    
    // 3. RENFORCER LES CRITÈRES HEURISTIQUES - Plus stricts
    
    // Rejeter TOUTES les images petites (selfies, photos floues, insignifiantes)
    if (imageSize < 50000) { // Augmentation du seuil de 30KB à 50KB
      console.log('❌ Image rejected: too small (< 50KB) - likely selfie/personal photo')
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Image trop petite - probable selfie/flou', score: 0 }],
        imageHash,
        wasteLevel: 'low' as const,
        wasteTypes: [],
        environmentalImpact: 'Image non exploitable pour l\'analyse',
        urgencyScore: 0,
        confidence: 98,
        reasoning: 'Image trop petite - probable photo personnelle sans déchets'
      }
    }
    
    // Rejeter images moyennes sans IA - Être très conservateur
    if (imageSize < 200000) { // Augmentation du seuil de 100KB à 200KB
      console.log('❌ Image rejected: medium size without AI - conservative mode')
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Analyse non concluante - IA vision requise', score: 0 }],
        imageHash,
        wasteLevel: 'low' as const,
        wasteTypes: [],
        environmentalImpact: 'Analyse IA requise pour validation fiable',
        urgencyScore: 0,
        confidence: 90,
        reasoning: 'Taille modérée - IA Vision nécessaire pour éviter faux positifs'
      }
    }
    
    // 4. LOGIQUE DE VALIDATION CROISÉE - Exiger plus de preuves
    const qualityChecks = this.performQualityChecks(imageData, imageSize)
    
    // Pour les TRÈS grandes images uniquement (probable photos extérieures)
    if (imageSize > 800000 && qualityChecks.likelyOutdoor) {
      console.log('⚠️ Very large image with quality checks - cautious acceptance')
      return {
        isGarbageDetected: true,
        detectedObjects: [{ label: 'Grande image extérieure - examen manuel', score: 50 }],
        imageHash,
        wasteLevel: 'low' as const,
        wasteTypes: ['à_vérifier'],
        environmentalImpact: 'Nécessite validation manuelle - image de grande taille',
        urgencyScore: 15,
        confidence: 45, // Confiance réduite sans IA
        reasoning: 'Très grande image suggérant contexte extérieur - validation requise'
      }
    }
    
    // Pour autres cas - MODE CONSERVATEUR : rejeter par défaut
    console.log('❌ Image rejected: conservative mode - insufficient evidence without AI')
    return {
      isGarbageDetected: false,
      detectedObjects: [{ label: 'Mode conservateur - IA Vision recommandée', score: 0 }],
      imageHash,
      wasteLevel: 'low' as const,
      wasteTypes: [],
      environmentalImpact: 'Mode conservateur activé - IA Vision recommandée',
      urgencyScore: 0,
      confidence: 85,
      reasoning: 'Mode conservateur : privilégier la précision, éviter les faux positifs'
    }
  }

  // 5. AMÉLIORER LES VÉRIFICATIONS DE QUALITÉ
  private performQualityChecks(imageData: Uint8Array, imageSize: number): {
    likelyOutdoor: boolean;
    qualityScore: number;
  } {
    // Heuristiques simples pour détecter photos extérieures
    const likelyOutdoor = imageSize > 800000 // Très grandes images
    const qualityScore = Math.min(100, (imageSize / 10000) * 10) // Score basique sur taille
    
    console.log(`🔍 Quality checks - Likely outdoor: ${likelyOutdoor}, Quality score: ${qualityScore}`)
    
    return {
      likelyOutdoor,
      qualityScore
    }
  }

  private createFallbackResult(imageData: Uint8Array): any {
    const fallbackHash = `fallback_${Date.now()}_${imageData.length}`
    
    // 6. MODE CONSERVATEUR - Même en cas d'erreur, ne pas accepter automatiquement
    console.log('❌ Fallback result: rejecting due to analysis error (conservative mode)')
    
    return {
      isGarbageDetected: false, // Inversé de true à false
      detectedObjects: [{ label: 'Erreur analyse - photo rejetée par précaution', score: 0 }],
      imageHash: fallbackHash,
      wasteLevel: 'low' as const,
      wasteTypes: [],
      environmentalImpact: 'Erreur analyse - mode conservateur activé',
      urgencyScore: 0,
      confidence: 75,
      reasoning: 'Erreur analyse - précaution conservatrice appliquée'
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
    try {
      // Traitement par chunks pour éviter les erreurs de mémoire
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

  generateEnhancedValidationMessage(result: any): string {
    const { 
      isGarbageDetected, 
      wasteLevel, 
      wasteTypes, 
      environmentalImpact, 
      urgencyScore,
      detectedObjects 
    } = result
    
    if (!isGarbageDetected) {
      const rejectionReasons = {
        'Image trop petite - probable selfie/flou': "❌ <b>Photo rejetée</b>\n\n📱 L'image est trop petite (< 50KB). Veuillez prendre une photo plus grande et nette de déchets visibles.",
        'Analyse non concluante - IA vision requise': "❌ <b>Photo rejetée</b>\n\n🤖 Cette image nécessite l'analyse IA pour être validée. Réessayez avec une photo plus grande et claire.",
        'Mode conservateur - IA Vision recommandée': "❌ <b>Photo rejetée par précaution</b>\n\n🔍 Notre système privilégie la précision. Prenez une photo plus nette avec des déchets clairement visibles.",
        'Erreur analyse - photo rejetée par précaution': "❌ <b>Photo rejetée</b>\n\n⚠️ Erreur d'analyse. Par précaution, cette photo n'est pas acceptée. Réessayez avec une nouvelle photo.",
        'Image ne semble pas contenir de déchets': "❌ <b>Photo rejetée</b>\n\n🌟 Aucun déchet détecté dans cette image. C'est excellent si l'environnement est propre !"
      }
      
      const detectedReason = detectedObjects?.[0]?.label || 'Image trop petite - probable selfie/flou'
      return rejectionReasons[detectedReason] || "❌ <b>Photo rejetée</b>\n\n🔍 Notre système n'a pas détecté de déchets clairs dans cette image. Mode conservateur activé pour éviter les erreurs."
    }

    let message = "✅ <b>Image validée ! Des ordures ont été détectées.</b>\n\n"
    
    // Analyser le niveau de déchets et donner des détails
    if (wasteLevel) {
      const levelDetails = {
        'low': '🟢 <b>Déchets dispersés</b> - Quelques éléments isolés',
        'medium': '🟡 <b>Accumulation modérée</b> - Plusieurs déchets regroupés', 
        'high': '🟠 <b>Déchets en masse</b> - Accumulation importante',
        'critical': '🔴 <b>Pollution critique</b> - Dépôt massif d\'ordures'
      }
      message += `${levelDetails[wasteLevel]}\n\n`
    }
    
    // Afficher les types de déchets détectés
    if (wasteTypes && wasteTypes.length > 0 && !wasteTypes.includes('indéterminé') && !wasteTypes.includes('à_classifier')) {
      const typeEmojis = {
        'plastique': '🧴',
        'organique': '🍎', 
        'métal': '🥫',
        'verre': '🍾',
        'papier': '📄',
        'mégots': '🚬',
        'électronique': '📱'
      }
      const typesWithEmojis = wasteTypes.map(type => `${typeEmojis[type] || '🗑️'} ${type}`).join(', ')
      message += `<b>Types identifiés :</b> ${typesWithEmojis}\n\n`
    }
    
    // Indicateur d'urgence
    if (urgencyScore && urgencyScore > 70) {
      message += `⚡ <b>Signalement prioritaire</b> - Intervention rapide requise\n\n`
    }
    
    // SEULEMENT si des déchets sont détectés, demander la localisation
    message += `📍 Veuillez maintenant <b>partager votre localisation</b> pour finaliser le signalement.`
    
    return message
  }
}