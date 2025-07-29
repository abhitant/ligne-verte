-- Ajouter les politiques RLS manquantes pour pending_reports
-- Cette table stocke temporairement les photos avant finalisation du signalement

-- Politique pour permettre l'insertion par le backend/bot
CREATE POLICY "Backend can insert pending reports" 
ON public.pending_reports 
FOR INSERT 
WITH CHECK (true);

-- Politique pour permettre la lecture par le backend/bot
CREATE POLICY "Backend can read pending reports" 
ON public.pending_reports 
FOR SELECT 
USING (true);

-- Politique pour permettre la suppression par le backend/bot
CREATE POLICY "Backend can delete pending reports" 
ON public.pending_reports 
FOR DELETE 
USING (true);

-- Politique pour permettre la mise à jour par le backend/bot
CREATE POLICY "Backend can update pending reports" 
ON public.pending_reports 
FOR UPDATE 
USING (true);