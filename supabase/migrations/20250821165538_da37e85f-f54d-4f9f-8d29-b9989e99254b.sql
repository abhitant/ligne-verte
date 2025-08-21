-- Supprimer les politiques RLS restrictives et permettre l'accès public aux signalements

-- Pour la vue reports_public - permettre l'accès à tous
DROP POLICY IF EXISTS "Allow public access to reports_public" ON public.reports_public;
CREATE POLICY "Allow public access to reports_public" 
ON public.reports_public 
FOR SELECT 
USING (true);

-- Pour la table reports - permettre la lecture publique des données anonymisées
DROP POLICY IF EXISTS "Anyone can view reports" ON public.reports;
CREATE POLICY "Anyone can view reports" 
ON public.reports 
FOR SELECT 
USING (true);

-- S'assurer que RLS est activé sur reports_public
ALTER TABLE public.reports_public ENABLE ROW LEVEL SECURITY;

-- Créer une vue publique simplifiée si elle n'existe pas encore
CREATE OR REPLACE VIEW public.reports_map_view AS
SELECT 
  id,
  location_lat,
  location_lng,
  description,
  status,
  created_at,
  photo_url,
  waste_type,
  brand,
  -- Hash anonymisé pour l'affichage
  substring(md5(user_telegram_id::text), 1, 8) as reporter_hash
FROM public.reports
WHERE location_lat IS NOT NULL 
  AND location_lng IS NOT NULL;

-- Permettre l'accès public à cette vue
GRANT SELECT ON public.reports_map_view TO anon, authenticated;