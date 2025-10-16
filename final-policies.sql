-- ============================================
-- Script FINAL pour ajouter les politiques RLS
-- À exécuter dans SQL Editor de Supabase
-- ============================================

-- SUPPRIMER TOUTES LES ANCIENNES POLITIQUES
DROP POLICY IF EXISTS "Enable insert for public users" ON storage.objects;
DROP POLICY IF EXISTS "Enable read for public users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Public upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete" ON storage.objects;
DROP POLICY IF EXISTS "Public: Upload files to candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Public: Read files from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated: Delete files from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from candidatures-files" ON storage.objects;

-- CRÉER LES POLITIQUES FINALES
CREATE POLICY "Public uploads to candidatures-files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'candidatures-files');

CREATE POLICY "Public reads from candidatures-files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'candidatures-files');

CREATE POLICY "Authenticated updates to candidatures-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'candidatures-files');

CREATE POLICY "Authenticated deletes from candidatures-files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'candidatures-files');

-- VÉRIFICATION FINALE
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%candidatures-files%'
ORDER BY policyname;


