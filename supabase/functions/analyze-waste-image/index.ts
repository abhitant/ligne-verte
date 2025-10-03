import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('Image URL is required')
    }

    console.log('🔍 Analyzing waste image with Gemini AI:', imageUrl)

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured')
    }

    // Call Gemini AI with vision capabilities
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en identification et classification des déchets pour l'application "La Ligne Verte" - une app de signalement de pollution.

Ton rôle est d'analyser les photos de déchets et retourner des informations précises et structurées.

IMPORTANT: Tu dois TOUJOURS répondre en JSON valide avec cette structure exacte:
{
  "isWaste": boolean,
  "wasteType": string,
  "category": string,
  "brand": string | null,
  "confidence": number,
  "description": string,
  "disposalInstructions": string
}

Catégories possibles: "plastique", "verre", "métal", "papier", "organique", "électronique", "textile", "mixte", "dangereux", "autre"

Types de déchets: "bouteille", "canette", "sac", "emballage", "mégot", "déchet alimentaire", etc.

Si ce n'est PAS un déchet (paysage, personne, animal, etc.), mets isWaste à false.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyse cette photo et identifie le type de déchet. Réponds uniquement en JSON valide.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3 // Lower temperature for more consistent classification
      }),
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error('❌ AI Gateway error:', aiResponse.status, errorText)
      throw new Error(`AI Gateway error: ${aiResponse.status}`)
    }

    const aiData = await aiResponse.json()
    console.log('🤖 AI Response:', JSON.stringify(aiData, null, 2))

    const aiContent = aiData.choices?.[0]?.message?.content
    if (!aiContent) {
      throw new Error('No content in AI response')
    }

    // Parse the JSON response from AI
    let analysis
    try {
      // Remove markdown code blocks if present
      const cleanedContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysis = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', aiContent)
      throw new Error('AI response is not valid JSON')
    }

    console.log('✅ Waste analysis completed:', analysis)

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error in analyze-waste-image:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})