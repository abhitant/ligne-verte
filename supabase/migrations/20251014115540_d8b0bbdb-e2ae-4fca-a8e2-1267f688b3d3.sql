-- Créer une politique de lecture publique pour la table users
-- Cela permet à n'importe qui (avec la clé anon) de lire toutes les données users

CREATE POLICY "Public can read all users"
ON public.users
FOR SELECT
TO anon, authenticated
USING (true);