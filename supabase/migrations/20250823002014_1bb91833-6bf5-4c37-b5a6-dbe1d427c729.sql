-- Fonction pour mettre à jour les informations de l'admin
CREATE OR REPLACE FUNCTION public.update_admin_credentials(
  p_admin_id uuid,
  p_new_email text DEFAULT NULL,
  p_new_password text DEFAULT NULL,
  p_new_full_name text DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
DECLARE
  result json;
  admin_record public.admins;
BEGIN
  -- Vérifier que l'admin existe
  SELECT * INTO admin_record
  FROM public.admins 
  WHERE id = p_admin_id AND is_active = true;
  
  IF admin_record.id IS NULL THEN
    result := json_build_object('success', false, 'error', 'Administrateur non trouvé');
    RETURN result;
  END IF;
  
  -- Mettre à jour les informations fournies
  UPDATE public.admins 
  SET 
    email = COALESCE(p_new_email, email),
    password_hash = COALESCE(p_new_password, password_hash),
    full_name = COALESCE(p_new_full_name, full_name),
    updated_at = now()
  WHERE id = p_admin_id;
  
  result := json_build_object(
    'success', true,
    'message', 'Informations mises à jour avec succès'
  );
  
  RETURN result;
END;
$$;