-- ============================================
-- Script pour ajouter UNIQUEMENT les politiques RLS
-- À exécuter dans SQL Editor de Supabase
-- ============================================

-- 1. SUPPRIMER TOUTES LES ANCIENNES POLITIQUES (nettoyage)
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

-- 2. CRÉER LES NOUVELLES POLITIQUES (PROPRES)

-- Politique 1 : Permettre les uploads publics
CREATE POLICY "Enable insert for public users"
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'candidatures-files');

-- Politique 2 : Permettre la lecture publique
CREATE POLICY "Enable read for public users"
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'candidatures-files');

-- Politique 3 : Permettre la mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Enable update for authenticated users"
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'candidatures-files');

-- Politique 4 : Permettre la suppression pour les utilisateurs authentifiés
CREATE POLICY "Enable delete for authenticated users"
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'candidatures-files');

-- 3. VÉRIFICATION - Afficher toutes les politiques créées
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;

-- 4. VÉRIFIER que le bucket est bien PUBLIC
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'candidatures-files';



