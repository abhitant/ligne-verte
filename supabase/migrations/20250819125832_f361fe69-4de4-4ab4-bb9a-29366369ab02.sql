
-- 1) Fonction RPC sécurisée pour exposer UNIQUEMENT les coordonnées arrondies
CREATE OR REPLACE FUNCTION public.get_report_locations()
RETURNS TABLE (
  id uuid,
  location_lat double precision,
  location_lng double precision
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    r.id,
    round(r.location_lat::numeric, 3)::double precision AS location_lat,
    round(r.location_lng::numeric, 3)::double precision AS location_lng
  FROM public.reports r
  WHERE r.location_lat IS NOT NULL
    AND r.location_lng IS NOT NULL;
$$;

-- 2) Droits d'accès: exécutable par anon et authenticated
REVOKE ALL ON FUNCTION public.get_report_locations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_report_locations() TO anon;
GRANT EXECUTE ON FUNCTION public.get_report_locations() TO authenticated;
