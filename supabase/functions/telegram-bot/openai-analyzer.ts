import "https://deno.land/x/xhr@0.1.0/mod.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

export class OpenAIAnalyzer {
  
  async analyzeImage(imageData: Uint8Array): Promise<{
    isGarbageDetected: boolean
    detectedObjects: Array<{ label: string; score: number }>
    imageHash: string
  }> {
    try {
      console.log('🤖 Starting OpenAI Vision analysis...')
      
      // Calculate hash of the image
      const imageHash = await this.calculateImageHash(imageData)
      console.log('📊 Image hash calculated:', imageHash.substring(0, 8) + '...')

      // Convert to base64 for OpenAI API
      const base64Image = this.uint8ArrayToBase64(imageData)
      
      console.log('🔍 Sending image to OpenAI Vision API...')
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en détection de déchets et pollution urbaine. Analyse l'image pour détecter la présence de déchets, ordures, dépôts sauvages ou pollution.

Réponds UNIQUEMENT au format JSON suivant :
{
  "isGarbageDetected": true/false,
  "confidence": 0-100,
  "detectedItems": ["item1", "item2", ...],
  "description": "Description courte de ce qui est détecté"
}

Considère comme déchets/pollution :
- Bouteilles, canettes, emballages abandonnés
- Sacs plastiques, papiers jetés
- Dépôts sauvages d'ordures
- Détritus sur la voie publique
- Pollution visible dans l'environnement
- Objets abandonnés inappropriés

Ne considère PAS comme déchets :
- Mobilier urbain normal (bancs, poubelles propres)
- Véhicules stationnés normalement
- Personnes ou animaux
- Végétation naturelle
- Infrastructure urbaine normale`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyse cette image pour détecter des déchets ou de la pollution. Réponds uniquement en JSON selon le format demandé.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                    detail: 'low' // Pour optimiser les coûts et vitesse
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1 // Peu de créativité, plus de précision
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ OpenAI API error:', response.status, errorText)
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('📈 OpenAI response received')
      
      const content = data.choices[0].message.content
      console.log('🔍 OpenAI analysis result:', content)

      // Parse JSON response
      let analysisResult
      try {
        analysisResult = JSON.parse(content)
      } catch (parseError) {
        console.error('❌ Error parsing OpenAI JSON response:', parseError)
        console.log('Raw response:', content)
        throw new Error('Invalid JSON response from OpenAI')
      }

      const isGarbageDetected = analysisResult.isGarbageDetected === true
      const confidence = analysisResult.confidence || 0
      const detectedItems = analysisResult.detectedItems || []
      const description = analysisResult.description || ''

      console.log(`🤖 OpenAI Analysis result: ${isGarbageDetected ? 'GARBAGE DETECTED' : 'NO GARBAGE DETECTED'} (${confidence}% confidence)`)
      console.log(`🎯 Detected items:`, detectedItems)
      console.log(`📝 Description:`, description)

      const detectedObjects = detectedItems.map((item: string) => ({
        label: item,
        score: confidence
      }))

      return {
        isGarbageDetected,
        detectedObjects,
        imageHash
      }
    } catch (error) {
      console.error('❌ OpenAI analysis error:', error)
      
      // Fallback: calculate hash and allow manual review
      const imageHash = await this.calculateImageHash(imageData)
      return {
        isGarbageDetected: true, // Allow for manual review when AI fails
        detectedObjects: [{ label: 'AI analysis failed - manual review needed', score: 50 }],
        imageHash
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

  generateValidationMessage(
    isGarbageDetected: boolean, 
    detectedObjects: Array<{ label: string; score: number }>
  ): string {
    if (isGarbageDetected) {
      const hasAIFailure = detectedObjects.some(obj => obj.label.includes('AI analysis failed'))
      
      if (hasAIFailure) {
        return "⚠️ <b>Photo acceptée !</b> Notre système d'analyse IA a rencontré un problème technique, mais votre photo sera examinée manuellement. Merci pour votre contribution !"
      }
      
      const detectedItems = detectedObjects.filter(obj => obj.score > 0).map(obj => obj.label)
      let message = "✅ <b>Déchets détectés par l'IA !</b> Excellente contribution pour lutter contre la pollution.\n\n"
      
      if (detectedItems.length > 0) {
        message += `🎯 <b>Éléments identifiés :</b> ${detectedItems.slice(0, 3).join(', ')}\n\n`
      }
      
      message += "Votre signalement a été validé automatiquement."
      return message
    } else {
      let message = "❌ <b>Aucun déchet détecté par l'IA.</b> L'analyse automatique n'a pas identifié de déchets ou de pollution claire dans cette image.\n\n"
      
      if (detectedObjects.length > 0) {
        const items = detectedObjects.slice(0, 2).map(obj => obj.label).join(', ')
        message += `ℹ️ Éléments détectés : ${items}\n\n`
      }
      
      message += "Si vous pensez qu'il s'agit d'une erreur, veuillez prendre une photo plus nette montrant clairement les déchets. Merci de réessayer !"
      
      return message
    }
  }
}