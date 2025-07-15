import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TELEGRAM_BOT_TOKEN) {
      throw new Error('Missing required environment variables')
    }

    console.log('=== DÉBORA PROFILE SETUP START ===')
    
    // URL de l'image de profil de Débora - essayer plusieurs sources
    let profilePhotoUrl = 'https://images.unsplash.com/photo-1494790108755-2616b612b0e0?w=400&h=400&fit=crop&crop=face'
    
    console.log('Using fallback image URL:', profilePhotoUrl)

    // Télécharger l'image pour l'uploader via l'API Telegram
    console.log('Downloading image...')
    const imageResponse = await fetch(profilePhotoUrl)
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`)
    }

    console.log('Image downloaded successfully, size:', imageResponse.headers.get('content-length'))
    const imageBlob = await imageResponse.blob()
    console.log('Image blob created, size:', imageBlob.size, 'type:', imageBlob.type)

    // Configurer le nom du bot
    const namePayload = { name: 'Débora - La Ligne Verte' }
    const nameResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyName`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(namePayload)
    })
    const nameResult = await nameResponse.json()

    // Configurer la description du bot
    const descPayload = { 
      description: '🌱 Je suis Débora, votre standardiste de La Ligne Verte ! Ensemble, luttons contre la pollution urbaine en signalant les problèmes environnementaux. Envoyez-moi une photo et votre localisation pour commencer !' 
    }
    const descResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyDescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(descPayload)
    })
    const descResult = await descResponse.json()

    // Configurer la photo de profil avec FormData
    const formData = new FormData()
    formData.append('photo', imageBlob, 'debora-profile.jpg')

    const photoResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyProfilePhoto`, {
      method: 'POST',
      body: formData
    })
    const photoResult = await photoResponse.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Profil de Débora configuré avec succès !',
        results: {
          name: nameResult,
          description: descResult,
          photo: photoResult
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error setting up Débora profile:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})