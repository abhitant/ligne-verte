-- Update validate_report_and_award_points function to calculate points based on cleanup photo
CREATE OR REPLACE FUNCTION public.validate_report_and_award_points(p_report_id uuid, p_status text)
RETURNS reports
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $$
DECLARE
  result_report public.reports;
  user_telegram_id text;
  points_to_award integer;
  notification_message text;
BEGIN
  -- Récupérer le signalement avec ses informations
  SELECT * INTO result_report 
  FROM public.reports 
  WHERE id = p_report_id;
  
  IF result_report.id IS NULL THEN
    RAISE EXCEPTION 'Signalement non trouvé';
  END IF;
  
  -- Calculer les points : 10 de base + 30 si photo de nettoyage fournie
  IF p_status = 'validé' THEN
    points_to_award := 10; -- Points de base
    IF result_report.cleanup_photo_url IS NOT NULL THEN
      points_to_award := points_to_award + 30; -- Bonus pour photo de nettoyage
    END IF;
    
    -- Mettre à jour les points attribués dans le signalement
    UPDATE public.reports 
    SET status = p_status, points_awarded = points_to_award
    WHERE id = p_report_id
    RETURNING * INTO result_report;
    
    -- Ajouter les points à l'utilisateur
    UPDATE public.users 
    SET points_himpact = points_himpact + points_to_award
    WHERE telegram_id = result_report.user_telegram_id;
  ELSE
    -- Si rejeté, juste mettre à jour le statut
    UPDATE public.reports 
    SET status = p_status
    WHERE id = p_report_id
    RETURNING * INTO result_report;
  END IF;
  
  -- Si le statut est "rejeté", créer une notification pour l'utilisateur
  IF p_status = 'rejeté' THEN
    notification_message := '❌ <b>Signalement non validé</b>

Nous avons examiné votre signalement avec attention, mais malheureusement il ne peut pas être validé pour le moment.

Cela peut arriver si :
• La photo n''est pas assez claire
• L''objet signalé n''est pas un déchet
• Le lieu ne correspond pas

💡 <b>Vous pouvez faire un nouveau signalement !</b>
Prenez une photo claire d''un déchet abandonné et partagez sa localisation.

Merci pour votre engagement ! 🌍';

    INSERT INTO public.notifications (
      target_user_telegram_id,
      message,
      message_type,
      status
    ) VALUES (
      result_report.user_telegram_id,
      notification_message,
      'rejection',
      'pending'
    );
  END IF;
  
  RETURN result_report;
END;
$$;