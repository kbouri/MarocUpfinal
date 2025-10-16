-- ============================================
-- Script pour nettoyer et recréer les politiques Storage
-- À exécuter dans SQL Editor de Supabase
-- ============================================

-- 1. SUPPRIMER TOUTES LES ANCIENNES POLITIQUES
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from candidatures-files" ON storage.objects;

-- 2. CRÉER LES NOUVELLES POLITIQUES (PROPRES)

-- Politique 1 : Permettre aux utilisateurs publics d'uploader des fichiers
CREATE POLICY "Public: Upload files to candidatures-files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'candidatures-files');

-- Politique 2 : Permettre la lecture publique des fichiers
CREATE POLICY "Public: Read files from candidatures-files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'candidatures-files');

-- Politique 3 : Permettre aux admins authentifiés de supprimer des fichiers
CREATE POLICY "Authenticated: Delete files from candidatures-files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'candidatures-files');

-- 3. VÉRIFICATION
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%candidatures-files%'
ORDER BY policyname;



