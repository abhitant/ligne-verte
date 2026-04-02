import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const WHATSAPP_VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN')
  const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    // GET = Webhook verification (Meta sends this when you configure the webhook)
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      console.log('WhatsApp webhook verification:', { mode, token, challenge })

      if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
        console.log('✅ Webhook verified successfully')
        return new Response(challenge, { status: 200 })
      } else {
        console.error('❌ Webhook verification failed')
        return new Response('Forbidden', { status: 403 })
      }
    }

    // POST = Incoming messages
    if (req.method === 'POST') {
      const body = await req.json()
      console.log('📩 WhatsApp webhook received:', JSON.stringify(body, null, 2))

      // Extract message data from WhatsApp Cloud API format
      const entry = body.entry?.[0]
      const changes = entry?.changes?.[0]
      const value = changes?.value

      if (!value) {
        return new Response(JSON.stringify({ status: 'no_data' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const messages = value.messages
      const contacts = value.contacts

      if (!messages || messages.length === 0) {
        // Status update (delivered, read, etc.) - acknowledge
        console.log('📊 Status update received')
        return new Response(JSON.stringify({ status: 'status_update' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      for (const message of messages) {
        const from = message.from // Phone number
        const messageType = message.type
        const timestamp = message.timestamp
        const contactName = contacts?.[0]?.profile?.name || 'Inconnu'

        console.log(`📱 Message from ${from} (${contactName}): type=${messageType}`)

        // Create or get user
        const { data: user } = await supabase.rpc('create_user_if_not_exists', {
          p_telegram_id: `wa_${from}`,
          p_pseudo: contactName,
          p_telegram_username: from
        })

        if (messageType === 'text') {
          const text = message.text?.body || ''
          console.log(`💬 Text: ${text}`)

          // Handle commands
          if (text.toLowerCase().includes('aide') || text.toLowerCase().includes('help') || text === '/start') {
            await sendWhatsAppMessage(from, getWelcomeMessage(contactName))
          } else if (text.toLowerCase().includes('stats') || text.toLowerCase().includes('profil')) {
            await sendUserStats(from, `wa_${from}`, supabase)
          } else {
            await sendWhatsAppMessage(from, 
              `📸 Pour signaler un déchet, envoyez-moi une *photo* du déchet puis partagez votre *localisation* !\n\nTapez *aide* pour plus d'infos.`
            )
          }
        }

        if (messageType === 'image') {
          const imageId = message.image?.id
          const caption = message.image?.caption || ''
          console.log(`🖼️ Image received: ${imageId}`)

          if (imageId && WHATSAPP_ACCESS_TOKEN) {
            // Download image from WhatsApp
            const imageUrl = await downloadWhatsAppMedia(imageId, WHATSAPP_ACCESS_TOKEN)
            
            if (imageUrl) {
              // Upload to Supabase Storage
              const mediaResponse = await fetch(imageUrl, {
                headers: { 'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}` }
              })
              const imageBuffer = await mediaResponse.arrayBuffer()
              const fileName = `wa_${from}_${Date.now()}.jpg`

              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('report-photos')
                .upload(fileName, imageBuffer, { contentType: 'image/jpeg' })

              if (!uploadError) {
                const { data: publicUrl } = supabase.storage
                  .from('report-photos')
                  .getPublicUrl(fileName)

                // Save pending report
                await supabase.rpc('upsert_pending_report_with_url', {
                  p_telegram_id: `wa_${from}`,
                  p_photo_url: publicUrl.publicUrl
                })

                await sendWhatsAppMessage(from,
                  `✅ Photo reçue ! Maintenant, envoyez-moi votre *localisation* 📍 pour finaliser le signalement.\n\n_Appuyez sur le trombone (📎) → Localisation → Envoyer la position actuelle_`
                )
              } else {
                console.error('Upload error:', uploadError)
                await sendWhatsAppMessage(from, '❌ Erreur lors du traitement de la photo. Réessayez.')
              }
            }
          } else {
            await sendWhatsAppMessage(from, '❌ Configuration manquante. Contactez l\'administrateur.')
          }
        }

        if (messageType === 'location') {
          const lat = message.location?.latitude
          const lng = message.location?.longitude
          console.log(`📍 Location: ${lat}, ${lng}`)

          // Get pending report
          const { data: pendingReport } = await supabase.rpc('get_and_delete_pending_report_with_url', {
            p_telegram_id: `wa_${from}`
          })

          if (pendingReport?.photo_url) {
            // Create the report
            const status = pendingReport.waste_category ? 'validé' : 'en attente'
            
            const { data: report, error: reportError } = await supabase
              .from('reports')
              .insert({
                user_telegram_id: `wa_${from}`,
                photo_url: pendingReport.photo_url,
                description: pendingReport.waste_type || 'Signalement via WhatsApp',
                location_lat: lat,
                location_lng: lng,
                status: status,
                waste_category: pendingReport.waste_category,
                waste_type: pendingReport.waste_type,
                brand: pendingReport.brand,
                disposal_instructions: pendingReport.disposal_instructions,
                points_awarded: status === 'validé' ? 10 : 0
              })
              .select()
              .single()

            if (!reportError) {
              if (status === 'validé') {
                await supabase.rpc('add_points_to_user', {
                  p_telegram_id: `wa_${from}`,
                  p_points: 10
                })
              }

              await sendWhatsAppMessage(from,
                `🎉 *Signalement enregistré avec succès !*\n\n📍 Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}\n${status === 'validé' ? '✅ Validé automatiquement (+10 points)' : '⏳ En attente de validation'}\n\nMerci pour votre contribution ! 🌍💚`
              )
            } else {
              console.error('Report error:', reportError)
              await sendWhatsAppMessage(from, '❌ Erreur lors de la création du signalement. Réessayez.')
            }
          } else {
            await sendWhatsAppMessage(from,
              `📸 Vous n'avez pas encore envoyé de photo !\n\nEnvoyez d'abord une *photo* du déchet, puis partagez votre *localisation*.`
            )
          }
        }
      }

      // Always return 200 to WhatsApp
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Method not allowed', { status: 405 })

  } catch (error) {
    console.error('WhatsApp bot error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200, // Return 200 to avoid WhatsApp retries
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// --- Helper functions ---

async function sendWhatsAppMessage(to: string, text: string) {
  const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error('Missing WhatsApp credentials')
    return
  }

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text }
      })
    }
  )

  const result = await response.json()
  console.log('WhatsApp send result:', result)
  return result
}

async function downloadWhatsAppMedia(mediaId: string, accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${mediaId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    const data = await response.json()
    return data.url || null
  } catch (error) {
    console.error('Error downloading media:', error)
    return null
  }
}

function getWelcomeMessage(name: string): string {
  return `🌿 *Bienvenue sur Ligne Verte, ${name} !*

Je suis votre assistant environnemental. Voici comment signaler un déchet :

1️⃣ Envoyez une *photo* du déchet
2️⃣ Partagez votre *localisation* 📍

*Commandes disponibles :*
• *aide* - Afficher ce message
• *stats* - Voir votre profil
• *profil* - Vos statistiques

Ensemble, nettoyons notre environnement ! 🌍💚`
}

async function sendUserStats(to: string, odorId: string, supabase: any) {
  const { data: user } = await supabase.rpc('get_user_by_telegram_id', {
    p_telegram_id: odorId
  })

  if (user) {
    const msg = `📊 *Votre profil Ligne Verte*

👤 Pseudo: ${user.pseudo || 'Non défini'}
🏆 Points: ${user.points_himpact || 0}
📝 Signalements: ${user.reports_count || 0}
⭐ Niveau: ${user.level_current || 1}
🔥 Streak: ${user.streak_days || 0} jours

Continuez comme ça ! 💚`
    await sendWhatsAppMessage(to, msg)
  } else {
    await sendWhatsAppMessage(to, 'Envoyez une photo pour créer votre profil !')
  }
}
