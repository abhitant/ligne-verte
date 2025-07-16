-- Supprimer les anciennes politiques restrictives sur la table users
DROP POLICY IF EXISTS "Users can view own data" ON public.users;

-- Créer une politique plus permissive pour l'accès public en lecture
DROP POLICY IF EXISTS "Allow public read access to pseudos only" ON public.users;
CREATE POLICY "Public can read user info for map" 
ON public.users 
FOR SELECT 
USING (true);

-- S'assurer que les signalements sont aussi accessibles publiquement
-- (cette politique existe déjà mais on la recrée pour être sûr)
DROP POLICY IF EXISTS "Public can view all reports" ON public.reports;
CREATE POLICY "Public can view all reports" 
ON public.reports 
FOR SELECT 
USING (true);