-- Supprimer les anciennes politiques RLS restrictives
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can create own reports" ON public.reports;

-- Créer une politique pour permettre la lecture publique des signalements 
-- (nécessaire pour l'affichage sur la carte publique)
CREATE POLICY "Public can view all reports" ON public.reports
  FOR SELECT USING (true);

-- Créer une politique pour l'insertion via les fonctions backend sécurisées
-- (les signalements sont créés uniquement via les fonctions du bot Telegram)
CREATE POLICY "Backend can insert reports" ON public.reports
  FOR INSERT WITH CHECK (true);