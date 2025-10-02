# MarocUp Next.js Website

Site web officiel de MarocUp - Inspirer, Connecter, Innover

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
Créer un fichier `.env.local` avec :
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

## Structure du projet

- `/src/app/` - Pages Next.js (App Router)
- `/src/components/` - Composants réutilisables
- `/src/hooks/` - Hooks personnalisés
- `/src/lib/` - Utilitaires et configurations
- `/public/images/` - Images et assets

## Fonctionnalités

- ✅ Navigation responsive avec menu mobile
- ✅ Système de traduction FR/EN
- ✅ Pages : Accueil, À propos, Programme, Candidature, Mentors, Infos pratiques
- ✅ Formulaire de candidature avec upload de fichiers
- ✅ Design responsive identique au site original
- ✅ Intégration Supabase pour les candidatures

## Technologies utilisées

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Font Awesome
- Inter Font

## Migration depuis HTML

Ce projet est une migration complète du site HTML original vers Next.js, en conservant :
- Tous les textes et traductions
- Le design et les couleurs exactes
- Les images et assets
- Les liens LinkedIn
- Les fonctionnalités JavaScript
- La structure responsive