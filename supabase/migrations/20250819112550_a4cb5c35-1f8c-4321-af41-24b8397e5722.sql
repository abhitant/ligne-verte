-- Fix Security Definer View issue by explicitly creating views with SECURITY INVOKER
-- This ensures views respect the permissions of the user making the query, not the view creator

-- Drop and recreate reports_public view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.reports_public;

CREATE VIEW public.reports_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  -- Anonymize location by reducing precision to ~100m accuracy (3 decimal places)
  ROUND(location_lat::numeric, 3) as location_lat,
  ROUND(location_lng::numeric, 3) as location_lng,
  description,
  status,
  waste_type,
  brand,
  photo_url,
  cleanup_photo_url,
  waste_category,
  disposal_instructions,
  severity_level,
  is_cleaned,
  points_awarded,
  created_at,
  -- Create anonymized reporter identifier using SHA256 hash
  encode(sha256(user_telegram_id::bytea), 'hex') as reporter_hash
FROM public.reports;

-- Drop and recreate user_display_info view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.user_display_info;

CREATE VIEW public.user_display_info 
WITH (security_invoker = true) AS
SELECT 
  pseudo,
  points_himpact,
  reports_count,
  level_current,
  experience_points,
  badges,
  created_at
FROM public.users
WHERE pseudo IS NOT NULL AND points_himpact > 0;

-- Grant proper access to the views
GRANT SELECT ON public.reports_public TO anon;
GRANT SELECT ON public.reports_public TO authenticated;
GRANT SELECT ON public.user_display_info TO anon;
GRANT SELECT ON public.user_display_info TO authenticated;