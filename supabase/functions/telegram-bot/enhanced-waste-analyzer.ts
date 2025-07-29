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
              content: `Tu es un expert en analyse environnementale stricte. Analyse cette image avec précision.

              IMPORTANT : Sois très sélectif ! Ne considère comme déchets QUE :
              - Ordures, poubelles renversées, sacs poubelles ouverts
              - Détritus jetés par terre (canettes, bouteilles, papiers, mégots)
              - Pollution visible (plastiques dans la nature, dépôts illégaux)
              - Environnements sales avec accumulation de déchets
              
              NE CONSIDÈRE PAS comme déchets :
              - Animaux, personnes, véhicules, bâtiments
              - Paysages propres, nature, objets en bon état
              - Nourriture fraîche, plantes, objets décoratifs
              - Photos de famille, selfies, intérieurs propres
              
              Réponds UNIQUEMENT avec un JSON valide dans ce format exact :
              {
                "hasWaste": boolean,
                "wasteTypes": ["type1", "type2"],
                "wasteLevel": "low|medium|high|critical", 
                "urgencyScore": number,
                "environmentalImpact": "description courte",
                "objects": [{"label": "objet", "confidence": number}],
                "confidence": number
              }`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyse cette image pour détecter les déchets et leur ampleur.'
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
          max_tokens: 300,
          temperature: 0.1,
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
        detectedObjects: analysis.objects || [{ label: 'AI analysis completed', score: 85 }],
        imageHash,
        wasteLevel: analysis.wasteLevel || 'low',
        wasteTypes: analysis.wasteTypes || [],
        environmentalImpact: analysis.environmentalImpact || 'Impact à évaluer',
        urgencyScore: analysis.urgencyScore || 50
      }

    } catch (error) {
      console.error('❌ OpenAI analysis error:', error)
      return this.performHeuristicAnalysis(imageData, imageHash)
    }
  }

  private async performHeuristicAnalysis(imageData: Uint8Array, imageHash: string): Promise<any> {
    console.log('📊 Using restrictive heuristic analysis...')
    
    const imageSize = imageData.length
    
    // Analyse très restrictive - REJETER la plupart des images
    // Car sans IA vision, on ne peut pas vraiment détecter les déchets
    
    // Rejeter les images trop petites (probable selfie/photo floue)
    if (imageSize < 50000) {
      console.log('❌ Image rejected: too small (< 50KB)')
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Image trop petite - non analysable', score: 0 }],
        imageHash,
        wasteLevel: 'low' as const,
        wasteTypes: [],
        environmentalImpact: 'Aucun déchet détecté',
        urgencyScore: 0
      }
    }
    
    // Rejeter les images moyennes (probable photo normale)
    if (imageSize < 150000) {
      console.log('❌ Image rejected: likely normal photo')
      return {
        isGarbageDetected: false,
        detectedObjects: [{ label: 'Analyse non concluante - besoin IA vision', score: 0 }],
        imageHash,
        wasteLevel: 'low' as const,
        wasteTypes: [],
        environmentalImpact: 'Image ne semble pas contenir de déchets',
        urgencyScore: 0
      }
    }
    
    // Pour les très grandes images, accepter avec réserve
    console.log('⚠️ Large image accepted with caution for manual review')
    return {
      isGarbageDetected: true,
      detectedObjects: [{ label: 'Image grande - examen manuel requis', score: 30 }],
      imageHash,
      wasteLevel: 'low' as const,
      wasteTypes: ['à_vérifier'],
      environmentalImpact: 'Nécessite vérification manuelle',
      urgencyScore: 20
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