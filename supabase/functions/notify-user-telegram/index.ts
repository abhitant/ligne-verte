import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  telegramId: string;
  message: string;
  messageType?: 'rejection' | 'validation' | 'general';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { telegramId, message, messageType = 'general' }: NotificationRequest = await req.json();

    console.log('📤 Sending Telegram notification:', {
      telegramId,
      messageType,
      messageLength: message.length
    });

    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    // Envoyer le message via l'API Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      console.error('❌ Telegram API error:', telegramData);
      throw new Error(`Telegram API error: ${telegramData.description || 'Unknown error'}`);
    }

    console.log('✅ Notification sent successfully to user:', telegramId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent',
        telegramMessageId: telegramData.result.message_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
