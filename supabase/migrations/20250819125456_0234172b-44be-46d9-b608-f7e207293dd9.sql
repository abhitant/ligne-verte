-- Grant SELECT permissions on the reports_public view for anonymous and authenticated users
GRANT SELECT ON public.reports_public TO anon;
GRANT SELECT ON public.reports_public TO authenticated;