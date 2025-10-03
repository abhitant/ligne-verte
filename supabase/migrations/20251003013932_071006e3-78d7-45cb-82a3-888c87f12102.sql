-- Supprimer l'ancienne fonction et la recréer avec le pseudo
DROP FUNCTION IF EXISTS public.get_public_reports();

CREATE OR REPLACE FUNCTION public.get_public_reports()
 RETURNS TABLE(
   id uuid, 
   location_lat double precision, 
   location_lng double precision, 
   description text, 
   status text, 
   created_at timestamp with time zone, 
   photo_url text, 
   waste_type text, 
   brand text, 
   reporter_hash text,
   reporter_pseudo text
 )
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT 
    r.id,
    r.location_lat,
    r.location_lng,
    r.description,
    r.status,
    r.created_at,
    r.photo_url,
    r.waste_type,
    r.brand,
    substring(md5(r.user_telegram_id::text), 1, 8) as reporter_hash,
    COALESCE(u.pseudo, 'Anonyme') as reporter_pseudo
  FROM public.reports r
  LEFT JOIN public.users u ON u.telegram_id = r.user_telegram_id
  WHERE r.location_lat IS NOT NULL 
    AND r.location_lng IS NOT NULL
  ORDER BY r.created_at DESC;
$function$;