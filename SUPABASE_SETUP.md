# 🚀 Configuration Supabase pour MarocUp - Guide Complet

## 📌 Vue d'ensemble

Ce guide vous aide à configurer Supabase pour que le formulaire de candidature MarocUp fonctionne parfaitement.

---

## ⚡ Configuration Rapide (5 minutes)

### Étape 1 : Exécuter le script SQL

1. **Ouvrez votre dashboard Supabase** : https://supabase.com/dashboard
2. Sélectionnez votre projet MarocUp
3. Cliquez sur **"SQL Editor"** dans le menu de gauche (icône </> )
4. Cliquez sur **"New query"**
5. **Copiez TOUT le contenu** du fichier `supabase-schema.sql`
6. **Collez-le** dans l'éditeur SQL
7. Cliquez sur **"Run"** (ou Ctrl/Cmd + Enter)

✅ **Résultat attendu** : "Success. No rows returned"

---

### Étape 2 : Vérifier que tout fonctionne

1. **Vérifier la table** :
   - Allez dans **"Table Editor"** (menu de gauche)
   - Vous devriez voir la table `candidatures` avec toutes les colonnes

2. **Vérifier le Storage** :
   - Allez dans **"Storage"** (menu de gauche)
   - Vous devriez voir le bucket `candidatures-files`
   - Il doit être marqué comme **"Public"**

3. **Vérifier les permissions** :
   - Dans Storage, cliquez sur `candidatures-files`
   - Onglet **"Policies"**
   - Vous devriez voir les 3 politiques :
     - "Allow public uploads to candidatures-files"
     - "Allow public read from candidatures-files"
     - "Allow authenticated delete from candidatures-files"

---

### Étape 3 : Tester le formulaire

1. Allez sur http://localhost:3000/apply
2. Remplissez le formulaire
3. Uploadez un pitch deck (PDF)
4. Soumettez
5. ✅ Vous devriez voir "Votre candidature a été envoyée avec succès !"

---

## 🗂️ Structure de la base de données

### Table : `candidatures`

| Colonne | Type | Obligatoire | Description |
|---------|------|-------------|-------------|
| `id` | uuid | ✅ Auto | Identifiant unique |
| `created_at` | timestamp | ✅ Auto | Date de création |
| `nom_startup` | text | ✅ | Nom de la startup |
| `nom_fondateurs` | text | ✅ | Nom(s) des fondateurs |
| `email` | text | ✅ | Email de contact |
| `pitch_court` | text | ✅ | Description courte (max 500 car.) |
| `secteur` | text | ✅ | Secteur d'activité |
| `pays_residence` | text | ✅ | Pays de résidence |
| `lien_prototype` | text | ❌ | Lien vers prototype/démo |
| `lien_video` | text | ❌ | Lien vidéo |
| `pitch_deck_url` | text | ✅ | URL du pitch deck dans Storage |
| `business_plan_url` | text | ❌ | URL du business plan dans Storage |
| `informations_complementaires` | text | ❌ | Infos supplémentaires |
| `statut` | text | ✅ Auto | Statut (nouvelle/en_cours/acceptée/refusée) |

---

## 📁 Structure du Storage

### Bucket : `candidatures-files` (Public)

**Organisation des fichiers :**
```
candidatures-files/
├── pitch-decks/
│   ├── startup_name_1234567890.pdf
│   ├── another_startup_1234567891.pdf
│   └── ...
└── business-plans/
    ├── startup_name_1234567890.xlsx
    ├── another_startup_1234567891.pdf
    └── ...
```

**Formats acceptés :**
- **Pitch Deck** : PDF uniquement
- **Business Plan** : PDF, Excel (.xls, .xlsx), Word (.doc, .docx)

**Taille max** : 10MB par fichier

---

## 🔐 Permissions RLS configurées

### Table `candidatures`

1. ✅ **INSERT (public)** : Tout le monde peut soumettre une candidature
2. ✅ **SELECT (authenticated)** : Seuls les admins connectés peuvent voir les candidatures
3. ✅ **UPDATE (authenticated)** : Seuls les admins peuvent modifier le statut

### Storage `candidatures-files`

1. ✅ **INSERT (public)** : Tout le monde peut uploader des fichiers
2. ✅ **SELECT (public)** : Les fichiers sont accessibles publiquement via URL
3. ✅ **DELETE (authenticated)** : Seuls les admins peuvent supprimer des fichiers

---

## 🛠️ Dépannage

### Problème : "Bucket not found"
**Solution** : Le bucket n'existe pas
- Exécutez le script SQL complet
- OU créez manuellement : Storage > New bucket > `candidatures-files`

### Problème : "new row violates row-level security policy"
**Solution** : Les politiques RLS ne sont pas configurées
- Exécutez la section RLS du script SQL
- Vérifiez dans Table Editor > candidatures > Policies

### Problème : "Load failed" ou erreur réseau
**Solution** : Vérifiez vos variables d'environnement
- Ouvrez `.env.local`
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects
- Redémarrez le serveur : `npm run dev`

### Problème : Fichier trop volumineux
**Solution** : Augmentez la limite dans Storage
- Allez dans Storage > candidatures-files > Settings
- Modifiez "File size limit" (par défaut 50MB)

---

## 📊 Voir les candidatures reçues

### Via Supabase Dashboard :
1. Allez dans **"Table Editor"**
2. Cliquez sur `candidatures`
3. Vous verrez toutes les candidatures avec leurs informations
4. Cliquez sur `pitch_deck_url` pour télécharger les pitch decks

### Via SQL :
```sql
-- Voir toutes les candidatures
SELECT * FROM candidatures ORDER BY created_at DESC;

-- Voir uniquement les nouvelles candidatures
SELECT * FROM candidatures WHERE statut = 'nouvelle';

-- Compter les candidatures par secteur
SELECT secteur, COUNT(*) 
FROM candidatures 
GROUP BY secteur 
ORDER BY COUNT(*) DESC;
```

---

## 🎯 Prochaines étapes

Une fois Supabase configuré :

1. ✅ Testez le formulaire sur http://localhost:3000/apply
2. ✅ Vérifiez que les fichiers apparaissent dans Storage
3. ✅ Vérifiez que les données apparaissent dans la table
4. 🚀 Déployez sur Vercel pour un site en production !

---

## 💡 Conseils

- **Backups** : Configurez des backups automatiques dans Supabase (Settings > Database > Backups)
- **Monitoring** : Activez les logs dans Settings > Logs
- **Sécurité** : Ne partagez JAMAIS votre `service_role_key`, seulement `anon_key`
- **Production** : Testez d'abord en local avant de déployer

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Supabase Dashboard > Logs
2. Vérifiez la console du navigateur (F12) pour les erreurs JavaScript
3. Consultez la documentation Supabase : https://supabase.com/docs

---

**Créé pour MarocUp 2025** 🇲🇦
