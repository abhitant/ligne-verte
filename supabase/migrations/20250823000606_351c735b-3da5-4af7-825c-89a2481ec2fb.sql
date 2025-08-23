-- Activer l'extension pgcrypto pour le hachage des mots de passe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

-- Politique simple pour permettre l'accès aux admins authentifiés
CREATE POLICY "Allow admin access" ON public.admins
FOR ALL USING (true);

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

-- Fonction pour créer un admin
CREATE OR REPLACE FUNCTION public.create_admin(p_email text, p_password text, p_full_name text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
DECLARE
  result json;
BEGIN
  BEGIN
    INSERT INTO public.admins (email, password_hash, full_name)
    VALUES (p_email, crypt(p_password, gen_salt('bf')), p_full_name);
    
    result := json_build_object('success', true, 'message', 'Administrateur créé avec succès');
  EXCEPTION
    WHEN unique_violation THEN
      result := json_build_object('success', false, 'error', 'Cet email existe déjà');
    WHEN OTHERS THEN
      result := json_build_object('success', false, 'error', 'Erreur lors de la création');
  END;
  
  RETURN result;
END;
$$;

-- Créer un admin par défaut
INSERT INTO public.admins (email, password_hash, full_name)
VALUES ('admin@himpact.com', crypt('admin123', gen_salt('bf')), 'Administrateur Principal')
ON CONFLICT (email) DO NOTHING;