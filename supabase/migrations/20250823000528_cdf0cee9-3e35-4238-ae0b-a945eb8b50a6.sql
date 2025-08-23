-- Créer une table spéciale pour les administrateurs
CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_login timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true
);

-- Activer RLS sur la table admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les autres admins
CREATE POLICY "Admins can view other admins" ON public.admins
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = true
  )
);

-- Seuls les admins peuvent créer d'autres admins
CREATE POLICY "Admins can create other admins" ON public.admins
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = true
  )
);

-- Fonction pour vérifier si un utilisateur est admin via la nouvelle table
CREATE OR REPLACE FUNCTION public.is_admin_user(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = user_email AND is_active = true
  );
$$;

-- Fonction pour l'authentification admin
CREATE OR REPLACE FUNCTION public.authenticate_admin(p_email text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
DECLARE
  admin_record public.admins;
  result json;
BEGIN
  -- Vérifier les identifiants admin
  SELECT * INTO admin_record
  FROM public.admins 
  WHERE email = p_email 
    AND is_active = true
    AND crypt(p_password, password_hash) = password_hash;
  
  IF admin_record.id IS NOT NULL THEN
    -- Mettre à jour la dernière connexion
    UPDATE public.admins 
    SET last_login = now()
    WHERE id = admin_record.id;
    
    -- Retourner les informations admin
    result := json_build_object(
      'success', true,
      'admin_id', admin_record.id,
      'email', admin_record.email,
      'full_name', admin_record.full_name
    );
  ELSE
    result := json_build_object('success', false, 'error', 'Identifiants invalides');
  END IF;
  
  RETURN result;
END;
$$;

-- Fonction pour créer un premier admin
CREATE OR REPLACE FUNCTION public.create_first_admin(p_email text, p_password text, p_full_name text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
DECLARE
  result json;
BEGIN
  -- Vérifier si aucun admin n'existe
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE is_active = true) THEN
    INSERT INTO public.admins (email, password_hash, full_name)
    VALUES (p_email, crypt(p_password, gen_salt('bf')), p_full_name);
    
    result := json_build_object('success', true, 'message', 'Premier administrateur créé avec succès');
  ELSE
    result := json_build_object('success', false, 'error', 'Des administrateurs existent déjà');
  END IF;
  
  RETURN result;
END;
$$;

-- Insérer un admin par défaut (vous pouvez changer ces identifiants)
SELECT public.create_first_admin('admin@himpact.com', 'admin123', 'Administrateur Principal');