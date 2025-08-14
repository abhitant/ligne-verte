-- Fix security vulnerability: Restrict users table access and create safe public view
-- Drop the existing policy that allows public access to all user data
DROP POLICY IF EXISTS "Public can read user info for map" ON public.users;

-- Create a new policy that only allows users to see their own data
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
TO authenticated
USING (auth.uid() = auth_user_id);

-- Create a new policy for admin access to all user data
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update the existing user_display_info view to remove sensitive telegram_id
-- and make it safe for public consumption
DROP VIEW IF EXISTS public.user_display_info;

CREATE VIEW public.user_display_info AS
SELECT 
  pseudo,
  points_himpact,
  level_current,
  experience_points,
  reports_count,
  cleanups_count,
  badges,
  created_at
FROM public.users
WHERE pseudo IS NOT NULL; -- Only show users with pseudonyms

-- Enable RLS on the view (though views inherit from base table policies)
-- Create a public policy for the safe user display info
CREATE POLICY "Anyone can view safe user display info"
ON public.user_display_info
FOR SELECT
USING (true);