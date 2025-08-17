-- Create table for tracking processed Telegram updates to prevent loops
CREATE TABLE public.telegram_processed_updates (
  update_id bigint PRIMARY KEY,
  processed_at timestamp with time zone NOT NULL DEFAULT now(),
  processing_duration_ms integer,
  analyzer_mode text,
  user_telegram_id text,
  message_type text
);

-- Enable RLS
ALTER TABLE public.telegram_processed_updates ENABLE ROW LEVEL SECURITY;

-- Create policy for backend access
CREATE POLICY "Backend can manage processed updates" 
ON public.telegram_processed_updates 
FOR ALL 
USING (true);

-- Index for cleanup queries
CREATE INDEX idx_telegram_processed_updates_processed_at 
ON public.telegram_processed_updates(processed_at);

-- Function to cleanup old processed updates (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_processed_updates()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.telegram_processed_updates 
  WHERE processed_at < (now() - INTERVAL '24 hours');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;