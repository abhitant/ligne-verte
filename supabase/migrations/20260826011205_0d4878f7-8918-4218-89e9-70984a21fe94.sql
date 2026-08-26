CREATE TABLE public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  organization_name text not null,
  organization_logo_url text,
  category text,
  bonus_points integer not null default 50,
  target_reports integer,
  zone text,
  image_url text,
  cta_url text,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.challenges TO anon;
GRANT SELECT ON public.challenges TO authenticated;
GRANT ALL ON public.challenges TO service_role;

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published challenges"
ON public.challenges FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage challenges"
ON public.challenges FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_challenges_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER challenges_updated_at
BEFORE UPDATE ON public.challenges
FOR EACH ROW EXECUTE FUNCTION public.update_challenges_updated_at();

INSERT INTO public.challenges (title, description, organization_name, category, bonus_points, target_reports, zone, ends_at)
VALUES
('Opération caniveaux propres', 'Signale les caniveaux bouchés de ton quartier. Chaque signalement validé pendant le défi rapporte des points Himpact bonus.', 'Mairie de Cocody', 'Eaux & assainissement', 50, 200, 'Cocody', now() + interval '21 days'),
('Zéro dépôt sauvage', 'Traque les dépôts sauvages autour des marchés. Photo + position, Débora fait le reste.', 'ONG Abidjan Propre', 'Déchets & dépôts', 75, 300, 'Abobo', now() + interval '30 days'),
('Quartier éclairé, quartier sûr', 'Recense les lampadaires éteints de ta zone pour accélérer les réparations.', 'CIE Communauté', 'Éclairage public', 40, 150, 'Yopougon', now() + interval '45 days');