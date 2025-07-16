import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log(`Débora Data API called with action: ${action}`);

    switch (action) {
      case 'reports': {
        // Récupérer tous les signalements pour la carte
        const { data: reports, error } = await supabaseClient
          .from('reports')
          .select(`
            id,
            location_lat,
            location_lng,
            created_at,
            description,
            status,
            waste_type,
            user_telegram_id,
            photo_url
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching reports:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch reports' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Formatage des données pour Télégram
        const formattedReports = reports?.map(report => ({
          id: report.id,
          latitude: report.location_lat,
          longitude: report.location_lng,
          date: report.created_at,
          description: report.description || 'Pas de description',
          status: report.status || 'en attente',
          type: report.waste_type || 'autre',
          photo_url: report.photo_url
        })) || [];

        console.log(`Found ${formattedReports.length} reports`);

        return new Response(
          JSON.stringify({
            success: true,
            data: formattedReports,
            total: formattedReports.length
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'leaderboard': {
        const limit = parseInt(url.searchParams.get('limit') || '10');

        // Récupérer le classement des utilisateurs avec des points Himpact
        const { data: users, error } = await supabaseClient
          .from('users')
          .select(`
            telegram_id,
            pseudo,
            points_himpact,
            reports_count
          `)
          .not('pseudo', 'is', null)
          .gt('points_himpact', 0)
          .order('points_himpact', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Error fetching leaderboard:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch leaderboard' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Formatage avec rang
        const leaderboard = users?.map((user, index) => ({
          rank: index + 1,
          pseudo: user.pseudo,
          points_himpact: user.points_himpact || 0,
          reports_count: user.reports_count || 0,
          telegram_id: user.telegram_id
        })) || [];

        console.log(`Found ${leaderboard.length} users in leaderboard`);

        return new Response(
          JSON.stringify({
            success: true,
            data: leaderboard,
            total: leaderboard.length
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'stats': {
        // Récupérer les statistiques générales
        const { data: reportsCount, error: reportsError } = await supabaseClient
          .from('reports')
          .select('id', { count: 'exact' });

        const { data: usersCount, error: usersError } = await supabaseClient
          .from('users')
          .select('telegram_id', { count: 'exact' })
          .not('pseudo', 'is', null);

        if (reportsError || usersError) {
          console.error('Error fetching stats:', reportsError || usersError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch stats' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const stats = {
          total_reports: reportsCount?.length || 0,
          total_users: usersCount?.length || 0
        };

        console.log('Stats fetched:', stats);

        return new Response(
          JSON.stringify({
            success: true,
            data: stats
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ 
            error: 'Action non supportée',
            available_actions: ['reports', 'leaderboard', 'stats'],
            usage: {
              reports: '?action=reports - Récupère tous les signalements pour la carte',
              leaderboard: '?action=leaderboard&limit=10 - Récupère le classement des plus Himpactant',
              stats: '?action=stats - Récupère les statistiques générales'
            }
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

  } catch (error) {
    console.error('Unexpected error in debora-data function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});