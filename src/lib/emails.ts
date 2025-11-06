import { Resend } from 'resend';

// Fonction pour obtenir l'instance Resend (lazy initialization)
function getResendInstance() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not defined in environment variables');
  }
  return new Resend(apiKey);
}

// Email de l'administrateur qui recevra les notifications
function getAdminEmail() {
  return process.env.ADMIN_EMAIL || 'contact@marocup.com';
}

// Email d'envoi (doit être vérifié dans Resend)
function getFromEmail() {
  return process.env.FROM_EMAIL || 'noreply@marocup.com';
}

// Mode développement : rediriger tous les emails vers l'admin (pour contourner les restrictions Resend)
const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Template email de confirmation pour une candidature startup
 */
function getStartupConfirmationEmailHtml(data: {
  startupName: string;
  founders: string;
  email: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #006233, #c1272d); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e9ecef; border-top: none; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
    .btn { display: inline-block; padding: 12px 24px; background: #c1272d; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    h1 { margin: 0; font-family: 'Nikea', sans-serif; }
    .highlight { color: #c1272d; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 MAROCUP</h1>
      <p>Votre candidature a été reçue !</p>
    </div>
    <div class="content">
      <h2>Bonjour ${data.founders} ! 👋</h2>
      <p>Merci d'avoir soumis votre candidature pour <strong class="highlight">${data.startupName}</strong> au MAROCUP !</p>
      
      <p>Nous avons bien reçu votre dossier et notre équipe va l'étudier attentivement dans les prochains jours.</p>
      
      <h3>📋 Prochaines étapes :</h3>
      <ul>
        <li><strong>Étude de votre dossier</strong> : Notre jury évaluera votre candidature</li>
        <li><strong>Sélection</strong> : Les startups sélectionnées seront contactées par email</li>
        <li><strong>MAROCUP</strong> : Rendez-vous pour la compétition finale !</li>
      </ul>
      
      <p>Nous vous contacterons à l'adresse <strong>${data.email}</strong> pour vous informer de la suite.</p>
      
      <p>En attendant, n'hésitez pas à suivre nos actualités et à nous contacter si vous avez des questions.</p>
      
      <p>Bonne chance ! 🍀</p>
      
      <p style="margin-top: 30px;">
        <strong>L'équipe MAROCUP</strong><br>
        <span style="color: #c1272d;">Empowering Moroccan Innovation</span>
      </p>
    </div>
    <div class="footer">
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      <p>Pour toute question : <a href="mailto:contact@marocup.com">contact@marocup.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Template email de confirmation pour un invité
 */
function getAttendeeConfirmationEmailHtml(data: {
  nomComplet: string;
  email: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #006233, #c1272d); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e9ecef; border-top: none; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
    h1 { margin: 0; font-family: 'Nikea', sans-serif; }
    .highlight { color: #c1272d; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 MAROCUP</h1>
      <p>Votre inscription a été confirmée !</p>
    </div>
    <div class="content">
      <h2>Bonjour ${data.nomComplet} ! 👋</h2>
      <p>Merci de votre intérêt pour le <strong class="highlight">MAROCUP</strong> !</p>
      
      <p>Nous avons bien reçu votre demande d'inscription en tant qu'invité. Notre équipe va traiter votre demande et vous contacter très prochainement.</p>
      
      <h3>📋 Informations importantes :</h3>
      <ul>
        <li><strong>Confirmation</strong> : Vous recevrez une confirmation finale par email</li>
        <li><strong>Programme</strong> : Les détails du programme vous seront communiqués</li>
        <li><strong>Lieu et date</strong> : Toutes les informations pratiques suivront</li>
      </ul>
      
      <p>Nous vous contacterons à l'adresse <strong>${data.email}</strong>.</p>
      
      <p>À très bientôt au MAROCUP ! 🚀</p>
      
      <p style="margin-top: 30px;">
        <strong>L'équipe MAROCUP</strong><br>
        <span style="color: #c1272d;">Empowering Moroccan Innovation</span>
      </p>
    </div>
    <div class="footer">
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      <p>Pour toute question : <a href="mailto:contact@marocup.com">contact@marocup.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Template email de notification admin pour une nouvelle candidature startup
 */
function getAdminStartupNotificationEmailHtml(data: {
  startupName: string;
  founders: string;
  email: string;
  sector: string;
  country: string;
  pitchDescription: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
    .content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: #c1272d; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; }
    .info-row { display: flex; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
    .label { font-weight: bold; color: #006233; min-width: 150px; }
    .value { flex: 1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <div class="header">
        <h2>🚀 Nouvelle Candidature Startup</h2>
      </div>
      
      <h3>Une nouvelle startup a soumis sa candidature !</h3>
      
      <div class="info-row">
        <span class="label">Nom de la startup :</span>
        <span class="value"><strong>${data.startupName}</strong></span>
      </div>
      
      <div class="info-row">
        <span class="label">Fondateurs :</span>
        <span class="value">${data.founders}</span>
      </div>
      
      <div class="info-row">
        <span class="label">Email :</span>
        <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
      </div>
      
      <div class="info-row">
        <span class="label">Secteur :</span>
        <span class="value">${data.sector}</span>
      </div>
      
      <div class="info-row">
        <span class="label">Pays :</span>
        <span class="value">${data.country}</span>
      </div>
      
      <div style="margin-top: 20px;">
        <strong>Pitch court :</strong>
        <p style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 10px;">${data.pitchDescription}</p>
      </div>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef; color: #666; font-size: 14px;">
        📧 Email de confirmation envoyé automatiquement au candidat.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Template email de notification admin pour un nouvel invité
 */
function getAdminAttendeeNotificationEmailHtml(data: {
  nomComplet: string;
  email: string;
  telephone: string;
  entreprise?: string;
  poste?: string;
  secteurActivite?: string;
  raisonParticipation?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
    .content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: #006233; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; }
    .info-row { display: flex; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
    .label { font-weight: bold; color: #c1272d; min-width: 150px; }
    .value { flex: 1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <div class="header">
        <h2>👤 Nouvelle Inscription Invité</h2>
      </div>
      
      <h3>Un nouvel invité s'est inscrit !</h3>
      
      <div class="info-row">
        <span class="label">Nom complet :</span>
        <span class="value"><strong>${data.nomComplet}</strong></span>
      </div>
      
      <div class="info-row">
        <span class="label">Email :</span>
        <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
      </div>
      
      <div class="info-row">
        <span class="label">Téléphone :</span>
        <span class="value">${data.telephone}</span>
      </div>
      
      ${data.entreprise ? `
      <div class="info-row">
        <span class="label">Entreprise :</span>
        <span class="value">${data.entreprise}</span>
      </div>
      ` : ''}
      
      ${data.poste ? `
      <div class="info-row">
        <span class="label">Poste :</span>
        <span class="value">${data.poste}</span>
      </div>
      ` : ''}
      
      ${data.secteurActivite ? `
      <div class="info-row">
        <span class="label">Secteur :</span>
        <span class="value">${data.secteurActivite}</span>
      </div>
      ` : ''}
      
      ${data.raisonParticipation ? `
      <div style="margin-top: 20px;">
        <strong>Raison de participation :</strong>
        <p style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 10px;">${data.raisonParticipation}</p>
      </div>
      ` : ''}
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef; color: #666; font-size: 14px;">
        📧 Email de confirmation envoyé automatiquement à l'invité.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Envoie un email de confirmation à une startup
 */
export async function sendStartupConfirmationEmail(data: {
  startupName: string;
  founders: string;
  email: string;
}) {
  try {
    const resend = getResendInstance();
    const adminEmail = getAdminEmail();
    const fromEmail = getFromEmail();
    
    // En développement, envoyer à l'admin avec une note dans le sujet
    const recipientEmail = IS_DEV ? adminEmail : data.email;
    const subject = IS_DEV 
      ? `[DEV] 🚀 Candidature MAROCUP reçue - ${data.startupName} (destinataire original: ${data.email})`
      : `🚀 Candidature MAROCUP reçue - ${data.startupName}`;
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: subject,
      html: getStartupConfirmationEmailHtml(data),
    });
    
    console.log(`✅ Email de confirmation startup envoyé à ${recipientEmail}:`, result);
    return result;
  } catch (error) {
    console.error('❌ Erreur envoi email confirmation startup:', error);
    throw error;
  }
}

/**
 * Envoie un email de notification à l'admin pour une nouvelle candidature startup
 */
export async function sendAdminStartupNotificationEmail(data: {
  startupName: string;
  founders: string;
  email: string;
  sector: string;
  country: string;
  pitchDescription: string;
}) {
  try {
    const resend = getResendInstance();
    const adminEmail = getAdminEmail();
    const fromEmail = getFromEmail();
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚀 Nouvelle candidature startup : ${data.startupName}`,
      html: getAdminStartupNotificationEmailHtml(data),
    });
    
    console.log('✅ Email de notification admin (startup) envoyé:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur envoi email notification admin (startup):', error);
    throw error;
  }
}

/**
 * Envoie un email de confirmation à un invité
 */
export async function sendAttendeeConfirmationEmail(data: {
  nomComplet: string;
  email: string;
}) {
  try {
    const resend = getResendInstance();
    const adminEmail = getAdminEmail();
    const fromEmail = getFromEmail();
    
    // En développement, envoyer à l'admin avec une note dans le sujet
    const recipientEmail = IS_DEV ? adminEmail : data.email;
    const subject = IS_DEV 
      ? `[DEV] 🎉 Inscription MAROCUP confirmée (destinataire original: ${data.email})`
      : '🎉 Inscription MAROCUP confirmée';
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: subject,
      html: getAttendeeConfirmationEmailHtml(data),
    });
    
    console.log(`✅ Email de confirmation invité envoyé à ${recipientEmail}:`, result);
    return result;
  } catch (error) {
    console.error('❌ Erreur envoi email confirmation invité:', error);
    throw error;
  }
}

/**
 * Envoie un email de notification à l'admin pour un nouvel invité
 */
export async function sendAdminAttendeeNotificationEmail(data: {
  nomComplet: string;
  email: string;
  telephone: string;
  entreprise?: string;
  poste?: string;
  secteurActivite?: string;
  raisonParticipation?: string;
}) {
  try {
    const resend = getResendInstance();
    const adminEmail = getAdminEmail();
    const fromEmail = getFromEmail();
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `👤 Nouvelle inscription invité : ${data.nomComplet}`,
      html: getAdminAttendeeNotificationEmailHtml(data),
    });
    
    console.log('✅ Email de notification admin (invité) envoyé:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur envoi email notification admin (invité):', error);
    throw error;
  }
}

