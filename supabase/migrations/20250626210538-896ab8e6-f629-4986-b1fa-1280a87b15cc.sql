
-- Create users table for Telegram bot
CREATE TABLE public.users (
  telegram_id TEXT PRIMARY KEY,
  telegram_username TEXT,
  pseudo TEXT,
  points_himpact INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_telegram_id TEXT NOT NULL REFERENCES public.users(telegram_id) ON DELETE CASCADE,
  photo_url TEXT,
  description TEXT,
  location_lat FLOAT NOT NULL,
  location_lng FLOAT NOT NULL,
  status TEXT DEFAULT 'en attente' CHECK (status IN ('en attente', 'validé', 'rejeté')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (telegram_id = current_setting('app.current_telegram_id', true));

-- Users can update their own data (for pseudo changes)
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (telegram_id = current_setting('app.current_telegram_id', true));

-- RLS Policies for reports table
-- Users can view their own reports
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (user_telegram_id = current_setting('app.current_telegram_id', true));

-- Users can create their own reports
CREATE POLICY "Users can create own reports" ON public.reports
  FOR INSERT WITH CHECK (user_telegram_id = current_setting('app.current_telegram_id', true));

-- Create function for backend operations (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_user_if_not_exists(
  p_telegram_id TEXT,
  p_telegram_username TEXT DEFAULT NULL,
  p_pseudo TEXT DEFAULT NULL
) RETURNS public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_user public.users;
BEGIN
  -- Try to insert new user, or get existing one
  INSERT INTO public.users (telegram_id, telegram_username, pseudo)
  VALUES (p_telegram_id, p_telegram_username, p_pseudo)
  ON CONFLICT (telegram_id) 
  DO UPDATE SET 
    telegram_username = COALESCE(EXCLUDED.telegram_username, users.telegram_username),
    pseudo = COALESCE(EXCLUDED.pseudo, users.pseudo)
  RETURNING * INTO result_user;
  
  RETURN result_user;
END;
$$;

-- Function to add points to user
CREATE OR REPLACE FUNCTION public.add_points_to_user(
  p_telegram_id TEXT,
  p_points INTEGER
) RETURNS public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_user public.users;
BEGIN
  UPDATE public.users 
  SET points_himpact = points_himpact + p_points
  WHERE telegram_id = p_telegram_id
  RETURNING * INTO result_user;
  
  RETURN result_user;
END;
$$;

-- Function to create report
CREATE OR REPLACE FUNCTION public.create_report(
  p_user_telegram_id TEXT,
  p_photo_url TEXT,
  p_description TEXT,
  p_location_lat FLOAT,
  p_location_lng FLOAT
) RETURNS public.reports
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_report public.reports;
BEGIN
  INSERT INTO public.reports (user_telegram_id, photo_url, description, location_lat, location_lng)
  VALUES (p_user_telegram_id, p_photo_url, p_description, p_location_lat, p_location_lng)
  RETURNING * INTO result_report;
  
  RETURN result_report;
END;
$$;

-- Function to update report status (for admin validation)
CREATE OR REPLACE FUNCTION public.update_report_status(
  p_report_id UUID,
  p_status TEXT
) RETURNS public.reports
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_report public.reports;
BEGIN
  UPDATE public.reports 
  SET status = p_status
  WHERE id = p_report_id
  RETURNING * INTO result_report;
  
  RETURN result_report;
END;
$$;

-- Function to get user by telegram_id (for bot operations)
CREATE OR REPLACE FUNCTION public.get_user_by_telegram_id(
  p_telegram_id TEXT
) RETURNS public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_user public.users;
BEGIN
  SELECT * INTO result_user 
  FROM public.users 
  WHERE telegram_id = p_telegram_id;
  
  RETURN result_user;
END;
$$;
