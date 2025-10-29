-- =====================================================
-- SCHEMA NEON POUR MAROCUP
-- À exécuter dans SQL Editor de Neon
-- =====================================================

-- TABLE 1 : Startups qui postulent au programme
CREATE TABLE IF NOT EXISTS startups_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  nom_startup text NOT NULL,
  nom_fondateurs text NOT NULL,
  email text NOT NULL,
  pitch_court text NOT NULL,
  secteur text NOT NULL,
  pays_residence text NOT NULL,
  lien_prototype text,
  lien_video text,
  pitch_deck_url text NOT NULL,
  business_plan_url text,
  informations_complementaires text,
  statut text NOT NULL DEFAULT 'nouvelle'
);

CREATE INDEX IF NOT EXISTS idx_startups_email ON startups_applications(email);
CREATE INDEX IF NOT EXISTS idx_startups_created ON startups_applications(created_at DESC);

-- TABLE 2 : Invités qui veulent assister à l'événement
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  nom_complet text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  entreprise text,
  poste text,
  secteur_activite text,
  raison_participation text,
  message text,
  statut text NOT NULL DEFAULT 'nouvelle'
);

CREATE INDEX IF NOT EXISTS idx_attendees_email ON event_attendees(email);
CREATE INDEX IF NOT EXISTS idx_attendees_created ON event_attendees(created_at DESC);

-- Vérification
SELECT '✅ Tables créées :' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('startups_applications', 'event_attendees');

