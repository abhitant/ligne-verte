-- Synchroniser toutes les données des utilisateurs vers user_public_profiles
INSERT INTO public.user_public_profiles (
  telegram_id,
  pseudo,
  points_himpact,
  level_current,
  experience_points,
  badges,
  reports_count,
  created_at
)
SELECT 
  telegram_id,
  pseudo,
  points_himpact,
  level_current,
  experience_points,
  badges,
  reports_count,
  created_at
FROM public.users
ON CONFLICT (telegram_id) 
DO UPDATE SET
  pseudo = EXCLUDED.pseudo,
  points_himpact = EXCLUDED.points_himpact,
  level_current = EXCLUDED.level_current,
  experience_points = EXCLUDED.experience_points,
  badges = EXCLUDED.badges,
  reports_count = EXCLUDED.reports_count;

-- S'assurer que le trigger de synchronisation automatique existe et fonctionne
DROP TRIGGER IF EXISTS sync_user_profile_trigger ON public.users;

CREATE TRIGGER sync_user_profile_trigger
  AFTER INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_to_public_profile();