

-- Corriger les comptes Auth existants pour utiliser Telegram comme provider principal
UPDATE auth.users 
SET 
  email = (raw_user_meta_data->>'telegram_id') || '@telegram.provider',
  raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
    'provider', 'telegram',
    'telegram_auth', true,
    'primary_auth_method', 'telegram'
  ),
  -- Marquer comme confirmé via Telegram
  email_confirmed_at = now(),
  phone_confirmed_at = now()
WHERE raw_user_meta_data->>'provider' = 'telegram';

-- Mettre à jour la fonction de création automatique pour utiliser Telegram comme provider principal
CREATE OR REPLACE FUNCTION public.auto_create_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_auth_user_id UUID;
    telegram_email TEXT;
BEGIN
    -- Seulement si pas de compte Auth déjà lié
    IF NEW.auth_user_id IS NULL THEN
        -- Utiliser un format spécial pour indiquer que c'est un compte Telegram
        telegram_email := NEW.telegram_id || '@telegram.provider';
        
        -- Créer le compte Auth avec Telegram comme provider principal
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            phone_confirmed_at,
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
            telegram_email,
            '',
            now(), -- Confirmé automatiquement via Telegram
            now(), -- Téléphone confirmé via Telegram
            now(),
            now(),
            jsonb_build_object(
                'telegram_id', NEW.telegram_id,
                'pseudo', NEW.pseudo,
                'provider', 'telegram',
                'telegram_auth', true,
                'primary_auth_method', 'telegram',
                'telegram_username', NEW.telegram_username,
                'display_name', NEW.pseudo,
                'full_name', NEW.pseudo
            ),
            false,
            '',
            ''
        ) RETURNING id INTO new_auth_user_id;
        
        -- Assigner l'ID Auth au nouvel utilisateur
        NEW.auth_user_id := new_auth_user_id;
    END IF;
    
    RETURN NEW;
END;
$$;

