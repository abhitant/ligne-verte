-- Create RLS policies and functions
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