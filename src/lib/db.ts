import { Pool, QueryResult, QueryResultRow } from 'pg';

if (typeof window !== 'undefined') {
  throw new Error('Database utilities can only be used on the server side.');
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/core_cutting_db';

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log('Executed SQL Query', { text, duration, rows: res.rowCount });
  }
  return res;
}

export default pool;
