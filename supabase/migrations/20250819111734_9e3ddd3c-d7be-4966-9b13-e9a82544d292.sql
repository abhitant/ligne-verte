-- Remove the public RLS policy from reports table
DROP POLICY IF EXISTS "Public can view all reports" ON public.reports;

-- Create admin-only RLS policy for reports table
CREATE POLICY "Admins can view all reports" 
ON public.reports 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create public view with anonymized data
CREATE OR REPLACE VIEW public.reports_public AS
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

-- Grant SELECT access to the public view for anonymous and authenticated users
GRANT SELECT ON public.reports_public TO anon;
GRANT SELECT ON public.reports_public TO authenticated;

-- Ensure the public role cannot access the reports table directly
REVOKE ALL ON public.reports FROM anon;
REVOKE ALL ON public.reports FROM authenticated;