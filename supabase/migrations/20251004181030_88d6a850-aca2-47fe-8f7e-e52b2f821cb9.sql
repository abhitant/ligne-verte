-- Supprimer la contrainte check sur waste_type qui bloque les signalements
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_waste_type_check;

-- Optionnel : créer un index pour améliorer les performances des requêtes sur waste_type
CREATE INDEX IF NOT EXISTS idx_reports_waste_type ON public.reports(waste_type);