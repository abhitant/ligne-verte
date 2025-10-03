-- Modify validate_report_and_award_points to send notification on rejection
CREATE OR REPLACE FUNCTION public.validate_report_and_award_points(p_report_id uuid, p_status text)
 RETURNS reports
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
DECLARE
  result_report public.reports;
  user_telegram_id text;
  awarded_points_to_give integer;
  notification_message text;
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
$function$;