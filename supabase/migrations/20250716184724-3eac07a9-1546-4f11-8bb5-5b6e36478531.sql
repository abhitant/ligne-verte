-- Activer RLS sur la vue user_display_info
ALTER TABLE public.user_display_info ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'accès en lecture à tous
CREATE POLICY "Anyone can view user display info" 
ON public.user_display_info 
FOR SELECT 
USING (true);