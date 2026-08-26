CREATE TABLE public.challenge_requests (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  zone text,
  description text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

GRANT INSERT ON public.challenge_requests TO anon;
GRANT INSERT ON public.challenge_requests TO authenticated;
GRANT ALL ON public.challenge_requests TO service_role;

ALTER TABLE public.challenge_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a challenge request"
ON public.challenge_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view challenge requests"
ON public.challenge_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update challenge requests"
ON public.challenge_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT, UPDATE ON public.challenge_requests TO authenticated;