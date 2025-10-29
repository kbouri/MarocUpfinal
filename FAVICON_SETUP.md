# 📝 Instructions pour ajouter le favicon MarocUp

## 📍 Où mettre l'image ?

Tu as **2 options** simples :

### ✅ Option 1 : Dans `src/app/` (RECOMMANDÉ pour Next.js)

1. **Convertis ton logo en format `.ico`** ou utilise un `.png`/`.svg`

2. **Place le fichier ici :**
   ```
   src/app/favicon.ico
   ```
   (Remplace le fichier existant si tu utilises `.ico`)

   **OU** pour un PNG/SVG :
   ```
   src/app/icon.png
   ```
   ou
   ```
   src/app/icon.svg
   ```

3. **Next.js détectera automatiquement le favicon !** ✨

### ✅ Option 2 : Dans `public/` (alternative)

1. **Place le fichier ici :**
   ```
   public/favicon.ico
   ```

2. **Modifie `src/app/layout.tsx`** pour ajouter :
   ```tsx
   export const metadata: Metadata = {
     // ... existing metadata ...
     icons: {
       icon: '/favicon.ico',
     },
   };
   ```

## 🎨 Formats supportés

- ✅ `.ico` (format classique)
- ✅ `.png` (recommandé, meilleure qualité)
- ✅ `.svg` (vectoriel, parfait pour tous les écrans)

## 📐 Tailles recommandées

- **Favicon standard :** 32x32 px ou 16x16 px
- **Favicon moderne :** 180x180 px (pour Apple Touch Icon)
- **Pour toutes tailles :** SVG (s'adapte automatiquement)

## 💡 Astuce

Si tu as un PNG, tu peux le nommer `icon.png` dans `src/app/` et Next.js le convertira automatiquement en différents formats pour tous les appareils.

## 🔄 Après avoir ajouté le fichier

1. Redémarre le serveur de dev : `npm run dev`
2. Vérifie dans le navigateur (Ctrl+F5 pour vider le cache)
3. Si ça ne marche pas, vide le cache du navigateur

