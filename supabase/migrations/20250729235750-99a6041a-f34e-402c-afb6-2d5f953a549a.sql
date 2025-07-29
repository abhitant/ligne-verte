-- Créer une table pour la liste d'attente
CREATE TABLE public.waitlist_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  zone TEXT NOT NULL,
  motivation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending',
  
  -- Éviter les doublons par email
  UNIQUE(email)
);

-- Activer RLS
ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (pour les inscriptions)
CREATE POLICY "Anyone can register for waitlist" 
ON public.waitlist_users 
FOR INSERT 
WITH CHECK (true);

-- Politique pour que les admins puissent voir toutes les inscriptions
CREATE POLICY "Admins can view all waitlist entries" 
ON public.waitlist_users 
FOR SELECT 
USING (true);

-- Créer une fonction pour l'inscription à la liste d'attente
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