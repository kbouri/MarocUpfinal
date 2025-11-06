import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { sendStartupConfirmationEmail, sendAdminStartupNotificationEmail } from '@/lib/emails';

export async function POST(request: NextRequest) {
  try {
    // Créer le pool au runtime avec les variables d'environnement
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      // Debug: voir quelles variables d'environnement sont disponibles
      const availableEnvKeys = Object.keys(process.env).filter(k => 
        k.includes('DATABASE') || k.includes('DB') || k.includes('POSTGRES')
      );
      console.error('❌ DATABASE_URL manquante. Variables disponibles:', {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        availableKeys: availableEnvKeys,
        allEnvKeysCount: Object.keys(process.env).length,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      });
      return NextResponse.json(
        { 
          error: 'Database configuration missing. Please check environment variables.',
          debug: {
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            availableKeys: availableEnvKeys
          }
        },
        { status: 500 }
      );
    }

    const pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    const body = await request.json();
    
    const result = await pool.query(
      `INSERT INTO startups_applications 
       (nom_startup, nom_fondateurs, email, pitch_court, secteur, pays_residence, 
        lien_prototype, lien_video, pitch_deck_url, business_plan_url, informations_complementaires)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        body.nom_startup, body.nom_fondateurs, body.email, body.pitch_court,
        body.secteur, body.pays_residence, body.lien_prototype, body.lien_video,
        body.pitch_deck_url, body.business_plan_url, body.informations_complementaires
      ]
    );

    // Fermer le pool après utilisation
    await pool.end();
    
    // Envoyer les emails (ne pas bloquer si ça échoue)
    try {
      // Email de confirmation au candidat
      await sendStartupConfirmationEmail({
        startupName: body.nom_startup,
        founders: body.nom_fondateurs,
        email: body.email,
      });
      
      // Email de notification à l'admin
      await sendAdminStartupNotificationEmail({
        startupName: body.nom_startup,
        founders: body.nom_fondateurs,
        email: body.email,
        sector: body.secteur,
        country: body.pays_residence,
        pitchDescription: body.pitch_court,
      });
    } catch (emailError) {
      // Logger l'erreur mais ne pas faire échouer la requête
      console.error('⚠️ Erreur lors de l\'envoi des emails (startup):', emailError);
    }
    
    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

