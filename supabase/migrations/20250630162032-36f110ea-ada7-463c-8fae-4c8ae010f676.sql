
-- Modifier la table users pour ajouter une référence à auth.users
ALTER TABLE public.users 
ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Créer un index pour améliorer les performances
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);

-- Créer une fonction pour créer un utilisateur auth et le lier au compte Telegram
CREATE OR REPLACE FUNCTION public.create_auth_user_for_telegram(
  p_telegram_id TEXT,
  p_email TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_auth_user_id UUID;
  telegram_user public.users;
BEGIN
  -- Récupérer l'utilisateur Telegram
  SELECT * INTO telegram_user 
  FROM public.users 
  WHERE telegram_id = p_telegram_id;
  
  IF telegram_user.telegram_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur Telegram non trouvé';
  END IF;
  
  -- Si l'utilisateur a déjà un compte auth, retourner son ID
  IF telegram_user.auth_user_id IS NOT NULL THEN
    RETURN telegram_user.auth_user_id;
  END IF;
  
  -- Créer un nouvel utilisateur auth avec un email basé sur telegram_id si pas fourni
  IF p_email IS NULL THEN
    p_email := p_telegram_id || '@telegram.local';
  END IF;
  
  -- Insérer dans auth.users (note: ceci nécessite des privilèges spéciaux)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    '', -- Mot de passe vide, l'utilisateur devra se connecter via magic link
    now(), -- Email confirmé automatiquement
    now(),
    now(),
    jsonb_build_object(
      'telegram_id', p_telegram_id,
      'pseudo', telegram_user.pseudo,
      'provider', 'telegram'
    ),
    false,
    '',
    ''
  ) RETURNING id INTO new_auth_user_id;
  
  -- Lier l'utilisateur Telegram au compte auth
  UPDATE public.users 
  SET auth_user_id = new_auth_user_id 
  WHERE telegram_id = p_telegram_id;
  
  RETURN new_auth_user_id;
END;
$$;

-- Fonction pour récupérer un utilisateur par son auth_user_id
CREATE OR REPLACE FUNCTION public.get_user_by_auth_id(
  p_auth_user_id UUID
) RETURNS public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_user public.users;
BEGIN
  SELECT * INTO result_user 
  FROM public.users 
  WHERE auth_user_id = p_auth_user_id;
  
  RETURN result_user;
END;
$$;

-- Trigger pour synchroniser les modifications du pseudo avec auth.users
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Si l'utilisateur a un compte auth lié, mettre à jour les métadonnées
  IF NEW.auth_user_id IS NOT NULL THEN
    UPDATE auth.users 
    SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('pseudo', NEW.pseudo)
    WHERE id = NEW.auth_user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Créer le trigger
CREATE TRIGGER sync_user_metadata_trigger
  AFTER UPDATE OF pseudo ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_metadata();
