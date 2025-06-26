
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_BOT_TOKEN = "7965588698:AAHVLYoEf5wNHWdDbwpXMj0uFdpykzjjfBA"
const WEBHOOK_URL = "https://mpowpfgigzdpebtuohfk.supabase.co/functions/v1/telegram-bot"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'info'

    console.log('=== TELEGRAM DIAGNOSTIC ===')
    console.log('Action:', action)

    if (action === 'set-webhook') {
      console.log('Setting webhook...')
      
      const setWebhookResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          allowed_updates: ['message']
        })
      })

      const setWebhookResult = await setWebhookResponse.json()
      console.log('Set webhook result:', setWebhookResult)

      return new Response(JSON.stringify({
        action: 'set-webhook',
        success: setWebhookResult.ok,
        result: setWebhookResult
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'get-webhook') {
      console.log('Getting webhook info...')
      
      const webhookResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`)
      const webhookInfo = await webhookResponse.json()
      console.log('Webhook info:', webhookInfo)

      return new Response(JSON.stringify({
        action: 'get-webhook',
        result: webhookInfo
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'get-me') {
      console.log('Getting bot info...')
      
      const botResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`)
      const botInfo = await botResponse.json()
      console.log('Bot info:', botInfo)

      return new Response(JSON.stringify({
        action: 'get-me',
        result: botInfo
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'send-test') {
      const chatId = url.searchParams.get('chat_id')
      if (!chatId) {
        return new Response(JSON.stringify({
          error: 'chat_id parameter required for send-test'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('Sending test message to chat:', chatId)
      
      const sendResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🤖 Test message from diagnostic function! Your bot is working!'
        })
      })

      const sendResult = await sendResponse.json()
      console.log('Send message result:', sendResult)

      return new Response(JSON.stringify({
        action: 'send-test',
        success: sendResult.ok,
        result: sendResult
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Default: return diagnostic info
    const [webhookResponse, botResponse] = await Promise.all([
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`),
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`)
    ])

    const [webhookInfo, botInfo] = await Promise.all([
      webhookResponse.json(),
      botResponse.json()
    ])

    console.log('Webhook info:', webhookInfo)
    console.log('Bot info:', botInfo)

    return new Response(JSON.stringify({
      action: 'diagnostic',
      webhook: webhookInfo,
      bot: botInfo,
      expected_webhook_url: WEBHOOK_URL,
      instructions: {
        'set-webhook': 'Add ?action=set-webhook to configure the webhook',
        'get-webhook': 'Add ?action=get-webhook to check webhook status',
        'get-me': 'Add ?action=get-me to get bot info',
        'send-test': 'Add ?action=send-test&chat_id=YOUR_CHAT_ID to send a test message'
      }
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Diagnostic error:', error)
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
