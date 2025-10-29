# ✅ Checklist Configuration Vercel

## ⚠️ IMPORTANT : Vérifications à faire

### 1. Toutes les variables doivent avoir les 3 environnements cochés :
- ✅ **Production** (pour marocup.pro)
- ✅ **Preview** 
- ✅ **Development**

### 2. Noms exacts des variables (sensible à la casse) :
```
CLOUDINARY_CLOUD_NAME
开CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
DATABASE_URL
```

### 3. Valeurs exactes à copier :

**CLOUDINARY_CLOUD_NAME:**
```
dvwmz9puj
```

**CLOUDINARY_API_KEY:**
```
541725366943753
```

**CLOUDINARY_API_SECRET:**
```
8KFcKLxpMfHlpMjDiJ2ZamScnt0
```

**DATABASE_URL:**
```
postgresql://neondb_owner:npg_G4njvl7dHISV@ep-sweet-recipe-adihih03-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 4. Après avoir ajouté/modifié les variables :
1. Clique sur **Save** pour chaque variable
2. Va dans **Deployments**
3. Trouve le dernier déploiement
4. Cl漆黑 sur les **...** (trois points)
5. Clique sur **Redeploy** ou **Redeploy with existing Build Cache**
6. Attends la fin du déplOilment (~2 minutes)

### 5. Vérification dans les logs :
- Va dans le déploiement terminé
- Clique sur **View Function Logs** ou **Runtime Logs**
- Recherche "Variables Cloudinary manquantes" pour voir ce qui manque

## 🔍 Si ça ne fonctionne toujours pas :

1. Supprime toutes les variables Cloudinary existantes
2. Recrée-les une par une avec les noms EXACTS (copie-colle)
3. Vérifie qu'il n'y a pas d'espaces avant/après les valeurs
4. Fais un **Redeploy** complet

