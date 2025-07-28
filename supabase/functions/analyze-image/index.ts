import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisResult {
  isGarbageDetected: boolean
  detectedObjects: Array<{ label: string; score: number }>
  wasteCategory: string
  disposalInstructions: string
  confidence: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image_url } = await req.json()

    if (!image_url) {
      return new Response(
        JSON.stringify({ error: 'image_url is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('📸 Analyzing image from URL:', image_url)

    // Download image from URL
    const imageResponse = await fetch(image_url)
    if (!imageResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to download image from URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const imageBlob = await imageResponse.blob()
    const imageArrayBuffer = await imageBlob.arrayBuffer()
    const imageData = new Uint8Array(imageArrayBuffer)

    // Analyze image using Hugging Face models
    const analysisResult = await analyzeImageWithHuggingFace(imageData)

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error in analyze-image function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed', 
        details: error.message,
        isGarbageDetected: false,
        detectedObjects: [],
        wasteCategory: 'UNKNOWN',
        disposalInstructions: 'Erreur d\'analyse',
        confidence: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function analyzeImageWithHuggingFace(imageData: Uint8Array): Promise<AnalysisResult> {
  const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
  
  if (!huggingFaceToken) {
    console.warn('⚠️ No Hugging Face token, using fallback analysis')
    return {
      isGarbageDetected: true,
      detectedObjects: [{ label: 'Objet détecté', score: 75 }],
      wasteCategory: 'GENERAL',
      disposalInstructions: 'Analyse en mode standard - veuillez suivre les instructions locales de tri.',
      confidence: 50
    }
  }

  try {
    // Convert to base64
    const base64Image = btoa(String.fromCharCode(...imageData))
    
    // Analyze with multiple models
    const models = [
      'google/vit-base-patch16-224',
      'microsoft/resnet-50',
      'facebook/detr-resnet-50'
    ]

    const allResults: Array<{ label: string; score: number }> = []

    for (const model of models) {
      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${huggingFaceToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: base64Image,
            parameters: { top_k: 5 }
          }),
        })

        if (response.ok) {
          const results = await response.json()
          if (Array.isArray(results)) {
            allResults.push(...results.map((r: any) => ({
              label: r.label || 'unknown',
              score: Math.round((r.score || 0) * 100)
            })))
          }
        }
      } catch (modelError) {
        console.warn(`⚠️ Model ${model} failed:`, modelError)
      }
    }

    // Analyze results for garbage detection
    const garbageAnalysis = analyzeForGarbage(allResults)
    
    return {
      isGarbageDetected: garbageAnalysis.isGarbage,
      detectedObjects: allResults.slice(0, 5), // Top 5 detections
      wasteCategory: garbageAnalysis.category,
      disposalInstructions: garbageAnalysis.instructions,
      confidence: garbageAnalysis.confidence
    }

  } catch (error) {
    console.error('❌ Hugging Face analysis failed:', error)
    return {
      isGarbageDetected: true,
      detectedObjects: [{ label: 'Analyse de base', score: 60 }],
      wasteCategory: 'GENERAL',
      disposalInstructions: 'Erreur d\'analyse IA - traitement en mode standard.',
      confidence: 40
    }
  }
}

function analyzeForGarbage(detections: Array<{ label: string; score: number }>) {
  const strongGarbageKeywords = [
    'garbage', 'trash', 'waste', 'litter', 'rubbish', 'refuse',
    'bottle', 'can', 'plastic', 'paper', 'cardboard', 'bag'
  ]

  const organicKeywords = ['food', 'banana', 'apple', 'organic', 'compost']
  const recyclableKeywords = ['bottle', 'can', 'plastic', 'paper', 'cardboard', 'glass']
  const hazardousKeywords = ['battery', 'chemical', 'toxic', 'medical', 'syringe']

  let maxConfidence = 0
  let isGarbage = false
  let category = 'GENERAL'
  let instructions = 'Aucune instruction spécifique disponible.'

  for (const detection of detections) {
    const label = detection.label.toLowerCase()
    const score = detection.score

    // Check for strong garbage indicators
    const hasGarbageKeyword = strongGarbageKeywords.some(keyword => label.includes(keyword))
    
    if (hasGarbageKeyword && score > 30) {
      isGarbage = true
      maxConfidence = Math.max(maxConfidence, score)

      // Determine category
      if (organicKeywords.some(keyword => label.includes(keyword))) {
        category = 'ORGANIC'
        instructions = '🍃 Déchets organiques : À composter ou mettre dans le bac vert.'
      } else if (recyclableKeywords.some(keyword => label.includes(keyword))) {
        category = 'RECYCLABLE'
        instructions = '♻️ Déchets recyclables : À mettre dans le bac jaune après nettoyage.'
      } else if (hazardousKeywords.some(keyword => label.includes(keyword))) {
        category = 'HAZARDOUS'
        instructions = '⚠️ Déchets dangereux : À apporter en déchetterie ou point de collecte spécialisé.'
      } else {
        category = 'GENERAL'
        instructions = '🗑️ Déchets généraux : À mettre dans le bac noir (ordures ménagères).'
      }
    }
  }

  // If no clear garbage detected but some relevant objects found
  if (!isGarbage && detections.length > 0) {
    const hasRelevantObjects = detections.some(d => 
      d.label.toLowerCase().includes('object') || 
      d.label.toLowerCase().includes('item') ||
      d.score > 70
    )
    
    if (hasRelevantObjects) {
      isGarbage = true
      maxConfidence = 60
      instructions = '📋 Objet détecté - veuillez vérifier le type de déchet pour un tri approprié.'
    }
  }

  return {
    isGarbage,
    category,
    instructions,
    confidence: maxConfidence
  }
}