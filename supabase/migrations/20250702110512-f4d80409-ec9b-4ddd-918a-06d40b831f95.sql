-- Fix search_path security issue for upsert_pending_report_with_url function
CREATE OR REPLACE FUNCTION public.upsert_pending_report_with_url(p_telegram_id text, p_photo_url text)
 RETURNS pending_reports
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $$
DECLARE
  result_pending public.pending_reports;
BEGIN
  -- Supprimer les anciens signalements en attente pour cet utilisateur
  DELETE FROM public.pending_reports WHERE telegram_id = p_telegram_id;
  
  -- Insérer le nouveau signalement en attente avec l'URL photo
  INSERT INTO public.pending_reports (telegram_id, file_id, photo_url)
  VALUES (p_telegram_id, 'supabase', p_photo_url)
  RETURNING * INTO result_pending;
  
  RETURN result_pending;
END;
$$;