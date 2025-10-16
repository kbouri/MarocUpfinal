-- ============================================
-- Script COMPLET pour configurer Supabase Storage
-- À exécuter dans SQL Editor de Supabase
-- ============================================

-- 1. CRÉER LA TABLE CANDIDATURES (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.candidatures (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  nom_startup text NOT NULL,
  nom_fondateurs text NOT NULL,
  email text NOT NULL,
  pitch_court text NOT NULL,
  secteur text NOT NULL,
  pays_residence text NOT NULL,
  lien_prototype text,
  lien_video text,
  informations_complementaires text,
  statut text NOT NULL DEFAULT 'nouvelle'::text,
  pitch_deck_url text,
  business_plan_url text,
  CONSTRAINT candidatures_pkey PRIMARY KEY (id)
);

-- 2. ACTIVER RLS SUR LA TABLE
ALTER TABLE public.candidatures ENABLE ROW LEVEL SECURITY;

-- 3. CRÉER LES POLITIQUES POUR LA TABLE
DROP POLICY IF EXISTS "Allow public insert" ON public.candidatures;
CREATE POLICY "Allow public insert" ON public.candidatures
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.candidatures;
CREATE POLICY "Allow authenticated read" ON public.candidatures
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON public.candidatures;
CREATE POLICY "Allow authenticated update" ON public.candidatures
FOR UPDATE TO authenticated USING (true);

-- 4. SUPPRIMER L'ANCIEN BUCKET S'IL EXISTE
DELETE FROM storage.objects WHERE bucket_id = 'candidatures-files';
DELETE FROM storage.buckets WHERE id = 'candidatures-files';

-- 5. CRÉER LE NOUVEAU BUCKET PUBLIC
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

-- 6. SUPPRIMER TOUTES LES ANCIENNES POLITIQUES STORAGE
DROP POLICY IF EXISTS "Public uploads to candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Public reads from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated updates to candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Public: Upload files to candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Public: Read files from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated: Delete files from candidatures-files" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for public users" ON storage.objects;
DROP POLICY IF EXISTS "Enable read for public users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON storage.objects;

-- 7. CRÉER LES NOUVELLES POLITIQUES STORAGE
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

-- 8. VÉRIFICATION FINALE
SELECT 
  'BUCKET INFO' as info,
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'candidatures-files'

UNION ALL

SELECT 
  'POLICIES COUNT' as info,
  COUNT(*)::text as id,
  '' as name,
  null as public,
  null as file_size_limit,
  null as created_at
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%candidatures-files%';

-- 9. AFFICHER LES POLITIQUES CRÉÉES
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%candidatures-files%'
ORDER BY policyname;


