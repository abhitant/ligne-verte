-- Fix search path for the new function we just created
DROP FUNCTION IF EXISTS public.create_suggestion(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.create_suggestion(
  p_telegram_id TEXT,
  p_suggestion_type TEXT,
  p_content TEXT
)
RETURNS suggestions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
DECLARE
  result_suggestion public.suggestions;
BEGIN
  INSERT INTO public.suggestions (telegram_id, suggestion_type, content)
  VALUES (p_telegram_id, p_suggestion_type, p_content)
  RETURNING * INTO result_suggestion;
  
  RETURN result_suggestion;
END;
$$;