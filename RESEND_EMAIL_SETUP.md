# Configuration Email avec Resend

Ce document explique comment configurer l'envoi d'emails automatiques pour le formulaire de candidature MAROCUP.

## 🎯 Fonctionnalités

Le système d'envoi d'emails comprend :

### Pour les candidatures Startup :
1. **Email de confirmation au candidat** : Email automatique envoyé à la startup après soumission
2. **Email de notification admin** : Email envoyé à l'administrateur avec les détails de la candidature

### Pour les inscriptions Invités :
1. **Email de confirmation à l'invité** : Email automatique envoyé après inscription
2. **Email de notification admin** : Email envoyé à l'administrateur avec les détails de l'invité

## 📋 Prérequis

- Un compte [Resend](https://resend.com/) (gratuit jusqu'à 3000 emails/mois)
- Un nom de domaine pour envoyer des emails (optionnel pour le développement)

## 🚀 Configuration

### Étape 1 : Créer un compte Resend

1. Allez sur [resend.com](https://resend.com/)
2. Créez un compte gratuit
3. Vérifiez votre email

### Étape 2 : Obtenir la clé API

1. Connectez-vous à votre compte Resend
2. Allez dans **Settings** → **API Keys**
3. Cliquez sur **Create API Key**
4. Donnez un nom à votre clé (ex: "MAROCUP Production")
5. Copiez la clé API (elle commence par `re_`)

### Étape 3 : Vérifier votre domaine (Production)

Pour la production, vous devez vérifier votre domaine :

1. Dans Resend, allez dans **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: `marocup.com`)
4. Suivez les instructions pour ajouter les enregistrements DNS :
   - **SPF** : Pour l'authentification
   - **DKIM** : Pour la signature des emails
   - **DMARC** : Pour la politique d'authentification

⚠️ **Important** : La vérification DNS peut prendre jusqu'à 48 heures.

### Étape 4 : Configurer les variables d'environnement

#### En local (`.env.local`) :

```env
# Resend API Key
RESEND_API_KEY=re_votre_clé_api_ici

# Email de l'administrateur (qui recevra les notifications)
ADMIN_EMAIL=karim@marocup.com

# Email d'envoi (doit être vérifié dans Resend)
FROM_EMAIL=noreply@marocup.com
```

#### Sur Vercel :

1. Allez dans votre projet sur Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez les 3 variables :
   - `RESEND_API_KEY` : Votre clé API Resend
   - `ADMIN_EMAIL` : Email qui recevra les notifications
   - `FROM_EMAIL` : Email d'envoi (doit être vérifié)

### Étape 5 : Mode développement (sans domaine vérifié)

Pour tester en développement sans domaine vérifié, Resend permet d'envoyer des emails à des adresses email que vous avez ajoutées dans votre compte :

1. Dans Resend, allez dans **Settings** → **Email addresses**
2. Ajoutez les emails de test
3. Vérifiez ces emails via le lien de confirmation
4. Utilisez ces emails pour tester

## 📧 Structure des emails

### Email de confirmation startup

- **Sujet** : `🚀 Candidature MAROCUP reçue - [Nom de la startup]`
- **Contenu** :
  - Message de bienvenue
  - Confirmation de réception
  - Prochaines étapes
  - Coordonnées de contact

### Email de notification admin (startup)

- **Sujet** : `🚀 Nouvelle candidature startup : [Nom de la startup]`
- **Contenu** :
  - Nom de la startup
  - Fondateurs
  - Email
  - Secteur
  - Pays
  - Pitch court

### Email de confirmation invité

- **Sujet** : `🎉 Inscription MAROCUP confirmée`
- **Contenu** :
  - Message de bienvenue
  - Confirmation d'inscription
  - Informations à venir

### Email de notification admin (invité)

- **Sujet** : `👤 Nouvelle inscription invité : [Nom]`
- **Contenu** :
  - Nom complet
  - Email
  - Téléphone
  - Entreprise (si fourni)
  - Poste (si fourni)
  - Secteur (si fourni)

## 🔧 Personnalisation

Les templates d'emails se trouvent dans `/src/lib/emails.ts`. Vous pouvez personnaliser :

- Les couleurs (actuellement : rouge #c1272d et vert #006233)
- Le contenu des messages
- La structure HTML
- Les polices (Nikea pour titres, Montserrat pour le corps)

## ✅ Test

### En local :

1. Lancez le serveur : `npm run dev`
2. Remplissez le formulaire sur `/apply`
3. Vérifiez les logs dans la console pour voir si les emails sont envoyés
4. Vérifiez votre boîte mail

### En production :

Après déploiement sur Vercel, testez le formulaire complet.

## 🐛 Dépannage

### Les emails ne sont pas envoyés

1. **Vérifiez les variables d'environnement** :
   ```bash
   echo $RESEND_API_KEY
   ```
   
2. **Vérifiez les logs Vercel** :
   - Allez dans votre projet Vercel
   - Cliquez sur **Deployments**
   - Sélectionnez le déploiement
   - Consultez les logs pour voir les erreurs

3. **Vérifiez le domaine** :
   - Dans Resend, vérifiez que votre domaine est validé
   - Le statut doit être "Verified"

4. **Testez la clé API** :
   ```bash
   curl -X POST 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer votre_clé_api' \
     -H 'Content-Type: application/json' \
     -d '{
       "from": "noreply@marocup.com",
       "to": "test@example.com",
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

### Les emails arrivent en spam

1. Assurez-vous d'avoir configuré SPF, DKIM et DMARC
2. Utilisez un domaine professionnel (pas Gmail, Yahoo, etc.)
3. Évitez les mots déclencheurs de spam dans le contenu

### Erreur "Domain not verified"

1. Vérifiez que vous avez bien ajouté les enregistrements DNS
2. Attendez jusqu'à 48h pour la propagation DNS
3. Utilisez [MXToolbox](https://mxtoolbox.com/) pour vérifier vos enregistrements

## 📊 Limites Resend

### Plan gratuit :
- **3,000 emails/mois**
- 100 emails/jour
- 1 domaine vérifié

### Plan payant (à partir de $20/mois) :
- 50,000 emails/mois
- Pas de limite quotidienne
- Domaines illimités
- Support prioritaire

## 🔒 Sécurité

⚠️ **Important** :
- Ne partagez JAMAIS votre clé API Resend
- Ne commitez JAMAIS vos fichiers `.env.local`
- Utilisez des variables d'environnement pour les données sensibles
- Régénérez votre clé API si elle est compromise

## 📞 Support

- **Documentation Resend** : [resend.com/docs](https://resend.com/docs)
- **Support Resend** : support@resend.com
- **Dashboard Resend** : [resend.com/emails](https://resend.com/emails) (voir les emails envoyés)

---

**Dernière mise à jour** : Novembre 2025  
**Version** : 1.0

