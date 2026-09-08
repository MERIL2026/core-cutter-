import { Pool, QueryResult, QueryResultRow } from 'pg';

if (typeof window !== 'undefined') {
  throw new Error('Database utilities can only be used on the server side.');
}

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/core_cutting_db';

const isProduction = process.env.NODE_ENV === 'production';
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

let lastDbFailureTime = 0;
const DB_FAILURE_COOLDOWN_MS = 20000; // 20s cooldown before retrying DB connection if failed

export const pool = new Pool({
  connectionString,
  max: isProduction ? 10 : 5,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 2500, // 2.5s connection timeout
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});

let isInitialized = false;

export async function ensureEnquiriesTable() {
  if (isInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id VARCHAR(80) PRIMARY KEY,
        name VARCHAR(160) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        whatsapp_preference BOOLEAN DEFAULT true,
        service_id VARCHAR(120),
        service_name VARCHAR(160),
        location VARCHAR(160) NOT NULL,
        message TEXT,
        status VARCHAR(30) NOT NULL DEFAULT 'new',
        source VARCHAR(60) DEFAULT 'web_form',
        source_page VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    isInitialized = true;
  } catch (e) {
    // If DB is offline or read-only, fallback handles it
  }
}

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
    const res = await pool.query<T>(text, params);
    return res;
  } catch (err) {
    markDbFailure();
    throw err;
  }
}

export default pool;
