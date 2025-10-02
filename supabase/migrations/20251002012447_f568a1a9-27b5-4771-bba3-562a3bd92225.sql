-- Fix User Personal Information Exposure
-- Remove public access to users table, use user_display_info view for public data

-- Drop the problematic policy that allows anyone to view user data
DROP POLICY IF EXISTS "Anyone can view user data" ON public.users;

-- Recreate user_display_info view with SECURITY DEFINER
-- This allows the view to read from users table despite RLS
DROP VIEW IF EXISTS public.user_display_info;

CREATE VIEW public.user_display_info 
WITH (security_invoker = false) AS
SELECT 
  pseudo,
  points_himpact,
  level_current,
  experience_points,
  badges,
  reports_count,
  created_at
FROM public.users;

-- Grant SELECT permission on the view to anon and authenticated roles
GRANT SELECT ON public.user_display_info TO anon, authenticated;

-- Note: The users table now has these policies:
-- 1. "Users can view own data" - authenticated users can view their own data
-- 2. "Admins can view all users" - admins can view all users
-- 3. "Users can update own data" - users can update their own data
-- This ensures sensitive data like telegram_id and telegram_username are protected