
-- Supprimer tous les signalements existants
DELETE FROM public.reports;

-- Supprimer tous les utilisateurs existants
DELETE FROM public.users;

-- Supprimer tous les signalements en attente
DELETE FROM public.pending_reports;
