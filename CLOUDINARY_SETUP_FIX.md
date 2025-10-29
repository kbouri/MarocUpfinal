# 🔧 Configuration Cloudinary pour résoudre le problème d'upload Pitch Deck

## 📋 Étapes à suivre dans le Dashboard Cloudinary

### 1. Vérifier les paramètres de sécurité

1. **Connecte-toi à Cloudinary** : https://console.cloudinary.com
2. Va dans **Settings** (⚙️) → **Security**
3. Vérifie ces paramètres :

#### a) **Allowed file types**
   - Assure-toi que **"Raw files"** est autorisé
   - Si tu vois des restrictions, ajoute :
     - `pdf`
     - `xlsx`, `xls` (pour Excel)
     - Ou coche **"Allow all file types"** temporairement pour tester

#### b) **Restricted media types**
   - **Ne doit pas bloquer** les fichiers raw/PDF
   - Si c'est le cas, retire les restrictions

#### c) **Delivery**
   - Va dans **Settings** → **Upload**
   - Vérifie **"Upload presets"**
   - Assure-toi qu'il n'y a pas de restrictions sur :
     - Taille de fichier
     - Types de fichiers
     - Folders

### 2. Vérifier les limites de taille

1. Va dans **Settings** → **Usage**
2. Vérifie les limites :
   - **Plan gratuit** : généralement 10-20MB max par fichier
   - **Plan payant** : jusqu'à 100MB+
3. Si ton PDF fait plus de 10MB et que tu es sur le plan gratuit, c'est peut-être ça le problème

### 3. Vérifier la Media Library

1. Va dans **Media Library**
2. Regarde si le fichier pitch deck est uploadé mais non accessible
3. Si tu vois le fichier avec une erreur, clique dessus pour voir les détails

### 4. Créer un Upload Preset (Recommandé)

1. Va dans **Settings** → **Upload** → **Upload presets**
2. Clique sur **"Add upload preset"**
3. Configure :
   - **Preset name** : `marocup-public-raw`
   - **Signing mode** : `Unsigned` (pour simplifier) OU `Signed` (plus sécurisé)
   - **Resource type** : `Raw`
   - **Access mode** : `Public`
   - **Folder** : `marocup-uploads`
   - **Allowed formats** : Laisse vide ou ajoute `pdf,xlsx,docx`
4. Sauvegarde

## 🧪 Test rapide

Pour tester si c'est un problème Cloudinary vs code :

1. Va dans **Media Library** → **Upload**
2. Upload manuellement un PDF (même celui qui ne fonctionne pas)
3. Si l'upload manuel fonctionne, le problème vient du code
4. Si l'upload manuel échoue, c'est un problème de configuration Cloudinary

## 📝 Ce qu'il faut vérifier

- ✅ **Plan Cloudinary** : Quelle est la limite de taille ?
- ✅ **Paramètres de sécurité** : Les PDFs sont-ils autorisés ?
- ✅ **Media Library** : Le fichier est-il uploadé mais non accessible ?
- ✅ **Upload presets** : Y a-t-il des restrictions ?

## 🔍 Logs à vérifier

Dans la console du navigateur, quand tu uploades le pitch deck :
- Quelle est l'erreur exacte ?
- Est-ce que la signature est générée ?
- Est-ce que l'upload démarre ?

---

**Marque ce qui bloque et on pourra corriger ensemble !**

