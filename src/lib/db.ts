import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Pool créé seulement si DATABASE_URL existe
// Sinon, l'erreur sera levée au runtime quand on essaiera de l'utiliser
const pool = connectionString 
  ? new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : null as any; // Type assertion pour éviter l'erreur TypeScript

export default pool;
