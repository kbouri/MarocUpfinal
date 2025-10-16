# 🎯 Instructions Finales pour Résoudre le Problème

## 🔍 Problème Identifié
Votre bucket s'appelle `candidaturefiles` (sans tiret), mais l'application cherche `candidatures-files` (avec tiret).

---

## ✅ Solution en 3 Étapes

### **Étape 1 : Supprimer l'ancien bucket**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **Storage** (menu de gauche)
4. Trouvez le bucket `candidaturefiles`
5. Cliquez sur les **3 points (•••)** à droite
6. Cliquez sur **"Delete bucket"**
7. Confirmez la suppression

---

### **Étape 2 : Créer le bucket avec le bon nom**

#### **Via l'interface (Simple)**

1. Dans Storage, cliquez sur **"New bucket"**
2. Configurez :
   - **Name** : `candidatures-files` ⚠️ EXACTEMENT comme ça, avec le tiret !
   - **Public bucket** : ✅ **COCHEZ CETTE CASE** (très important !)
   - **File size limit** : 10 MB (ou plus)
3. Cliquez sur **"Create bucket"**

#### **Via SQL (Recommandé pour tout configurer d'un coup)**

1. Allez dans **SQL Editor** (menu de gauche)
2. Cliquez sur **"New query"**
3. Copiez et collez ce script :

```sql
-- Créer le bucket PUBLIC
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'candidatures-files',
  'candidatures-files',
  true,  -- PUBLIC
  10485760  -- 10MB
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- Politiques de sécurité
DROP POLICY IF EXISTS "Public upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete" ON storage.objects;

CREATE POLICY "Public upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'candidatures-files');

CREATE POLICY "Public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'candidatures-files');

CREATE POLICY "Admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'candidatures-files');
```

4. Cliquez sur **"Run"** (ou Ctrl/Cmd + Enter)
5. Vous devriez voir : ✅ "Success"

---

### **Étape 3 : Vérifier**

1. Retournez dans **Storage**
2. Vous devriez voir : `📁 candidatures-files [Public]`
3. Allez sur http://localhost:3000/apply
4. Remplissez le formulaire et uploadez un pitch deck
5. Cliquez sur "Soumettre la candidature"

✅ **Ça devrait fonctionner !**

---

## 🧪 Test Final

Une fois le bucket créé avec le bon nom, retestez avec l'outil `test-supabase.html` :

1. Ouvrez `test-supabase.html` dans votre navigateur
2. Entrez vos clés Supabase
3. Cliquez sur "2️⃣ Lister tous les Buckets"
   - Vous devriez voir : `candidatures-files [Public]`
4. Cliquez sur "4️⃣ Tester l'Upload"
   - Sélectionnez un PDF de test
   - Vous devriez voir : ✅ "Upload réussi !"

---

## 📝 Récapitulatif

- ❌ **Ancien nom** : `candidaturefiles` (incorrect)
- ✅ **Nouveau nom** : `candidatures-files` (correct, avec tiret)
- ✅ **Public** : Oui (obligatoire)
- ✅ **Politiques RLS** : Configurées automatiquement par le script SQL

---

## 🆘 Si ça ne marche toujours pas

Envoyez-moi une capture d'écran de :
1. La page Storage de Supabase (montrant le bucket)
2. L'erreur dans la console de votre navigateur (F12)

---

**🎉 Bon courage ! Vous êtes presque au bout !**



