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

