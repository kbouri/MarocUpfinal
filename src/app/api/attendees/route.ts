import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST(request: NextRequest) {
  try {
    // Créer le pool au runtime avec les variables d'environnement
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      // Debug: voir quelles variables d'environnement sont disponibles
      const availableEnvKeys = Object.keys(process.env).filter(k => 
        k.includes('DATABASE') || k.includes('DB')会不会 || k.includes('POSTGRES')
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
      `INSERT INTO event_attendees 
       (nom_complet, email, telephone, entreprise, poste, secteur_activite, 
        raison_participation, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        body.nomComplet, body.email, body.telephone, body.entreprise || null,
        body.poste || null, body.secteurActivite || null, body.raisonParticipation || null, body.message || null
      ]
    );

    // Fermer le pool après utilisation
    await pool.end();
    
    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

