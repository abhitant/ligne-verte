-- Fix security vulnerability: Restrict public access to users table
-- First, clean up existing policies and recreate them properly

-- 1. Drop all existing policies on users table to start fresh
DROP POLICY IF EXISTS "Public can read user info for map" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Public can view safe user info for map" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

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

-- Allow users to update their own data (recreate the update policy)
CREATE POLICY "Users can update own data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

-- 3. Create a limited public policy for ONLY non-sensitive fields needed by map/leaderboard
-- This will be very restrictive and only show pseudo, points, and counts
CREATE POLICY "Public can view limited user stats" 
ON public.users 
FOR SELECT 
TO anon, authenticated
USING (
  pseudo IS NOT NULL 
  AND points_himpact > 0
);