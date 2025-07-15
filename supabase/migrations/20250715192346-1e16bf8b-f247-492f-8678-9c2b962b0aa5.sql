-- Corriger la fonction auto_create_auth_user pour gérer les erreurs de manière plus robuste
CREATE OR REPLACE FUNCTION public.auto_create_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_auth_user_id UUID;
    telegram_email TEXT;
    email_exists BOOLEAN;
BEGIN
    -- Seulement si pas de compte Auth déjà lié
    IF NEW.auth_user_id IS NULL THEN
        -- Utiliser un format spécial pour indiquer que c'est un compte Telegram
        telegram_email := NEW.telegram_id || '@telegram.provider';
        
        -- Vérifier si l'email existe déjà
        SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = telegram_email) INTO email_exists;
        
        -- Si l'email existe déjà, utiliser l'utilisateur existant
        IF email_exists THEN
            SELECT id INTO new_auth_user_id FROM auth.users WHERE email = telegram_email LIMIT 1;
            NEW.auth_user_id := new_auth_user_id;
        ELSE
            -- Créer le compte Auth avec Telegram comme provider principal
            BEGIN
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
            EXCEPTION
                WHEN unique_violation THEN
                    -- En cas de violation de contrainte unique, récupérer l'utilisateur existant
                    SELECT id INTO new_auth_user_id FROM auth.users WHERE email = telegram_email LIMIT 1;
                    NEW.auth_user_id := new_auth_user_id;
                WHEN OTHERS THEN
                    -- Pour toute autre erreur, continuer sans lier de compte auth
                    -- Cela permet au moins de créer l'utilisateur Telegram
                    RAISE NOTICE 'Erreur lors de la création du compte auth pour %: %', NEW.telegram_id, SQLERRM;
            END;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;