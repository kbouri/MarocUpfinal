import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}

