
-- Mettre à jour les utilisateurs Auth existants avec les pseudos de la table users
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
    'display_name', u.pseudo,
    'full_name', u.pseudo,
    'provider', 'telegram',
    'telegram_auth', true,
    'primary_auth_method', 'telegram',
    'telegram_username', u.telegram_username
)
FROM public.users u 
WHERE auth.users.raw_user_meta_data->>'telegram_id' = u.telegram_id
  AND auth.users.email LIKE '%@telegram.provider';

-- Aussi mettre à jour les emails pour être sûr qu'ils utilisent le bon format
UPDATE auth.users 
SET email = (raw_user_meta_data->>'telegram_id') || '@telegram.provider'
WHERE raw_user_meta_data->>'telegram_id' IS NOT NULL 
  AND (email LIKE '%@telegram.local' OR email NOT LIKE '%@telegram.provider');
