
-- Ajouter une colonne photo_url à la table pending_reports
ALTER TABLE public.pending_reports 
ADD COLUMN photo_url TEXT;

-- Créer une fonction pour upsert avec URL photo
CREATE OR REPLACE FUNCTION public.upsert_pending_report_with_url(p_telegram_id text, p_photo_url text)
RETURNS pending_reports
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_pending public.pending_reports;
BEGIN
  -- Supprimer les anciens signalements en attente pour cet utilisateur
  DELETE FROM public.pending_reports WHERE telegram_id = p_telegram_id;
  
  -- Insérer le nouveau signalement en attente avec l'URL photo
  INSERT INTO public.pending_reports (telegram_id, file_id, photo_url)
  VALUES (p_telegram_id, 'supabase', p_photo_url)
  RETURNING * INTO result_pending;
  
  RETURN result_pending;
END;
$$;

-- Créer une fonction pour récupérer et supprimer avec URL photo
CREATE OR REPLACE FUNCTION public.get_and_delete_pending_report_with_url(p_telegram_id text)
RETURNS pending_reports
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
