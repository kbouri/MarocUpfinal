-- ============================================
-- Script pour créer le bucket candidatures-files
-- À exécuter dans SQL Editor de Supabase
-- ============================================

-- 1. SUPPRIMER L'ANCIEN BUCKET S'IL EXISTE (et tous ses fichiers)
DELETE FROM storage.objects WHERE bucket_id = 'candidatures-files';
DELETE FROM storage.buckets WHERE id = 'candidatures-files';

-- 2. CRÉER LE NOUVEAU BUCKET (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'candidatures-files',
  'candidatures-files',
  true,  -- PUBLIC = true (très important !)
  10485760,  -- 10MB en bytes
  ARRAY[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- 3. CRÉER LES POLITIQUES DE SÉCURITÉ

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Public: Upload files to candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Public: Read files from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated: Delete files from candidatures-files" ON storage.objects;

-- Politique 1 : Upload public
CREATE POLICY "Public: Upload files to candidatures-files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'candidatures-files');

-- Politique 2 : Lecture publique
CREATE POLICY "Public: Read files from candidatures-files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'candidatures-files');

-- Politique 3 : Suppression pour admins authentifiés
CREATE POLICY "Authenticated: Delete files from candidatures-files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'candidatures-files');

-- 4. VÉRIFICATION FINALE
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'candidatures-files';

-- Afficher les politiques
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%candidatures-files%'
ORDER BY policyname;

