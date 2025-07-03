-- Add gamification and enhanced tracking features inspired by OpenLitterMap

-- Add waste type and brand tracking to reports table
ALTER TABLE public.reports 
ADD COLUMN waste_type text CHECK (waste_type IN ('plastic_bottle', 'cigarette_butt', 'food_packaging', 'glass', 'metal_can', 'paper', 'organic', 'electronics', 'textile', 'other')),
ADD COLUMN brand text,
ADD COLUMN severity_level integer DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 5),
ADD COLUMN is_cleaned boolean DEFAULT false,
ADD COLUMN cleanup_photo_url text,
ADD COLUMN points_awarded integer DEFAULT 0;

-- Add gamification fields to users table
ALTER TABLE public.users 
ADD COLUMN experience_points integer DEFAULT 0,
ADD COLUMN level_current integer DEFAULT 1,
ADD COLUMN reports_count integer DEFAULT 0,
ADD COLUMN cleanups_count integer DEFAULT 0,
ADD COLUMN streak_days integer DEFAULT 0,
ADD COLUMN last_activity_date timestamp with time zone DEFAULT now(),
ADD COLUMN badges jsonb DEFAULT '[]'::jsonb;

-- Create achievements/badges table
CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  points_required integer DEFAULT 0,
  reports_required integer DEFAULT 0,
  cleanups_required integer DEFAULT 0,
  streak_required integer DEFAULT 0,
  badge_type text DEFAULT 'bronze' CHECK (badge_type IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at timestamp with time zone DEFAULT now()
);

-- Insert initial achievements
INSERT INTO public.achievements (name, description, icon, points_required, badge_type) VALUES
('First Reporter', 'Submit your first environmental report', '🌱', 10, 'bronze'),
('Eco Warrior', 'Submit 10 environmental reports', '🏆', 100, 'silver'),
('Environmental Champion', 'Submit 50 environmental reports', '🌟', 500, 'gold'),
('Plastic Hunter', 'Report 25 plastic waste items', '♻️', 250, 'silver'),
('Clean Hero', 'Clean up 5 reported waste locations', '🧹', 200, 'gold'),
('Streak Master', 'Report for 7 consecutive days', '🔥', 150, 'silver'),
('Brand Tracker', 'Identify brands in 10 reports', '🏷️', 100, 'bronze');

-- Create user achievements junction table
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_telegram_id text NOT NULL REFERENCES public.users(telegram_id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_telegram_id, achievement_id)
);

-- Create leaderboard view
CREATE VIEW public.leaderboard AS
SELECT 
  telegram_id,
  pseudo,
  experience_points,
  level_current,
  reports_count,
  cleanups_count,
  streak_days,
  badges,
  ROW_NUMBER() OVER (ORDER BY experience_points DESC) as rank
FROM public.users
WHERE pseudo IS NOT NULL
ORDER BY experience_points DESC;

-- Function to calculate user level based on experience points
CREATE OR REPLACE FUNCTION public.calculate_user_level(exp_points integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN exp_points < 50 THEN 1
    WHEN exp_points < 150 THEN 2
    WHEN exp_points < 300 THEN 3
    WHEN exp_points < 500 THEN 4
    WHEN exp_points < 750 THEN 5
    WHEN exp_points < 1100 THEN 6
    WHEN exp_points < 1500 THEN 7
    WHEN exp_points < 2000 THEN 8
    WHEN exp_points < 2600 THEN 9
    ELSE 10
  END;
$$;

-- Function to award points and update user stats
CREATE OR REPLACE FUNCTION public.award_points_for_report(
  p_telegram_id text,
  p_report_id uuid,
  p_base_points integer DEFAULT 20
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user public.users;
  new_level integer;
  bonus_points integer := 0;
  total_points integer;
  achievements_earned jsonb := '[]'::jsonb;
BEGIN
  -- Get current user stats
  SELECT * INTO current_user 
  FROM public.users 
  WHERE telegram_id = p_telegram_id;
  
  IF current_user.telegram_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Calculate bonus points based on report quality
  SELECT 
    CASE 
      WHEN waste_type IS NOT NULL THEN p_base_points + 5
      WHEN brand IS NOT NULL THEN p_base_points + 10
      ELSE p_base_points
    END INTO bonus_points
  FROM public.reports 
  WHERE id = p_report_id;
  
  total_points := COALESCE(bonus_points, p_base_points);
  
  -- Update user stats
  UPDATE public.users SET
    experience_points = experience_points + total_points,
    reports_count = reports_count + 1,
    last_activity_date = now()
  WHERE telegram_id = p_telegram_id;
  
  -- Calculate new level
  SELECT calculate_user_level(current_user.experience_points + total_points) INTO new_level;
  
  -- Update level if changed
  IF new_level > current_user.level_current THEN
    UPDATE public.users SET level_current = new_level WHERE telegram_id = p_telegram_id;
  END IF;
  
  -- Update report with points awarded
  UPDATE public.reports SET points_awarded = total_points WHERE id = p_report_id;
  
  -- Check for new achievements (simplified)
  -- First Reporter achievement
  IF current_user.reports_count = 0 THEN
    INSERT INTO public.user_achievements (user_telegram_id, achievement_id)
    SELECT p_telegram_id, id FROM public.achievements WHERE name = 'First Reporter'
    ON CONFLICT (user_telegram_id, achievement_id) DO NOTHING;
    
    achievements_earned := jsonb_build_array('First Reporter');
  END IF;
  
  RETURN jsonb_build_object(
    'points_awarded', total_points,
    'new_level', new_level,
    'level_up', new_level > current_user.level_current,
    'achievements_earned', achievements_earned
  );
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" 
ON public.achievements FOR SELECT USING (true);

-- Create policies for user_achievements
CREATE POLICY "Users can view all achievements earned" 
ON public.user_achievements FOR SELECT USING (true);

CREATE POLICY "Backend can insert user achievements" 
ON public.user_achievements FOR INSERT WITH CHECK (true);

-- Create trigger to automatically award points when report is created
CREATE OR REPLACE FUNCTION public.auto_award_points_on_report()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Award points for new report
  PERFORM public.award_points_for_report(NEW.user_telegram_id, NEW.id, 20);
  RETURN NEW;
END;
$$;

CREATE TRIGGER award_points_on_new_report
  AFTER INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_award_points_on_report();