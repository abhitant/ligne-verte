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

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { action, ...params } = await req.json()

    console.log('Bot control action:', action, params)

    switch (action) {
      case 'getStatus':
        return await getBotStatus(TELEGRAM_BOT_TOKEN)
      
      case 'getStats':
        return await getBotStats(supabaseClient)
      
      case 'setWebhook':
        return await setWebhook(TELEGRAM_BOT_TOKEN, params.webhookUrl)
      
      case 'deleteWebhook':
        return await deleteWebhook(TELEGRAM_BOT_TOKEN)
      
      case 'getBotInfo':
        return await getBotInfo(TELEGRAM_BOT_TOKEN)
      
      case 'updateBotProfile':
        return await updateBotProfile(TELEGRAM_BOT_TOKEN, params)
      
      case 'sendTestMessage':
        return await sendTestMessage(TELEGRAM_BOT_TOKEN, params)
      
      case 'getUpdates':
        return await getRecentUpdates(supabaseClient)
      
      default:
        throw new Error(`Unknown action: ${action}`)
    }

  } catch (error) {
    console.error('Bot control error:', error)
    
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

async function getBotStatus(token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)
    const webhookInfo = await response.json()
    
    const meResponse = await fetch(`https://api.telegram.org/bot${token}/getMe`)
    const botInfo = await meResponse.json()
    
    const isActive = webhookInfo.ok && webhookInfo.result.url !== ""
    
    return new Response(
      JSON.stringify({
        success: true,
        status: isActive ? 'active' : 'inactive',
        webhook: webhookInfo.result,
        bot: botInfo.result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Failed to get bot status: ${error.message}`)
  }
}

async function getBotStats(supabaseClient: any) {
  try {
    // Statistiques des utilisateurs
    const { count: totalUsers } = await supabaseClient
      .from('users')
      .select('telegram_id', { count: 'exact', head: true })

    // Statistiques des signalements
    const { count: totalReports } = await supabaseClient
      .from('reports')
      .select('id', { count: 'exact', head: true })

    // Statistiques des messages traités (dernières 24h)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const { count: recentMessages } = await supabaseClient
      .from('telegram_processed_updates')
      .select('update_id', { count: 'exact', head: true })
      .gte('processed_at', yesterday.toISOString())

    // Statistiques des suggestions
    const { count: totalSuggestions } = await supabaseClient
      .from('suggestions')
      .select('id', { count: 'exact', head: true })

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalUsers: totalUsers || 0,
          totalReports: totalReports || 0,
          recentMessages: recentMessages || 0,
          totalSuggestions: totalSuggestions || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Failed to get bot stats: ${error.message}`)
  }
}

async function setWebhook(token: string, webhookUrl: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    })
    
    const result = await response.json()
    
    return new Response(
      JSON.stringify({
        success: result.ok,
        result: result.result,
        message: result.ok ? 'Webhook configuré avec succès' : 'Erreur lors de la configuration du webhook'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Failed to set webhook: ${error.message}`)
  }
}

async function deleteWebhook(token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`, {
      method: 'POST'
    })
    
    const result = await response.json()
    
    return new Response(
      JSON.stringify({
        success: result.ok,
        message: result.ok ? 'Webhook supprimé avec succès' : 'Erreur lors de la suppression du webhook'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Failed to delete webhook: ${error.message}`)
  }
}

async function getBotInfo(token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`)
    const result = await response.json()
    
    return new Response(
      JSON.stringify({
        success: result.ok,
        bot: result.result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Failed to get bot info: ${error.message}`)
  }
}

async function updateBotProfile(token: string, params: any) {
  try {
    const results: any = {}
    
    // Mettre à jour le nom
    if (params.name) {
      const nameResponse = await fetch(`https://api.telegram.org/bot${token}/setMyName`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: params.name })
      })
      results.name = await nameResponse.json()
    }
    
    // Mettre à jour la description
    if (params.description) {
      const descResponse = await fetch(`https://api.telegram.org/bot${token}/setMyDescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: params.description })
      })
      results.description = await descResponse.json()
    }
    
    // Mettre à jour la description courte
    if (params.shortDescription) {
      const shortDescResponse = await fetch(`https://api.telegram.org/bot${token}/setMyShortDescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ short_description: params.shortDescription })
      })
      results.shortDescription = await shortDescResponse.json()
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: 'Profil du bot mis à jour avec succès'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Failed to update bot profile: ${error.message}`)
  }
}

async function sendTestMessage(token: string, params: any) {
  try {
    if (!params.chatId || !params.message) {
      throw new Error('Chat ID and message are required')
    }
    
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: params.chatId,
        text: params.message,
        parse_mode: 'HTML'
      })
    })
    
    const result = await response.json()
    
    return new Response(
      JSON.stringify({
        success: result.ok,
        message: result.ok ? 'Message de test envoyé' : 'Erreur lors de l\'envoi du message',
        result: result.result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Failed to send test message: ${error.message}`)
  }
}

async function getRecentUpdates(supabaseClient: any) {
  try {
    const { data: updates, error } = await supabaseClient
      .from('telegram_processed_updates')
      .select('*')
      .order('processed_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return new Response(
      JSON.stringify({
        success: true,
        updates: updates || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    throw new Error(`Failed to get recent updates: ${error.message}`)
  }
}