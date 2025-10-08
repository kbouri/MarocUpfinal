# 🎯 Guide de Configuration Supabase - 3 Étapes Simples

## ✅ Étape 1 : Copier le script SQL (30 secondes)

1. Ouvrez le fichier **`supabase-schema.sql`** dans ce dossier
2. Sélectionnez TOUT le contenu (Cmd/Ctrl + A)
3. Copiez (Cmd/Ctrl + C)

---

## ✅ Étape 2 : Exécuter dans Supabase (2 minutes)

1. **Ouvrez Supabase** : https://supabase.com/dashboard
2. Connectez-vous et sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **"SQL Editor"** (icône </> )
4. Cliquez sur **"+ New query"**
5. **Collez** le script (Cmd/Ctrl + V)
6. Cliquez sur **"Run"** en bas à droite (ou Cmd/Ctrl + Enter)

**✅ Succès** : Vous devriez voir "Success. No rows returned" en vert

**❌ Erreur** : Si vous voyez une erreur, lisez le message. Souvent :
- "already exists" = normal, ignorez
- "permission denied" = vérifiez que vous êtes owner du projet

---

## ✅ Étape 3 : Vérifier que tout fonctionne (1 minute)

### Vérification 1 : Table créée ✓
1. Cliquez sur **"Table Editor"** dans le menu
2. Vous devriez voir **`candidatures`** dans la liste des tables
3. Cliquez dessus pour voir les colonnes

### Vérification 2 : Storage créé ✓
1. Cliquez sur **"Storage"** dans le menu
2. Vous devriez voir le bucket **`candidatures-files`**
3. Il doit avoir un badge **"Public"**

### Vérification 3 : Permissions configurées ✓
1. Dans Table Editor > candidatures
2. Cliquez sur l'icône **🔒 (Policies)** en haut
3. Vous devriez voir 3 politiques :
   - Allow public insert ✅
   - Allow authenticated read ✅
   - Allow authenticated update ✅

---

## 🧪 Test Final : Soumettre une candidature

1. **Assurez-vous que le serveur tourne** :
   ```bash
   npm run dev
   ```

2. **Ouvrez le site** : http://localhost:3000/apply

3. **Remplissez le formulaire** avec des données de test :
   - Nom startup : "Test Startup"
   - Fondateurs : "John Doe"
   - Email : "test@example.com"
   - Pitch : "Test pitch"
   - Secteur : Fintech
   - Pays : Maroc
   - Téléchargez un PDF de test
   - Acceptez les conditions

4. **Cliquez sur "Envoyer ma Candidature"**

5. **✅ Succès attendu** :
   - Message de succès s'affiche
   - Le formulaire se vide

6. **Vérifier dans Supabase** :
   - Table Editor > candidatures : nouvelle ligne apparaît
   - Storage > candidatures-files > pitch-decks : fichier PDF apparaît

---

## 🎉 C'est fait !

Si tout fonctionne :
- ✅ Votre formulaire est opérationnel
- ✅ Les fichiers sont stockés en sécurité
- ✅ Vous pouvez déployer sur Vercel !

---

## ❌ En cas de problème

### Erreur : "Bucket not found"
➡️ **Solution** : Le script SQL n'a pas créé le bucket automatiquement
- Allez dans Storage
- Cliquez sur "New bucket"
- Nom : `candidatures-files`
- Cochez "Public bucket"
- Create bucket

### Erreur : "new row violates row-level security policy"
➡️ **Solution** : Les politiques RLS ne sont pas activées
- Ré-exécutez la section RLS du script SQL (lignes 54-78)

### Erreur : "Load failed"
➡️ **Solution** : Problème de connexion Supabase
1. Vérifiez votre fichier `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
   ```
2. Redémarrez le serveur : 
   ```bash
   pkill -f "next dev"
   npm run dev
   ```

### Erreur : "File size limit exceeded"
➡️ **Solution** : Fichier trop volumineux
- Limite actuelle : 10MB
- Pour augmenter : Storage > candidatures-files > Settings > File size limit

---

## 🔑 Variables d'environnement

Vérifiez que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Pour trouver ces valeurs dans Supabase :
1. Dashboard > Settings (⚙️)
2. API
3. Copiez "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
4. Copiez "anon public" → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **IMPORTANT** : Ne commitez JAMAIS le fichier `.env.local` sur GitHub !

---

## 📈 Après la configuration

### Consulter les candidatures

**Via Dashboard Supabase :**
1. Table Editor > candidatures
2. Vous verrez toutes les soumissions
3. Cliquez sur les URLs pour télécharger les fichiers

**Colonnes importantes :**
- `statut` : nouvelle / en_cours / acceptée / refusée
- `created_at` : Date de soumission
- `pitch_deck_url` : Lien vers le PDF

### Gérer les statuts

Pour changer le statut d'une candidature :
1. Table Editor > candidatures
2. Double-cliquez sur la cellule `statut`
3. Changez : nouvelle → acceptée/refusée
4. Les startups pourront être notifiées selon le statut

---

## 🚀 Déploiement sur Vercel

Une fois que tout fonctionne en local :

1. Commitez et poussez sur GitHub
2. Allez sur https://vercel.com
3. Connectez votre GitHub
4. Importez le repository `MarocUp-final-`
5. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Cliquez sur "Deploy"
7. En 2 minutes, votre site est en ligne ! 🎉

**URL de production** : `https://marocup-nextjs.vercel.app` (ou autre)

---

## 📞 Besoin d'aide ?

- 📖 Documentation Supabase : https://supabase.com/docs
- 💬 Discord Supabase : https://discord.supabase.com
- 🎥 Tutoriels : https://www.youtube.com/c/Supabase

---

**Bon courage ! 🇲🇦 MarocUp 2025**

