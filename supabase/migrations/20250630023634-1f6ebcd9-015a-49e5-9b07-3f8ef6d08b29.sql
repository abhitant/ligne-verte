
-- Créer un bucket de stockage pour les photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-photos', 'report-photos', true);

-- Créer une politique pour permettre l'upload des photos
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'report-photos');

-- Créer une politique pour permettre la lecture publique des photos
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'report-photos');

-- Créer une politique pour permettre la suppression par les propriétaires
CREATE POLICY "Allow delete for owners" ON storage.objects
FOR DELETE USING (bucket_id = 'report-photos');
