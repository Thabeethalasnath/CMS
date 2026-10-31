const pg = require('pg');
const pool = new pg.Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leads' ORDER BY ordinal_position");
    console.log('Columns in leads table:');
    console.table(cols.rows);
    const rows = await pool.query('SELECT id, company, stage, status, owner_id, estimated_value FROM leads ORDER BY id LIMIT 8');
    console.log('Sample rows:');
    console.table(rows.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}
check();
