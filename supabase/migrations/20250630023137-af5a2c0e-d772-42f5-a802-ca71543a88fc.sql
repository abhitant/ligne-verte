
-- Désactiver temporairement RLS sur la table users pour permettre l'accès aux données utilisateur
-- Ceci permettra à la carte d'afficher les pseudos des utilisateurs
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
