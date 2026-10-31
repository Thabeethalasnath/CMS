const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    console.log('Public tables in Supabase:', res.rows.map(r => r.table_name));

    // Check if clients exists and its columns
    const clientsExists = res.rows.some(r => r.table_name === 'clients');
    if (clientsExists) {
      const cols = await pool.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'clients';"
      );
      console.log('clients columns:', cols.rows);
      const data = await pool.query("SELECT * FROM clients LIMIT 5;");
      console.log('clients data count:', data.rowCount, 'sample:', data.rows);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
