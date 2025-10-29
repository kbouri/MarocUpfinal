# 🔐 Configuration des Variables d'Environnement Vercel

Pour que le site fonctionne correctement sur Vercel, tu dois ajouter ces variables d'environnement dans le dashboard Vercel.

## 📋 Variables à Configurer

illes Environnement** :
- **Production** ✅
- **Preview** ✅  
- **Development** ✅

### 1. Cloudinary Configuration

```
CLOUDINARY_CLOUD_NAME=dvwmz9puj
CLOUDINARY_API_KEY=541725366943753
CLOUDINARY_API_SECRET=8KFcKLxpMfHlpMjDiJ2ZamScnt0
```

### 2. Base de Données Neon

```
DATABASE_URL=postgresql://neondb_owner:npg_G4njvl7dHISV@ep-sweet-recipe-adihih03-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 🚀 Étapes dans Vercel

1. Va sur https://vercel.com
2. Sélectionne ton projet **MarocUp**
3. Clique sur **Settings** → **Environment Variables**
4. Ajoute chaque variable une par une avec ces valeurs
5. Coche **Production**, **Preview** et **Development** pour chaque variable
6. Clique sur **Save**
7. **Important** : Va dans **Deployments** → Clique sur **...** → **Redeploy** pour appliquer les changements

## ✅ Vérification

Après le redeploy, teste le formulaire :
- Si ça fonctionne : ✅ Les variables sont bien configurées
- Si erreur "Must supply api_key" : Vérifie que toutes les variables sont bien ajoutées et que tu as fait un **Redeploy**

