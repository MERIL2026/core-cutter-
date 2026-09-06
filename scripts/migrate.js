const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('DATABASE_URL environment variable is missing. Skipping migration execution.');
    return;
  }

  const pool = new Pool({ connectionString });

  try {
    const migrationsDir = path.join(__dirname, '../db/migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    console.log(`Found ${files.length} SQL migration script(s). Running...`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`Executing migration: ${file}`);
      await pool.query(sql);
      console.log(`Successfully executed: ${file}`);
    }

    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
