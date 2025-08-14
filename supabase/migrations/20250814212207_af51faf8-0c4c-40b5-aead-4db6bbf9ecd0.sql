-- Fix security vulnerability: Restrict waitlist_users table access to admins only
-- Drop the existing policy that allows public access
DROP POLICY IF EXISTS "Admins can view all waitlist entries" ON public.waitlist_users;

-- Create a new policy that only allows authenticated admins to view waitlist entries
CREATE POLICY "Only authenticated admins can view waitlist entries" 
ON public.waitlist_users 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Keep the existing INSERT policy for public registration
-- (This policy already exists and is correct)