const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false }
});

const exactLeads = [
  {
    id: 'L-2025-001',
    lead_date: '15 Mar 2025',
    company: 'Acme Pvt Ltd',
    contact_name: 'Rahul Mehta',
    email: 'rahul@acme.com',
    phone: '+91 98765 43210',
    source: 'Website',
    service_interest: 'Web Development',
    country: 'India',
    city: 'Bangalore',
    owner_id: 'EMP-001',
    stage: 'New',
    lead_score: 85,
    expected_value: '₹ 12,00,000',
    expected_close_date: '20 Apr 2025',
    next_follow_up: '18 Mar 2025',
    status: 'Open',
    lost_reason: '-',
    notes: 'Interested in enterprise corporate portal redesign and headless architecture.',
    created_at: '2025-03-15T10:15:00Z'
  },
  {
    id: 'L-2025-002',
    lead_date: '14 Mar 2025',
    company: 'Bright Solutions',
    contact_name: 'Sneha Kapoor',
    email: 'sneha@bright.com',
    phone: '+91 91234 56789',
    source: 'Referral',
    service_interest: 'Mobile App',
    country: 'India',
    city: 'Chennai',
    owner_id: 'EMP-003',
    stage: 'Contacted',
    lead_score: 62,
    expected_value: '₹ 8,50,000',
    expected_close_date: '10 May 2025',
    next_follow_up: '16 Mar 2025',
    status: 'In Progress',
    lost_reason: '-',
    notes: 'Discussed initial cross-platform mobile app requirements for field agents.',
    created_at: '2025-03-14T14:30:00Z'
  },
  {
    id: 'L-2025-003',
    lead_date: '14 Mar 2025',
    company: 'CloudTech Services',
    contact_name: 'Vikram T',
    email: 'vikram@cloudtech.com',
    phone: '+91 98450 11223',
    source: 'LinkedIn',
    service_interest: 'AI Solutions',
    country: 'India',
    city: 'Hyderabad',
    owner_id: 'EMP-002',
    stage: 'Qualified',
    lead_score: 78,
    expected_value: '₹ 15,00,000',
    expected_close_date: '25 Apr 2025',
    next_follow_up: '14 Mar 2025',
    status: 'Open',
    lost_reason: '-',
    notes: 'Client interested in generative AI copilots and document intelligence search.',
    created_at: '2025-03-14T09:45:00Z'
  },
  {
    id: 'L-2025-004',
    lead_date: '13 Mar 2025',
    company: 'Delta Systems',
    contact_name: 'Priya Nair',
    email: 'priya@deltasys.com',
    phone: '+91 98987 65432',
    source: 'Event',
    service_interest: 'ERP Solution',
    country: 'UAE',
    city: 'Dubai',
    owner_id: 'EMP-004',
    stage: 'Proposal',
    lead_score: 70,
    expected_value: '₹ 25,00,000',
    expected_close_date: '30 Apr 2025',
    next_follow_up: '20 Mar 2025',
    status: 'In Progress',
    lost_reason: '-',
    notes: 'Proposal to be delivered for supply chain & procurement ERP implementation.',
    created_at: '2025-03-13T16:20:00Z'
  },
  {
    id: 'L-2025-005',
    lead_date: '13 Mar 2025',
    company: 'Evergreen Retail',
    contact_name: 'Manoj J',
    email: 'manoj@egretail.com',
    phone: '+91 99887 77665',
    source: 'Website',
    service_interest: 'E-commerce',
    country: 'India',
    city: 'Mumbai',
    owner_id: 'EMP-001',
    stage: 'Negotiation',
    lead_score: 68,
    expected_value: '₹ 18,00,000',
    expected_close_date: '18 Apr 2025',
    next_follow_up: '15 Mar 2025',
    status: 'Open',
    lost_reason: '-',
    notes: 'Waiting for board approval on enterprise marketplace SLA and contract.',
    created_at: '2025-03-13T11:15:00Z'
  },
  {
    id: 'L-2025-006',
    lead_date: '12 Mar 2025',
    company: 'Global Traders',
    contact_name: 'Anita Sharma',
    email: 'anita@global.com',
    phone: '+91 90000 11223',
    source: 'Cold Call',
    service_interest: 'Digital Marketing',
    country: 'India',
    city: 'Delhi',
    owner_id: 'EMP-003',
    stage: 'New',
    lead_score: 55,
    expected_value: '₹ 5,00,000',
    expected_close_date: '28 Apr 2025',
    next_follow_up: '17 Mar 2025',
    status: 'Open',
    lost_reason: '-',
    notes: '-',
    created_at: '2025-03-12T13:40:00Z'
  },
  {
    id: 'L-2025-007',
    lead_date: '12 Mar 2025',
    company: 'NextGen Labs',
    contact_name: 'Rakesh Kumar',
    email: 'rakesh@nextgen.com',
    phone: '+91 91230 44556',
    source: 'Partner',
    service_interest: 'Cloud & DevOps',
    country: 'Singapore',
    city: 'Singapore',
    owner_id: 'EMP-002',
    stage: 'Contacted',
    lead_score: 60,
    expected_value: '₹ 10,00,000',
    expected_close_date: '12 May 2025',
    next_follow_up: '19 Mar 2025',
    status: 'In Progress',
    lost_reason: '-',
    notes: 'Call scheduled with regional cloud architecture team for DevOps audit.',
    created_at: '2025-03-12T17:00:00Z'
  },
  {
    id: 'L-2025-008',
    lead_date: '11 Mar 2025',
    company: 'Sunrise Foods',
    contact_name: 'Karthik R',
    email: 'karthik@sunrise.com',
    phone: '+91 93456 77889',
    source: 'Website',
    service_interest: 'Custom Software',
    country: 'India',
    city: 'Pune',
    owner_id: 'EMP-005',
    stage: 'Lost',
    lead_score: 40,
    expected_value: '₹ 6,00,000',
    expected_close_date: '-',
    next_follow_up: '-',
    status: 'Lost',
    lost_reason: 'Budget issue',
    notes: 'Client not ready for current fiscal year due to internal budget constraints.',
    created_at: '2025-03-11T12:00:00Z'
  },
  {
    id: 'L-2025-009',
    lead_date: '10 Mar 2025',
    company: 'Apex Financials',
    contact_name: 'Suresh Menon',
    email: 'suresh@apexfin.com',
    phone: '+91 98451 23456',
    source: 'LinkedIn',
    service_interest: 'AI Solutions',
    country: 'India',
    city: 'Bangalore',
    owner_id: 'EMP-004',
    stage: 'New',
    lead_score: 72,
    expected_value: '₹ 14,00,000',
    expected_close_date: '22 May 2025',
    next_follow_up: '24 Mar 2025',
    status: 'Open',
    lost_reason: '-',
    notes: 'Risk assessment platform integration with core banking systems.',
    created_at: '2025-03-10T15:30:00Z'
  },
  {
    id: 'L-2025-010',
    lead_date: '09 Mar 2025',
    company: 'Zenith Logistics',
    contact_name: 'Pooja Hegde',
    email: 'pooja@zenithlog.com',
    phone: '+91 98231 65490',
    source: 'Website',
    service_interest: 'Web Development',
    country: 'India',
    city: 'Mumbai',
    owner_id: 'EMP-001',
    stage: 'Proposal',
    lead_score: 80,
    expected_value: '₹ 19,80,000',
    expected_close_date: '15 Jun 2025',
    next_follow_up: '22 Mar 2025',
    status: 'In Progress',
    lost_reason: '-',
    notes: 'Fleet tracking real-time dashboard and client self-service portal.',
    created_at: '2025-03-09T19:45:00Z'
  }
];

