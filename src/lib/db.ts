import { Pool } from 'pg';

// Ce fichier n'est plus utilisé directement
// Les pools sont créés au runtime dans les routes API
// On garde ce fichier pour compatibilité mais il ne sera jamais utilisé en production

const connectionString = process.env.DATABASE_URL;

// Pool créé seulement si DATABASE_URL existe
const pool: Pool | null = connectionString 
  ? new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : null;

export default pool;
