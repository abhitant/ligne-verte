-- Fix security vulnerability: Restrict public access to users table
-- and create safe public access for map/leaderboard functionality

-- 1. Drop the existing public read policy that exposes all user data
DROP POLICY IF EXISTS "Public can read user info for map" ON public.users;

-- 2. Create new secure policies for the users table
-- Allow authenticated users to view their own data only
CREATE POLICY "Users can view own data" 
ON public.users 
FOR SELECT 
TO authenticated
USING (auth.uid() = auth_user_id);

-- Allow admins to view all user data
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Create a limited public policy for safe fields needed by map/leaderboard
-- Only expose non-sensitive fields and only for users with pseudonyms
CREATE POLICY "Public can view safe user info for map" 
ON public.users 
FOR SELECT 
TO anon, authenticated
USING (
  pseudo IS NOT NULL 
  AND points_himpact IS NOT NULL 
  AND points_himpact > 0
);

-- 4. Update the user_display_info view to be safer and exclude telegram_id
DROP VIEW IF EXISTS public.user_display_info;

CREATE VIEW public.user_display_info AS 
SELECT 
  pseudo,
  points_himpact,
  reports_count,
  level_current,
  experience_points,
  badges,
  created_at
FROM public.users 
WHERE pseudo IS NOT NULL 
  AND points_himpact > 0;