-- Fix security issue: Restrict telegram_processed_updates table access to backend services only
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Backend can manage processed updates" ON public.telegram_processed_updates;

-- Create restrictive policies that only allow backend/service role access
-- Edge functions run with service role privileges, so they can bypass RLS
-- But we'll add explicit policies for clarity

-- Allow service role to manage all operations
CREATE POLICY "Service role can manage processed updates" 
ON public.telegram_processed_updates 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- No public access policies - this ensures the table is not publicly readable