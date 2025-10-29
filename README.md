# 🚀 MarocUp - Site Web Next.js

Site officiel de MarocUp : événement d'accélération pour startups early-stage fondées par des Marocains.

## 🎯 Fonctionnalités

- ✅ **Deux parcours de candidature** :
  - 🚀 **Startups** : Formulaire complet avec pitch deck, business plan
  - 👥 **Invités** : Inscription simple pour assister à l'événement
- ✅ **Système de traduction** FR/EN
- ✅ **Upload de fichiers** (Cloudinary, 25GB gratuit)
- ✅ **Pages** : Accueil, À propos, Programme, Candidatures, Mentors, Infos pratiques

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Crée un fichier `.env.local` à la racine :

```env
DATABASE_URL=postgresql://neondb_owner:npg_G4njvl7dHISV@ep-sweet-recipe-adihih03-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

CLOUDINARY_CLOUD_NAME=dvwmz9puj
CLOUDINARY_API_KEY=541725366943753
CLOUDINARY_API_SECRET=8KFcKLxpMfHlpMjDiJ2ZamScnt0
```

## 🗄️ Base de Données

1. Va sur https://console.neon.tech
2. SQL Editor → Colle `neon-schema.sql` → Run

## 🚀 Développement

```bash
npm run dev
```

## 📝 Technologies

- **Next.js 15.5** + **React 19** + **TypeScript**
- **Neon** (PostgreSQL gratuit)
- **Cloudinary** (Storage fichiers)
- **Tailwind CSS 4**

## 🏗️ Structure

```
src/
├── app/          # Pages Next.js
├── components/   # Composants réutilisables
├── contexts/     # Contextes React (translations)
├── lib/          # Utilitaires (Supabase, translations)
└── hooks/        # Hooks personnalisés
```

## 📝 Technologies

- **Next.js 15.5** (App Router + Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Database + Storage)
- **Font Awesome**

## 🌐 Déploiement

Le projet est déployé automatiquement sur **Vercel** via GitHub.

---

**MarocUp** - Inspirer, Connecter, Innover | 19-20 Décembre 2025, Rabat
