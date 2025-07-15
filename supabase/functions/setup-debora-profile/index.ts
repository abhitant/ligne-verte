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

    // Configurer le nom du bot
    console.log('Setting bot name...')
    const namePayload = { name: 'Débora - La Ligne Verte' }
    const nameResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyName`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(namePayload)
    })
    const nameResult = await nameResponse.json()
    console.log('Name result:', nameResult)

    // Configurer la description du bot
    console.log('Setting bot description...')
    const descPayload = { 
      description: '🌱 Je suis Débora, votre standardiste de La Ligne Verte ! Ensemble, luttons contre la pollution urbaine en signalant les problèmes environnementaux. Envoyez-moi une photo et votre localisation pour commencer !' 
    }
    const descResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyDescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(descPayload)
    })
    const descResult = await descResponse.json()
    console.log('Description result:', descResult)

    // Pour l'instant, on skip la photo de profil pour éviter les erreurs
    console.log('Skipping profile photo for now...')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Nom et description de Débora configurés avec succès !',
        results: {
          name: nameResult,
          description: descResult,
          photo: { skipped: true, reason: 'Image upload will be implemented later' }
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