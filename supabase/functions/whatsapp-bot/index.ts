import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const META_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')!
const META_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')!
const META_WEBHOOK_VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN')!
const META_API_VERSION = 'v18.0'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

async function sendWhatsAppMessage(to: string, messageText: string) {
  const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PHONE_NUMBER_ID}/messages`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: messageText }
    })
  })
  const result = await response.json()
  console.log('Message envoyé:', result)
  return result
}

async function getImageUrl(imageId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${imageId}`, {
      headers: { 'Authorization': `Bearer ${META_ACCESS_TOKEN}` }
    })
    const data = await response.json()
    return data.url || null
  } catch (error) {
    console.error('Erreur récupération URL image:', error)
    return null
  }
}

async function handleTextMessage(message: any) {
  const from = message.from
  const text = message.text.body.toLowerCase()
  console.log(`Message texte de ${from}: ${text}`)

  let response: string
  if (text.includes('aide') || text.includes('help') || text === '/start') {
    response = `🌿 *Bienvenue sur Ligne Verte !*\n\nJe suis votre assistant environnemental.\n\n1️⃣ Envoyez une *photo* du déchet\n2️⃣ Partagez votre *localisation* 📍\n\n• *aide* - Afficher ce message\n• *stats* - Voir votre profil\n\nEnsemble, nettoyons notre environnement ! 🌍💚`
  } else if (text.includes('stats') || text.includes('profil')) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: user } = await supabase.rpc('get_user_by_telegram_id', { p_telegram_id: `wa_${from}` })
    if (user) {
      response = `📊 *Votre profil Ligne Verte*\n\n👤 Pseudo: ${user.pseudo || 'Non défini'}\n🏆 Points: ${user.points_himpact || 0}\n📝 Signalements: ${user.reports_count || 0}\n⭐ Niveau: ${user.level_current || 1}\n🔥 Streak: ${user.streak_days || 0} jours\n\nContinuez comme ça ! 💚`
    } else {
      response = 'Envoyez une photo pour créer votre profil !'
    }
  } else {
    response = '📸 Pour signaler un déchet, envoyez-moi une *photo* du déchet puis partagez votre *localisation* !\n\nTapez *aide* pour plus d\'infos.'
  }

  await sendWhatsAppMessage(from, response)
}

async function handleImageMessage(message: any) {
  const from = message.from
  const imageId = message.image?.id
  console.log(`🖼️ Image reçue de ${from}, ID: ${imageId}`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Create or get user
  await supabase.rpc('create_user_if_not_exists', {
    p_telegram_id: `wa_${from}`,
    p_pseudo: from,
    p_telegram_username: from
  })

  if (!imageId) {
    await sendWhatsAppMessage(from, '❌ Impossible de traiter cette image.')
    return
  }

  const imageUrl = await getImageUrl(imageId)
  if (!imageUrl) {
    await sendWhatsAppMessage(from, '❌ Impossible de récupérer l\'image.')
    return
  }

  // Download image
  const mediaResponse = await fetch(imageUrl, {
    headers: { 'Authorization': `Bearer ${META_ACCESS_TOKEN}` }
  })
  const imageBuffer = await mediaResponse.arrayBuffer()
  const fileName = `wa_${from}_${Date.now()}.jpg`

  // Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from('report-photos')
    .upload(fileName, imageBuffer, { contentType: 'image/jpeg' })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    await sendWhatsAppMessage(from, '❌ Erreur lors du traitement de la photo. Réessayez.')
    return
  }

  const { data: publicUrl } = supabase.storage.from('report-photos').getPublicUrl(fileName)
  const photoUrl = publicUrl.publicUrl

  await sendWhatsAppMessage(from, '📸 Photo reçue ! 🔍 Analyse en cours...')

  // AI Analysis
  let wasteCategory: string | null = null
  let wasteType: string | null = null
  let brand: string | null = null
  let disposalInstructions: string | null = null

  try {
    const analysisResponse = await fetch(`${SUPABASE_URL}/functions/v1/analyze-waste-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: photoUrl })
    })
    const analysisData = await analysisResponse.json()
    console.log('🤖 AI analysis result:', JSON.stringify(analysisData))

    if (analysisData?.success && analysisData?.analysis?.isWaste) {
      const analysis = analysisData.analysis
      wasteCategory = analysis.category
      wasteType = analysis.wasteType
      brand = analysis.brand
      disposalInstructions = analysis.disposalInstructions

      await sendWhatsAppMessage(from,
        `✅ *Déchet identifié !*\n\n🗑️ *Type:* ${wasteType}\n📦 *Catégorie:* ${wasteCategory}${brand ? `\n🏷️ *Marque:* ${brand}` : ''}\n\n♻️ *Instructions:* ${disposalInstructions}\n\n📍 Envoyez maintenant votre *localisation* pour finaliser le signalement !\n_Appuyez sur 📎 → Localisation → Position actuelle_`)
    } else {
      await sendWhatsAppMessage(from,
        `🔍 L'analyse ne détecte pas clairement de déchet.\n\nVotre signalement sera pris en compte pour vérification.\n\n📍 Envoyez votre *localisation* pour continuer.`)
    }
  } catch (aiError) {
    console.error('❌ AI analysis error:', aiError)
    await sendWhatsAppMessage(from, `📸 Photo enregistrée !\n\n📍 Envoyez votre *localisation* pour finaliser.`)
  }

  // Calculate image hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', imageBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const imageHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)

  // Save pending report
  await supabase.rpc('upsert_pending_report_with_waste_data', {
    p_telegram_id: `wa_${from}`,
    p_photo_url: photoUrl,
    p_image_hash: imageHash,
    p_waste_category: wasteCategory,
    p_waste_type: wasteType,
    p_brand: brand,
    p_disposal_instructions: disposalInstructions
  })
}

