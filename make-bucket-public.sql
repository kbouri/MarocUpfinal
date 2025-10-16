-- ============================================
-- Script pour rendre le bucket PUBLIC
-- À exécuter dans SQL Editor de Supabase
-- ============================================

-- RENDRE LE BUCKET PUBLIC
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 10485760  -- 10MB
WHERE id = 'candidatures-files';

-- VÉRIFICATION
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'candidatures-files';

-- Si le bucket n'existe pas encore, le créer
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'candidatures-files',
  'candidatures-files',
  true,  -- PUBLIC = true
  10485760  -- 10MB
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- VÉRIFICATION FINALE
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'candidatures-files';


