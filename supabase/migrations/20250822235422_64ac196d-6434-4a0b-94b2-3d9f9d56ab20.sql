-- Corriger la fonction pour inclure le search_path pour la sécurité
CREATE OR REPLACE FUNCTION public.validate_report_and_award_points(p_report_id uuid, p_status text)
RETURNS reports
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
DECLARE
  result_report public.reports;
  user_telegram_id text;
  awarded_points_to_give integer;
BEGIN
  -- Récupérer le signalement avec ses informations
  SELECT * INTO result_report 
  FROM public.reports 
  WHERE id = p_report_id;
  
  IF result_report.id IS NULL THEN
    RAISE EXCEPTION 'Signalement non trouvé';
  END IF;
  
  -- Mettre à jour le statut
  UPDATE public.reports 
  SET status = p_status
  WHERE id = p_report_id
  RETURNING * INTO result_report;
  
  -- Si le statut est "validé", attribuer les points à l'utilisateur
  IF p_status = 'validé' AND result_report.points_awarded > 0 THEN
    -- Ajouter les points à l'utilisateur
    UPDATE public.users 
    SET points_himpact = points_himpact + result_report.points_awarded
    WHERE telegram_id = result_report.user_telegram_id;
  END IF;
  
  RETURN result_report;
END;
$$;