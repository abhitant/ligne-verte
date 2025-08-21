-- Supprimer les restrictions et permettre l'accès public aux signalements

-- Mettre à jour la politique existante pour permettre l'accès public total
DROP POLICY IF EXISTS "Anyone can view reports" ON public.reports;
CREATE POLICY "Public can view all reports" 
ON public.reports 
FOR SELECT 
TO public 
USING (true);

-- S'assurer que les utilisateurs anonymes et authentifiés peuvent lire
GRANT SELECT ON public.reports TO anon, authenticated;

-- Créer une nouvelle fonction RPC pour récupérer les signalements publics avec données anonymisées
CREATE OR REPLACE FUNCTION public.get_public_reports()
RETURNS TABLE (
  id uuid,
  location_lat double precision,
  location_lng double precision,
  description text,
  status text,
  created_at timestamp with time zone,
  photo_url text,
  waste_type text,
  brand text,
  reporter_hash text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    r.id,
    r.location_lat,
    r.location_lng,
    r.description,
    r.status,
    r.created_at,
    r.photo_url,
    r.waste_type,
    r.brand,
    substring(md5(r.user_telegram_id::text), 1, 8) as reporter_hash
  FROM public.reports r
  WHERE r.location_lat IS NOT NULL 
    AND r.location_lng IS NOT NULL
  ORDER BY r.created_at DESC;
$$;