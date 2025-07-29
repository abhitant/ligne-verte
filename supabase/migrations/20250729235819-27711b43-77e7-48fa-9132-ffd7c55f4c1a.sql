-- Corriger le problème de sécurité pour la fonction add_to_waitlist
CREATE OR REPLACE FUNCTION public.add_to_waitlist(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_zone TEXT,
  p_motivation TEXT DEFAULT NULL
)
RETURNS waitlist_users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
DECLARE
  result_user public.waitlist_users;
BEGIN
  INSERT INTO public.waitlist_users (name, email, phone, zone, motivation)
  VALUES (p_name, p_email, p_phone, p_zone, p_motivation)
  ON CONFLICT (email) 
  DO UPDATE SET 
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    zone = EXCLUDED.zone,
    motivation = EXCLUDED.motivation,
    created_at = now()
  RETURNING * INTO result_user;
  
  RETURN result_user;
END;
$$;