-- Permettre l'accès public en lecture à la table reports pour tous les utilisateurs
CREATE POLICY "Anyone can view reports" 
ON public.reports 
FOR SELECT 
USING (true);

-- Permettre l'accès public en lecture à la table users pour le leaderboard  
CREATE POLICY "Anyone can view user data" 
ON public.users 
FOR SELECT 
USING (true);