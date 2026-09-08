import { Pool, QueryResult, QueryResultRow } from 'pg';

if (typeof window !== 'undefined') {
  throw new Error('Database utilities can only be used on the server side.');
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/core_cutting_db';

let lastDbFailureTime = 0;
const DB_FAILURE_COOLDOWN_MS = 30000; // 30s cooldown before retrying DB connection if failed

export const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 1500, // Quick timeout (1.5s max) so requests never hang
});

export function isDbInCooldown(): boolean {
  return Date.now() - lastDbFailureTime < DB_FAILURE_COOLDOWN_MS;
}

export function markDbFailure() {
  lastDbFailureTime = Date.now();
}

export function resetDbCooldown() {
  lastDbFailureTime = 0;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  if (isDbInCooldown()) {
    throw new Error('Database is in temporary cooldown due to previous connection failure.');
  }

  try {
    const start = Date.now();
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed SQL Query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    markDbFailure();
    throw err;
  }
}

export default pool;

