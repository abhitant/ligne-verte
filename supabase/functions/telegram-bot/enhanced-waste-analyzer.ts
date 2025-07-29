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
      
      // Analyse IA avec OpenAI Vision si disponible
      const openAIKey = Deno.env.get('OPENAI_API_KEY')
      if (openAIKey && imageSize > 50000) { // Images assez grandes pour l'analyse
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
              content: `Tu es un expert en analyse environnementale avec des critères stricts de détection de déchets.

              CRITÈRES DE DÉTECTION STRICTE :
              
              ✅ DÉCHETS ACCEPTÉS :
              - Détritus jetés au sol (canettes, bouteilles, emballages)
              - Sacs poubelle ouverts/renversés avec contenu visible
              - Accumulation de déchets dans espaces publics
              - Pollution plastique dans la nature (rivières, parcs)
              - Dépôts sauvages d'ordures
              - Mégots de cigarettes au sol
              - Graffitis et tags sur propriété publique
              - Objets abandonnés (meubles, appareils électroniques)

              ❌ NE PAS CONSIDÉRER COMME DÉCHETS :
              - Poubelles fermées et bien rangées
              - Espaces propres même avec quelques éléments
              - Véhicules, personnes, animaux
              - Nature propre, paysages, intérieurs
              - Nourriture fraîche ou objets en bon état
              - Photos de famille, selfies
              - Bâtiments, infrastructures normales

              ÉVALUATION :
              - Seuil minimum : présence ÉVIDENTE de déchets mal gérés
              - Sévérité basée sur quantité et impact environnemental
              - Urgence selon dangerosité et localisation

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
    console.log('📊 Using enhanced heuristic analysis...')
    
    const imageSize = imageData.length
    
    // Analyse plus stricte mais intelligente
    console.log(`🔍 Image analysis - Size: ${imageSize} bytes`)
    
    // Rejeter les images très petites (selfies, photos floues)
    if (imageSize < 30000) {
      console.log('❌ Image rejected: too small (< 30KB) - likely selfie/blur')
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Image trop petite - probable selfie/flou', score: 0 }],
        imageHash,
        wasteLevel: 'low' as const,
        wasteTypes: [],
        environmentalImpact: 'Image non exploitable pour l\'analyse',
        urgencyScore: 0,
        confidence: 95,
        reasoning: 'Image trop petite pour contenir des déchets visibles'
      }
    }
    
    // Rejeter les images moyennes sans IA (photos normales)
    if (imageSize < 100000) {
      console.log('❌ Image rejected: moderate size without AI vision')
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Analyse non concluante - IA vision requise', score: 0 }],
        imageHash,
        wasteLevel: 'low' as const,
        wasteTypes: [],
        environmentalImpact: 'Nécessite analyse IA pour validation',
        urgencyScore: 0,
        confidence: 80,
        reasoning: 'Image de taille moyenne - besoin IA vision pour détection précise'
      }
    }
    
    // Pour les images plus grandes, analyse plus poussée
    if (imageSize > 500000) {
      console.log('⚠️ Large image - likely outdoor photo, accepting with medium confidence')
      return {
        isGarbageDetected: true,
        detectedObjects: [{ label: 'Image extérieure - examen prioritaire', score: 60 }],
        imageHash,
        wasteLevel: 'medium' as const,
        wasteTypes: ['à_classifier'],
        environmentalImpact: 'Probable signalement extérieur - vérification manuelle',
        urgencyScore: 40,
        confidence: 65,
        reasoning: 'Grande image suggérant photo extérieure avec déchets potentiels'
      }
    }
    
    // Images moyennes-grandes: accepter avec prudence
    console.log('⚠️ Medium-large image accepted for manual review')
    return {
      isGarbageDetected: true,
      detectedObjects: [{ label: 'Signalement à vérifier - taille appropriée', score: 45 }],
      imageHash,
      wasteLevel: 'low' as const,
      wasteTypes: ['indéterminé'],
      environmentalImpact: 'Nécessite validation manuelle - taille d\'image appropriée',
      urgencyScore: 25,
      confidence: 55,
      reasoning: 'Taille d\'image suggérant contenu potentiel mais incertain sans IA'
    }
  }

  private createFallbackResult(imageData: Uint8Array): any {
    const fallbackHash = `fallback_${Date.now()}_${imageData.length}`
    
    return {
      isGarbageDetected: true,
      detectedObjects: [{ label: 'Erreur analyse - examen manuel requis', score: 50 }],
      imageHash: fallbackHash,
      wasteLevel: 'medium' as const,
      wasteTypes: ['indéterminé'],
      environmentalImpact: 'Impact à déterminer manuellement',
      urgencyScore: 50
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
        'Image trop petite - non analysable': "❌ <b>Photo non acceptée.</b>\n\n📱 L'image est trop petite (moins de 50KB). Veuillez prendre une photo plus grande et plus nette.",
        'Analyse non concluante - besoin IA vision': "❌ <b>Photo non acceptée.</b>\n\n🔍 L'analyse automatique n'a pas détecté de déchets dans cette image. Si vous pensez qu'il y en a, contactez un modérateur.",
        'Image ne semble pas contenir de déchets': "❌ <b>Photo non acceptée.</b>\n\n🌟 Cette image semble montrer un environnement propre ! C'est formidable, continuez à préserver notre planète."
      }
      
      const detectedReason = detectedObjects?.[0]?.label || 'Image trop petite - non analysable'
      return rejectionReasons[detectedReason] || "❌ <b>Photo non acceptée.</b>\n\nL'image ne semble pas contenir de déchets ou est de mauvaise qualité."
    }

    let message = "✅ <b>Photo acceptée et analysée !</b>\n\n"
    
    // Ajouter les détails de l'analyse si disponibles
    if (wasteLevel && wasteLevel !== 'low') {
      const levelEmojis = {
        'medium': '🟡',
        'high': '🟠', 
        'critical': '🔴'
      }
      message += `${levelEmojis[wasteLevel]} <b>Ampleur :</b> ${wasteLevel === 'medium' ? 'Modérée' : wasteLevel === 'high' ? 'Importante' : 'Critique'}\n`
    }
    
    if (wasteTypes && wasteTypes.length > 0 && !wasteTypes.includes('indéterminé')) {
      message += `🗑️ <b>Types détectés :</b> ${wasteTypes.join(', ')}\n`
    }
    
    if (urgencyScore && urgencyScore > 70) {
      message += `⚡ <b>Urgence élevée</b> - Signalement prioritaire\n`
    }
    
    if (environmentalImpact && !environmentalImpact.includes('évaluer')) {
      message += `🌍 <b>Impact :</b> ${environmentalImpact}\n`
    }
    
    message += `\n💰 <b>+10 points Himpact</b> pour votre contribution !\n`
    message += `🔍 Votre signalement sera examiné par notre équipe.`
    
    return message
  }
}