
-- Migration pour créer des comptes Auth pour tous les utilisateurs Telegram existants
DO $$
DECLARE
    user_record RECORD;
    new_auth_user_id UUID;
    user_email TEXT;
BEGIN
    -- Parcourir tous les utilisateurs qui n'ont pas encore de compte Auth lié
    FOR user_record IN 
        SELECT telegram_id, pseudo, telegram_username 
        FROM public.users 
        WHERE auth_user_id IS NULL
    LOOP
        -- Créer l'email basé sur telegram_id
        user_email := user_record.telegram_id || '@telegram.local';
        
        -- Créer le compte Auth (simulation de l'appel admin.createUser)
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
            user_email,
            '', -- Mot de passe vide pour magic link
            now(), -- Email confirmé automatiquement
            now(),
            now(),
            jsonb_build_object(
                'telegram_id', user_record.telegram_id,
                'pseudo', user_record.pseudo,
                'provider', 'telegram'
            ),
            false,
            '',
            ''
        ) RETURNING id INTO new_auth_user_id;
        
        -- Lier l'utilisateur Telegram au compte Auth créé
        UPDATE public.users 
        SET auth_user_id = new_auth_user_id 
        WHERE telegram_id = user_record.telegram_id;
        
        RAISE NOTICE 'Compte Auth créé pour utilisateur Telegram ID: %', user_record.telegram_id;
    END LOOP;
END $$;

-- Fonction pour automatiquement créer un compte Auth lors de l'inscription Telegram
CREATE OR REPLACE FUNCTION public.auto_create_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_auth_user_id UUID;
    user_email TEXT;
BEGIN
    -- Seulement si pas de compte Auth déjà lié
    IF NEW.auth_user_id IS NULL THEN
        user_email := NEW.telegram_id || '@telegram.local';
        
        -- Créer le compte Auth automatiquement
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
            user_email,
            '',
            now(),
            now(),
            now(),
            jsonb_build_object(
                'telegram_id', NEW.telegram_id,
                'pseudo', NEW.pseudo,
                'provider', 'telegram'
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

-- Créer le trigger pour automatiser la création future
CREATE TRIGGER auto_create_auth_user_trigger
    BEFORE INSERT ON public.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.auto_create_auth_user();
