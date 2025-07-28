-- Add waste classification columns to reports table
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS waste_category TEXT,
ADD COLUMN IF NOT EXISTS disposal_instructions TEXT;

-- Add waste classification columns to pending_reports table  
ALTER TABLE public.pending_reports
ADD COLUMN IF NOT EXISTS waste_category TEXT,
ADD COLUMN IF NOT EXISTS disposal_instructions TEXT;

-- Update the upsert function to handle waste classification data
CREATE OR REPLACE FUNCTION public.upsert_pending_report_with_waste_data(
  p_telegram_id text, 
  p_photo_url text, 
  p_image_hash text,
  p_waste_category text DEFAULT NULL,
  p_disposal_instructions text DEFAULT NULL,
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
  
  -- Insert the new pending report with waste classification data
  INSERT INTO public.pending_reports (
    telegram_id, 
    file_id, 
    photo_url, 
    image_hash,
    waste_category,
    disposal_instructions
  )
  VALUES (
    p_telegram_id, 
    'supabase', 
    p_photo_url, 
    p_image_hash,
    p_waste_category,
    p_disposal_instructions
  )
  RETURNING * INTO result_pending;
  
  RETURN result_pending;
END;
$function$;