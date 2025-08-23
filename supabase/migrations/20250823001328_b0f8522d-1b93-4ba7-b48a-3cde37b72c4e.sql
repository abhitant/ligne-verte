-- Corriger la fonction d'authentification admin pour ne plus utiliser crypt
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
  -- Vérifier les identifiants admin (mot de passe en texte simple pour le moment)
  SELECT * INTO admin_record
  FROM public.admins 
  WHERE email = p_email 
    AND is_active = true;
  
  IF admin_record.id IS NOT NULL THEN
    -- Pour le moment, vérification simple du mot de passe
    -- En production, vous devriez utiliser un hachage sécurisé
    IF admin_record.password_hash = p_password THEN
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
  ELSE
    result := json_build_object('success', false, 'error', 'Identifiants invalides');
  END IF;
  
  RETURN result;
END;
$$;

-- Fonction pour créer un admin avec mot de passe simple
CREATE OR REPLACE FUNCTION public.create_admin_simple(p_email text, p_password text, p_full_name text DEFAULT NULL)
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
    VALUES (p_email, p_password, p_full_name);
    
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

-- Mettre à jour l'admin par défaut avec un mot de passe simple
UPDATE public.admins 
SET password_hash = 'admin123'
WHERE email = 'admin@himpact.com';