-- Recalculer les points de chaque utilisateur basé sur leurs signalements validés
UPDATE public.users u
SET points_himpact = COALESCE((
  SELECT SUM(r.points_awarded)
  FROM public.reports r
  WHERE r.user_telegram_id = u.telegram_id
    AND r.status = 'validé'
), 0);

-- Synchroniser vers user_public_profiles
UPDATE public.user_public_profiles upp
SET points_himpact = u.points_himpact
FROM public.users u
WHERE upp.telegram_id = u.telegram_id;