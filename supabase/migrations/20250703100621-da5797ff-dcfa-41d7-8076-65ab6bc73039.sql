-- Add gamification fields to users table
ALTER TABLE public.users 
ADD COLUMN experience_points integer DEFAULT 0,
ADD COLUMN level_current integer DEFAULT 1,
ADD COLUMN reports_count integer DEFAULT 0,
ADD COLUMN cleanups_count integer DEFAULT 0,
ADD COLUMN streak_days integer DEFAULT 0,
ADD COLUMN last_activity_date timestamp with time zone DEFAULT now(),
ADD COLUMN badges jsonb DEFAULT '[]'::jsonb;