async function updateDatabase() {
  console.log('Connecting to Supabase PostgreSQL...');
  try {
    // 1. Add missing columns if they do not exist
    await pool.query(`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 65;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS expected_value VARCHAR(64);
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS expected_close_date VARCHAR(64);
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS lost_reason VARCHAR(255) DEFAULT '-';
    `);
    console.log('Columns verified/added successfully.');

    // 2. Insert or update exact leads
    for (const l of exactLeads) {
      await pool.query(`
        INSERT INTO leads (
          id, lead_date, company, contact_name, email, phone, source,
          service_interest, country, city, owner_id, stage, lead_score,
          expected_value, expected_close_date, next_follow_up, status,
          lost_reason, notes, estimated_value, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17,
          $18, $19, $14, $20, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          lead_date = EXCLUDED.lead_date,
          company = EXCLUDED.company,
          contact_name = EXCLUDED.contact_name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          source = EXCLUDED.source,
          service_interest = EXCLUDED.service_interest,
          country = EXCLUDED.country,
          city = EXCLUDED.city,
          owner_id = EXCLUDED.owner_id,
          stage = EXCLUDED.stage,
          lead_score = EXCLUDED.lead_score,
          expected_value = EXCLUDED.expected_value,
          expected_close_date = EXCLUDED.expected_close_date,
          next_follow_up = EXCLUDED.next_follow_up,
          status = EXCLUDED.status,
          lost_reason = EXCLUDED.lost_reason,
          notes = EXCLUDED.notes,
          estimated_value = EXCLUDED.expected_value,
          updated_at = NOW();
      `, [
        l.id, l.lead_date, l.company, l.contact_name, l.email, l.phone, l.source,
        l.service_interest, l.country, l.city, l.owner_id, l.stage, l.lead_score,
        l.expected_value, l.expected_close_date, l.next_follow_up, l.status,
        l.lost_reason, l.notes, l.created_at
      ]);
    }

    console.log('Exact leads successfully updated in Supabase PostgreSQL!');

    // Verify
    const res = await pool.query(`
      SELECT id, company, contact_name, stage, lead_score, expected_value, expected_close_date, next_follow_up, status, lost_reason
      FROM leads ORDER BY id LIMIT 8
    `);
    console.table(res.rows);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

updateDatabase();
