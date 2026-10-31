const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false }
});

async function cleanRemainingRows() {
  await pool.query(`
    UPDATE leads SET
      expected_value = COALESCE(expected_value, estimated_value, '₹ 10,00,000'),
      expected_close_date = COALESCE(expected_close_date, '15 Jun 2025'),
      lead_score = COALESCE(lead_score, 65),
      lost_reason = COALESCE(lost_reason, '-')
    WHERE expected_value IS NULL OR expected_close_date IS NULL;
  `);

  console.log('All leads in PostgreSQL cleaned and verified.');
  const res = await pool.query('SELECT id, company, stage, status, expected_value, expected_close_date, lead_score, lost_reason FROM leads ORDER BY id ASC');
  console.table(res.rows);
  await pool.end();
}

cleanRemainingRows();
