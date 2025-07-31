import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== BROADCAST WHATSAPP GREENPILL REQUEST ===', new Date().toISOString())
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Telegram bot token
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? ''

    // Get all users from database
    const { data: users, error: usersError } = await supabaseClient
      .from('users')
      .select('telegram_id, pseudo, points_himpact')
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }

    if (!users || users.length === 0) {
      console.log('No users found to broadcast to')
      return new Response(
        JSON.stringify({ success: true, message: 'No users found', sent: 0 }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log(`📤 Broadcasting WhatsApp Greenpill-CI link to ${users.length} users`)

    let successCount = 0
    let errorCount = 0
    const errors: any[] = []

    // Send message to each user
    for (const user of users) {
      try {
        const chatId = parseInt(user.telegram_id)
        
        const message = `🌱 Salut ${user.pseudo || 'ami éco-citoyen'} !

📢 Rejoignez notre nouvelle communauté WhatsApp <b>Greenpill-CI</b> pour suivre l'actualité environnementale et échanger avec d'autres contributeurs !

💚 Avec vos <b>${user.points_himpact} points Himpact</b>, vous faites partie des membres actifs de La Ligne Verte.

🌍 Discussions, conseils écologiques et actualités vous attendent sur Greenpill-CI

👥 Rejoindre : https://chat.whatsapp.com/BZhR0lzK8op850NUscjDwp

À bientôt sur WhatsApp ! 🌿`

        const keyboard = {
          inline_keyboard: [
            [
              { text: '💬 Rejoindre Greenpill-CI', url: 'https://chat.whatsapp.com/BZhR0lzK8op850NUscjDwp' }
            ]
          ]
        }

        // Send message directly to Telegram API
        const payload = {
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          reply_markup: keyboard
        }

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const result = await response.json()
        
        if (result.ok) {
          successCount++
          console.log(`✅ Message sent to ${user.pseudo} (${user.telegram_id})`)
        } else {
          errorCount++
          console.error(`❌ Failed to send to ${user.pseudo} (${user.telegram_id}):`, result)
          errors.push({ user: user.pseudo, error: result })
        }

        // Add delay to respect Telegram rate limits (30 messages per second max)
        await new Promise(resolve => setTimeout(resolve, 50))

      } catch (error) {
        errorCount++
        console.error(`❌ Error sending to ${user.pseudo} (${user.telegram_id}):`, error)
        errors.push({ user: user.pseudo, error: error.message })
      }
    }

    console.log(`📊 Broadcast completed: ${successCount} sent, ${errorCount} errors`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Broadcast completed',
        sent: successCount,
        errors: errorCount,
        total: users.length,
        errorDetails: errors.length > 0 ? errors : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Broadcast error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})