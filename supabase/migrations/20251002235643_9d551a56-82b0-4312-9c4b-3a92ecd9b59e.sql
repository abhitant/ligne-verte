-- Fix Security Definer View Issue
-- Replace the security definer view with a proper materialized table approach

-- Drop the security definer view
DROP VIEW IF EXISTS public.user_display_info CASCADE;

-- Create a proper public display table (no sensitive data)
CREATE TABLE IF NOT EXISTS public.user_public_profiles (
  telegram_id text PRIMARY KEY,
  pseudo text,
  points_himpact integer DEFAULT 0,
  level_current integer DEFAULT 1,
  experience_points integer DEFAULT 0,
  badges jsonb DEFAULT '[]'::jsonb,
  reports_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.user_public_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to this table (safe - contains no PII)
CREATE POLICY "Anyone can view public profiles"
ON public.user_public_profiles
FOR SELECT
USING (true);

-- Create function to sync user data to public profiles
CREATE OR REPLACE FUNCTION public.sync_user_to_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update the public profile
  INSERT INTO public.user_public_profiles (
    telegram_id,
    pseudo,
    points_himpact,
    level_current,
    experience_points,
    badges,
    reports_count,
    created_at
  ) VALUES (
    NEW.telegram_id,
    NEW.pseudo,
    NEW.points_himpact,
    NEW.level_current,
    NEW.experience_points,
    NEW.badges,
    NEW.reports_count,
    NEW.created_at
  )
  ON CONFLICT (telegram_id) 
  DO UPDATE SET
    pseudo = EXCLUDED.pseudo,
    points_himpact = EXCLUDED.points_himpact,
    level_current = EXCLUDED.level_current,
    experience_points = EXCLUDED.experience_points,
    badges = EXCLUDED.badges,
    reports_count = EXCLUDED.reports_count;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically sync users to public profiles
DROP TRIGGER IF EXISTS sync_user_to_public_profile_trigger ON public.users;
CREATE TRIGGER sync_user_to_public_profile_trigger
AFTER INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_to_public_profile();

-- Populate existing data
INSERT INTO public.user_public_profiles (
  telegram_id,
  pseudo,
  points_himpact,
  level_current,
  experience_points,
  badges,
  reports_count,
  created_at
)
SELECT 
  telegram_id,
  pseudo,
  points_himpact,
  level_current,
  experience_points,
  badges,
  reports_count,
  created_at
FROM public.users
ON CONFLICT (telegram_id) DO NOTHING;