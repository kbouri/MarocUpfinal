-- =====================================================
-- SCHEMA SUPABASE POUR MAROCUP
-- =====================================================
-- À exécuter dans l'onglet SQL Editor de Supabase
-- =====================================================

-- 1. Supprimer l'ancienne table si elle existe (ATTENTION: supprime toutes les données)
DROP TABLE IF EXISTS public.candidatures CASCADE;

-- 2. Créer la nouvelle table candidatures
CREATE TABLE public.candidatures (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  
  -- Informations de base
  nom_startup text NOT NULL,
  nom_fondateurs text NOT NULL,
  email text NOT NULL,
  
  -- Détails de la startup
  pitch_court text NOT NULL,
  secteur text NOT NULL,
  pays_residence text NOT NULL,
  
  -- Liens optionnels
  lien_prototype text,
  lien_video text,
  
  -- Fichiers (URLs vers Storage)
  pitch_deck_url text NOT NULL,
  business_plan_url text,
  
  -- Informations complémentaires
  informations_complementaires text,
  
  -- Statut de la candidature
  statut text NOT NULL DEFAULT 'nouvelle'::text,
  
  -- Clé primaire
  CONSTRAINT candidatures_pkey PRIMARY KEY (id),
  
  -- Contrainte pour vérifier que l'email est valide
  CONSTRAINT candidatures_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- 3. Créer un index sur l'email pour recherche rapide
CREATE INDEX IF NOT EXISTS candidatures_email_idx ON public.candidatures(email);

-- 4. Créer un index sur created_at pour tri par date
CREATE INDEX IF NOT EXISTS candidatures_created_at_idx ON public.candidatures(created_at DESC);

-- 5. Activer Row Level Security (RLS)
ALTER TABLE public.candidatures ENABLE ROW LEVEL SECURITY;

-- 6. Politique RLS : Permettre l'insertion pour tout le monde (formulaire public)
CREATE POLICY "Allow public insert"
ON public.candidatures
FOR INSERT
TO public
WITH CHECK (true);

-- 7. Politique RLS : Permettre la lecture uniquement pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated read"
ON public.candidatures
FOR SELECT
TO authenticated
USING (true);

-- 8. Politique RLS : Permettre la mise à jour uniquement pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated update"
ON public.candidatures
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- CONFIGURATION STORAGE
-- =====================================================
-- NOTE: Les buckets doivent être créés via l'interface Supabase
-- Allez dans Storage > New bucket > Nom: "candidatures-files"
-- =====================================================

-- Politique Storage : Permettre l'upload public dans le bucket candidatures-files
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidatures-files', 'candidatures-files', true)
ON CONFLICT (id) DO NOTHING;

-- Permettre l'upload pour tous dans candidatures-files
CREATE POLICY "Allow public uploads to candidatures-files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'candidatures-files');

-- Permettre la lecture publique des fichiers
CREATE POLICY "Allow public read from candidatures-files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'candidatures-files');

-- Permettre la suppression pour les utilisateurs authentifiés seulement
CREATE POLICY "Allow authenticated delete from candidatures-files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'candidatures-files');

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Vérifier que la table existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'candidatures';

-- Vérifier les colonnes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'candidatures'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'candidatures';

-- Vérifier le bucket Storage
SELECT * FROM storage.buckets WHERE id = 'candidatures-files';

-- Vérifier les politiques Storage
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%candidatures-files%';

