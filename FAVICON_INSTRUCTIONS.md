# 📝 Instructions pour ajouter le favicon (Méthode 3)

## 🎯 Étape 1 : Place ton logo dans `public/`

Ajoute ton fichier logo ici :
```
public/favicon.ico
```

**Formats acceptés :**
- `.ico` (format classique)
- `.png` 
- `.svg`

**Noms possibles :**
- `favicon.ico`
- `icon.png`
- `icon.svg`
- `apple-icon.png` (pour Apple Touch Icon)

## ✅ Étape 2 : Code modifié

J'ai déjà modifié `src/app/layout.tsx` pour référencer le favicon dans `public/`.

Le code ajouté :
```tsx
icons: {
  icon: '/favicon.ico',
  apple: '/favicon.ico',
},
```

## 🚀 Étape 3 : Action à faire

1. **Prends ton logo**
2. **Renomme-le en `favicon.ico`** (ou garde le format original si c'est PNG/SVG)
3. **Place-le dans le dossier `public/`** :
   ```
   public/favicon.ico
   ```
   (Remplace le fichier s'il existe déjà)

4. **Si tu utilises PNG ou SVG**, modifie aussi `src/app/layout.tsx` pour utiliser le bon nom :
   - Pour PNG : `icon: '/icon.png'`
   - Pour SVG : `icon: '/icon.svg'`

## 🔄 Après avoir ajouté le fichier

1. Redémarre le serveur : `npm run dev`
2. Vide le cache du navigateur : Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)
3. Vérifie que l'icône apparaît dans l'onglet du navigateur

## 📐 Tailles recommandées

- **32x32 px** : favicon standard
- **180x180 px** : pour Apple Touch Icon (mobile)
- **512x512 px** : pour PWA

Une fois que tu as ajouté le fichier dans `public/`, dis-moi et je vérifierai que tout fonctionne !

