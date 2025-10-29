import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST(request: NextRequest) {
  try {
    // Créer le pool au runtime avec les variables d'environnement
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('❌ DATABASE_URL manquante');
      return NextResponse.json(
        { error: 'Database configuration missing. Please check environment variables.' },
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
    
    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

