-- Permettre l'accès public à la vue reports_public pour tous les utilisateurs
CREATE POLICY "Anyone can view public reports" 
ON public.reports_public 
FOR SELECT 
USING (true);

-- Permettre l'accès public à la table users pour le leaderboard
CREATE POLICY "Anyone can view user leaderboard data" 
ON public.users 
FOR SELECT 
USING (true);

-- Permettre l'accès public à la vue user_display_info si elle existe
CREATE POLICY "Anyone can view user display info" 
ON public.user_display_info 
FOR SELECT 
USING (true);