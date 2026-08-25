-- 1. ADMINS: remove fully public policy
DROP POLICY IF EXISTS "Allow admin access" ON public.admins;
REVOKE ALL ON public.admins FROM anon, authenticated;
GRANT ALL ON public.admins TO service_role;

-- 2. PENDING_REPORTS: backend only
DROP POLICY IF EXISTS "Backend can delete pending reports" ON public.pending_reports;
DROP POLICY IF EXISTS "Backend can insert pending reports" ON public.pending_reports;
DROP POLICY IF EXISTS "Backend can read pending reports" ON public.pending_reports;
DROP POLICY IF EXISTS "Backend can update pending reports" ON public.pending_reports;
REVOKE ALL ON public.pending_reports FROM anon, authenticated;
GRANT ALL ON public.pending_reports TO service_role;

-- 3. REPORTS: no public read/insert, expose sanitized view instead (pseudo kept)
DROP POLICY IF EXISTS "Public can view all reports" ON public.reports;
DROP POLICY IF EXISTS "Backend can insert reports" ON public.reports;
REVOKE INSERT, UPDATE, DELETE ON public.reports FROM anon;
REVOKE INSERT, DELETE ON public.reports FROM authenticated;
GRANT ALL ON public.reports TO service_role;

DROP VIEW IF EXISTS public.reports_public;
CREATE VIEW public.reports_public AS
SELECT
  r.id,
  ('agent-' || left(md5(r.user_telegram_id), 6)) AS reporter_ref,
  COALESCE(u.pseudo, 'Anonyme') AS reporter_pseudo,
  r.photo_url,
  r.description,
  r.location_lat,
  r.location_lng,
  r.status,
  r.created_at,
  r.waste_type,
  r.waste_category,
  r.disposal_instructions,
  r.brand,
  r.severity_level,
  r.is_cleaned,
  r.cleanup_photo_url,
  r.points_awarded
FROM public.reports r
LEFT JOIN public.users u ON u.telegram_id = r.user_telegram_id;

GRANT SELECT ON public.reports_public TO anon, authenticated, service_role;

-- 4. USERS: remove public read
DROP POLICY IF EXISTS "Public can read all users" ON public.users;
REVOKE ALL ON public.users FROM anon;

-- 5. SUGGESTIONS: real admin scoping
DROP POLICY IF EXISTS "Admins can view all suggestions" ON public.suggestions;
DROP POLICY IF EXISTS "Admins can update suggestions" ON public.suggestions;
CREATE POLICY "Admins can view all suggestions"
  ON public.suggestions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update suggestions"
  ON public.suggestions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. USER_ACHIEVEMENTS: no client-side inserts
DROP POLICY IF EXISTS "Backend can insert user achievements" ON public.user_achievements;
REVOKE INSERT, UPDATE, DELETE ON public.user_achievements FROM anon, authenticated;
GRANT ALL ON public.user_achievements TO service_role;

-- 7. USER_ROLES: only own roles
DROP POLICY IF EXISTS "Authenticated users can check admin roles" ON public.user_roles;

-- 8. STORAGE: restrict insert/delete on report-photos
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete for owners" ON storage.objects;
CREATE POLICY "report_photos_authenticated_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'report-photos');
CREATE POLICY "report_photos_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'report-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 9. Public read helpers become SECURITY INVOKER over the sanitized view
CREATE OR REPLACE FUNCTION public.get_public_reports()
 RETURNS TABLE(id uuid, user_telegram_id text, reporter_pseudo text, photo_url text, description text, waste_type text, location_lat double precision, location_lng double precision, status text, created_at timestamp with time zone, points_awarded integer)
 LANGUAGE sql
 STABLE SECURITY INVOKER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
  SELECT
    v.id,
    v.reporter_ref AS user_telegram_id,
    v.reporter_pseudo,
    v.photo_url,
    v.description,
    v.waste_type,
    v.location_lat,
    v.location_lng,
    v.status,
    v.created_at,
    v.points_awarded
  FROM public.reports_public v
  ORDER BY v.created_at DESC;
$function$;

CREATE OR REPLACE FUNCTION public.get_report_locations()
 RETURNS TABLE(id uuid, location_lat double precision, location_lng double precision)
 LANGUAGE sql
 STABLE SECURITY INVOKER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
  SELECT
    v.id,
    round(v.location_lat::numeric, 3)::double precision,
    round(v.location_lng::numeric, 3)::double precision
  FROM public.reports_public v
  WHERE v.location_lat IS NOT NULL AND v.location_lng IS NOT NULL;
$function$;

-- 10. Pin search_path on every public function and lock down SECURITY DEFINER execution
DO $$
DECLARE
  f record;
BEGIN
  FOR f IN
    SELECT p.oid,
           p.prosecdef,
           p.proconfig,
           format('public.%I(%s)', p.proname, pg_get_function_identity_arguments(p.oid)) AS sig,
           p.proname
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = 'public'
  LOOP
    IF f.proconfig IS NULL OR NOT EXISTS (
      SELECT 1 FROM unnest(f.proconfig) c WHERE c LIKE 'search_path=%'
    ) THEN
      EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_catalog', f.sig);
    END IF;

    IF f.prosecdef AND f.proname <> 'has_role' THEN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', f.sig);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f.sig);
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;