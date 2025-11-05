-- Supprimer l'ancienne fonction get_public_reports
DROP FUNCTION IF EXISTS get_public_reports();

-- Créer la fonction get_public_reports avec la structure correcte
CREATE OR REPLACE FUNCTION get_public_reports()
RETURNS TABLE (
  id UUID,
  user_telegram_id TEXT,
  reporter_pseudo TEXT,
  photo_url TEXT,
  description TEXT,
  waste_type TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  status TEXT,
  created_at TIMESTAMPTZ,
  points_awarded INTEGER
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.user_telegram_id,
    COALESCE(u.pseudo, 'Anonyme') as reporter_pseudo,
    r.photo_url,
    r.description,
    r.waste_type,
    r.location_lat,
    r.location_lng,
    r.status,
    r.created_at,
    r.points_awarded
  FROM reports r
  LEFT JOIN users u ON r.user_telegram_id = u.telegram_id
  ORDER BY r.created_at DESC;
END;
$$;

-- Permettre l'accès public à cette fonction
GRANT EXECUTE ON FUNCTION get_public_reports() TO anon, authenticated;