async function handleLocationMessage(message: any) {
  const from = message.from
  const lat = message.location?.latitude
  const lng = message.location?.longitude
  console.log(`📍 Location from ${from}: ${lat}, ${lng}`)

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data: pendingReport } = await supabase.rpc('get_and_delete_pending_report_with_url', {
    p_telegram_id: `wa_${from}`
  })

  if (!pendingReport?.photo_url) {
    await sendWhatsAppMessage(from, `📸 Vous n'avez pas encore envoyé de photo !\n\nEnvoyez d'abord une *photo* du déchet, puis partagez votre *localisation*.`)
    return
  }

  const status = pendingReport.waste_category ? 'validé' : 'en attente'

  const { error: reportError } = await supabase
    .from('reports')
    .insert({
      user_telegram_id: `wa_${from}`,
      photo_url: pendingReport.photo_url,
      description: pendingReport.waste_type || 'Signalement via WhatsApp',
      location_lat: lat,
      location_lng: lng,
      status,
      waste_category: pendingReport.waste_category,
      waste_type: pendingReport.waste_type,
      brand: pendingReport.brand,
      disposal_instructions: pendingReport.disposal_instructions,
      points_awarded: status === 'validé' ? 10 : 0
    })

  if (reportError) {
    console.error('Report error:', reportError)
    await sendWhatsAppMessage(from, '❌ Erreur lors de la création du signalement. Réessayez.')
    return
  }

  if (status === 'validé') {
    await supabase.rpc('add_points_to_user', { p_telegram_id: `wa_${from}`, p_points: 10 })
  }

  await sendWhatsAppMessage(from,
    `🎉 *Signalement enregistré !*\n\n📍 Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}\n${status === 'validé' ? '✅ Validé automatiquement (+10 points)' : '⏳ En attente de validation'}\n\nMerci ! 🌍💚`)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // GET = Webhook verification
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      console.log('WhatsApp webhook verification:', { mode, token, challenge })

      if (mode === 'subscribe' && token === META_WEBHOOK_VERIFY_TOKEN) {
        console.log('✅ Webhook verified')
        return new Response(challenge, { status: 200 })
      }
      return new Response('Forbidden', { status: 403 })
    }

    // POST = Incoming messages
    if (req.method === 'POST') {
      const body = await req.json()
      console.log('📩 WhatsApp webhook received:', JSON.stringify(body, null, 2))

      if (body.object === 'whatsapp_business_account') {
        for (const entry of (body.entry || [])) {
          for (const change of (entry.changes || [])) {
            if (change.field === 'messages') {
              const messages = change.value?.messages || []
              for (const message of messages) {
                if (message.type === 'text') {
                  await handleTextMessage(message)
                } else if (message.type === 'image') {
                  await handleImageMessage(message)
                } else if (message.type === 'location') {
                  await handleLocationMessage(message)
                }
              }
            }
          }
        }
      }

      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (error) {
    console.error('WhatsApp bot error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
