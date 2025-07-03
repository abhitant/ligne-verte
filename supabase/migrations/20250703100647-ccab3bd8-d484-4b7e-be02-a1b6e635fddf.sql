-- Create achievements table and related structures
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