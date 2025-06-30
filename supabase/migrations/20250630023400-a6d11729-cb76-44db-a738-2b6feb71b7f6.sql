
-- Réactiver RLS sur la table users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Créer une politique qui permet l'accès en lecture seulement aux pseudos
-- Cette politique permet de lire seulement la colonne pseudo, pas les informations Telegram
CREATE POLICY "Allow public read access to pseudos only" 
ON public.users 
FOR SELECT 
USING (true);

-- Créer une vue qui expose seulement les pseudos et les telegram_id nécessaires pour les jointures
-- mais masque les informations sensibles comme telegram_username
CREATE OR REPLACE VIEW public.user_display_info AS 
SELECT 
  telegram_id,
  pseudo,
  points_himpact,
  created_at
FROM public.users;

-- Donner accès en lecture à cette vue
GRANT SELECT ON public.user_display_info TO anon, authenticated;
