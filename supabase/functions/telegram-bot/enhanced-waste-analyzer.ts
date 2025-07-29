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
              content: `Tu es un expert en analyse environnementale. Analyse cette image pour détecter :
              1. Présence de déchets/ordures (oui/non)
              2. Types de déchets (plastique, papier, verre, métal, organique, dangereux)
              3. Niveau d'ampleur (low/medium/high/critical)
              4. Score d'urgence (0-100)
              5. Impact environnemental (phrase courte)
              
              Réponds UNIQUEMENT avec un JSON valide dans ce format exact :
              {
                "hasWaste": boolean,
                "wasteTypes": ["type1", "type2"],
                "wasteLevel": "low|medium|high|critical",
                "urgencyScore": number,
                "environmentalImpact": "description courte",
                "objects": [{"label": "objet", "confidence": number}]
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
    console.log('📊 Using heuristic analysis...')
    
    const imageSize = imageData.length
    
    // Analyse heuristique basée sur la taille
    let wasteLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    let urgencyScore = 50
    let environmentalImpact = 'Impact environnemental à évaluer'
    
    if (imageSize < 20000) { // Très petite image
      wasteLevel = 'low'
      urgencyScore = 20
      environmentalImpact = 'Impact probablement faible'
    } else if (imageSize > 200000) { // Grande image détaillée
      wasteLevel = 'high'
      urgencyScore = 75
      environmentalImpact = 'Nécessite attention - zone potentiellement polluée'
    }
    
    const isAccepted = imageSize >= 10000 // Minimum 10KB
    
    return {
      isGarbageDetected: isAccepted,
      detectedObjects: isAccepted 
        ? [{ label: 'Image acceptée pour examen manuel', score: 80 }]
        : [{ label: 'Image trop petite', score: 0 }],
      imageHash,
      wasteLevel,
      wasteTypes: ['indéterminé'],
      environmentalImpact,
      urgencyScore
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
      return "❌ <b>Photo non acceptée.</b>\n\nL'image semble trop petite ou corrompue. Veuillez prendre une photo plus nette et plus grande."
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