-- Supprimer l'ancienne vue
DROP VIEW IF EXISTS public.user_display_info;

-- Recréer la vue sans SECURITY DEFINER (par défaut c'est SECURITY INVOKER)
-- qui respecte les permissions de l'utilisateur qui fait la requête
CREATE VIEW public.user_display_info 
WITH (security_invoker = true)
AS 
SELECT 
  telegram_id,
  pseudo,
  points_himpact,
  created_at
FROM public.users;

-- Donner accès en lecture à cette vue
GRANT SELECT ON public.user_display_info TO anon, authenticated;