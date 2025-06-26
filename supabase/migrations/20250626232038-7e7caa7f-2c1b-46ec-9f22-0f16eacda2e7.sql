
-- Désactiver temporairement RLS sur la table reports pour permettre l'accès public aux données
-- Ceci permettra à la carte d'afficher tous les signalements sans authentification
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
