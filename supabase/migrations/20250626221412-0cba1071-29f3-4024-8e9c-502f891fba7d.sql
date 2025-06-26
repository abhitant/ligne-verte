
-- Créer la table pour les signalements en attente (photos sans localisation)
CREATE TABLE public.pending_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour optimiser les recherches par telegram_id
CREATE INDEX idx_pending_reports_telegram_id ON public.pending_reports(telegram_id);

-- Index pour optimiser le nettoyage automatique basé sur created_at
CREATE INDEX idx_pending_reports_created_at ON public.pending_reports(created_at);

-- Fonction pour nettoyer les entrées trop anciennes (plus de 1 heure)
CREATE OR REPLACE FUNCTION public.cleanup_old_pending_reports()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.pending_reports 
  WHERE created_at < (now() - INTERVAL '1 hour');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Fonction pour insérer ou mettre à jour un signalement en attente
CREATE OR REPLACE FUNCTION public.upsert_pending_report(
  p_telegram_id TEXT,
  p_file_id TEXT
) RETURNS public.pending_reports
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_pending public.pending_reports;
BEGIN
  -- Supprimer les anciens signalements en attente pour cet utilisateur
  DELETE FROM public.pending_reports WHERE telegram_id = p_telegram_id;
  
  -- Insérer le nouveau signalement en attente
  INSERT INTO public.pending_reports (telegram_id, file_id)
  VALUES (p_telegram_id, p_file_id)
  RETURNING * INTO result_pending;
  
  RETURN result_pending;
END;
$$;

-- Fonction pour récupérer et supprimer un signalement en attente
CREATE OR REPLACE FUNCTION public.get_and_delete_pending_report(
  p_telegram_id TEXT
) RETURNS public.pending_reports
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_pending public.pending_reports;
BEGIN
  -- Récupérer le signalement en attente
  SELECT * INTO result_pending 
  FROM public.pending_reports 
  WHERE telegram_id = p_telegram_id;
  
  -- Si trouvé, le supprimer
  IF result_pending.id IS NOT NULL THEN
    DELETE FROM public.pending_reports 
    WHERE telegram_id = p_telegram_id;
  END IF;
  
  RETURN result_pending;
END;
$$;
