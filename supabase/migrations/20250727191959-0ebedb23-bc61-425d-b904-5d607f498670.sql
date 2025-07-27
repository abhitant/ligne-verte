-- Add image_hash column to pending_reports table
ALTER TABLE public.pending_reports 
ADD COLUMN image_hash TEXT;

-- Add image_hash column to reports table if it doesn't exist
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS image_hash TEXT;

-- Create an improved function to upsert pending reports with AI data
CREATE OR REPLACE FUNCTION public.upsert_pending_report_with_ai_data(
  p_telegram_id text, 
  p_photo_url text, 
  p_image_hash text,
  p_ai_validated boolean DEFAULT true
)
RETURNS pending_reports
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $function$
DECLARE
  result_pending public.pending_reports;
BEGIN
  -- Delete any existing pending reports for this user
  DELETE FROM public.pending_reports WHERE telegram_id = p_telegram_id;
  
  -- Insert the new pending report with AI data
  INSERT INTO public.pending_reports (telegram_id, file_id, photo_url, image_hash)
  VALUES (p_telegram_id, 'supabase', p_photo_url, p_image_hash)
  RETURNING * INTO result_pending;
  
  RETURN result_pending;
END;
$function$;