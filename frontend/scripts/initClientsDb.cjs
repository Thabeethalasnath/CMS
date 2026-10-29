const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false }
});

const initialClients = [
  {
    id: 'C-001',
    client_code: 'CL-001',
    client_name: 'TechNova Solutions',
    company_name: 'TechNova Pvt Ltd',
    industry: 'IT Services',
    contact_person: 'Rohan Mehta',
    email: 'rohan@technova.com',
    phone: '+91 98765 43210',
    country: 'India',
    city: 'Bangalore',
    client_type: 'Enterprise',
    account_owner: 'EMP-001',
    status: 'Active',
    credit_limit: '₹ 15,00,000',
    onboarding_date: '15 Jan 2024',
    notes: 'Key IT infrastructure and enterprise cloud client with annual SLA renewal.'
  },
  {
    id: 'C-002',
    client_code: 'CL-002',
    client_name: 'GreenLeaf Corp',
    company_name: 'GreenLeaf Corporation',
    industry: 'Manufacturing',
    contact_person: 'Ananya Rao',
    email: 'ananya@greenleaf.com',
    phone: '+91 91234 56789',
    country: 'India',
    city: 'Mumbai',
    client_type: 'SMB',
    account_owner: 'EMP-002',
    status: 'Active',
    credit_limit: '₹ 8,50,000',
    onboarding_date: '20 Feb 2024',
    notes: 'Precision manufacturing ERP rollout and IoT sensor monitoring.'
  },
  {
    id: 'C-003',
    client_code: 'CL-003',
    client_name: 'BrightPath Edu',
    company_name: 'BrightPath Education',
    industry: 'Education',
    contact_person: 'Vikram Shah',
    email: 'vikram@brightpath.com',
    phone: '+91 98450 11223',
    country: 'India',
    city: 'Hyderabad',
    client_type: 'SMB',
    account_owner: 'EMP-003',
    status: 'Pending',
    credit_limit: '₹ 5,00,000',
    onboarding_date: '10 Mar 2024',
    notes: 'EdTech platform scaling with online LMS student portal modules.'
  },
  {
    id: 'C-004',
    client_code: 'CL-004',
    client_name: 'HealthSync Ltd',
    company_name: 'HealthSync Limited',
    industry: 'Healthcare',
    contact_person: 'Priya Nair',
    email: 'priya@healthsync.com',
    phone: '+91 98987 65432',
    country: 'India',
    city: 'Delhi',
    client_type: 'Enterprise',
    account_owner: 'EMP-004',
    status: 'Active',
    credit_limit: '₹ 25,00,000',
    onboarding_date: '05 Apr 2024',
    notes: 'Multi-hospital patient health records system with NABH compliance.'
  },
  {
    id: 'C-005',
    client_code: 'CL-005',
    client_name: 'UrbanSpace',
    company_name: 'UrbanSpace Pvt Ltd',
    industry: 'Real Estate',
    contact_person: 'Karthik R',
    email: 'karthik@urbanspace.com',
    phone: '+91 99887 77665',
    country: 'India',
    city: 'Pune',
    client_type: 'SMB',
    account_owner: 'EMP-001',
    status: 'Prospect',
    credit_limit: '₹ 6,00,000',
    onboarding_date: '18 May 2024',
    notes: 'Commercial lease management and tenant billing automation.'
  },
  {
    id: 'C-006',
    client_code: 'CL-006',
    client_name: 'Solaris Energy',
    company_name: 'Solaris Energy Pvt Ltd',
    industry: 'Renewable Energy',
    contact_person: 'Neha Gupta',
    email: 'neha@solaris.com',
    phone: '+91 90000 11223',
    country: 'India',
    city: 'Chennai',
    client_type: 'Enterprise',
    account_owner: 'EMP-002',
    status: 'Active',
    credit_limit: '₹ 18,00,000',
    onboarding_date: '22 Jun 2024',
    notes: 'Solar grid telemetry dashboard and energy forecasting solution.'
  },
  {
    id: 'C-007',
    client_code: 'CL-007',
    client_name: 'FinEdge Solutions',
    company_name: 'FinEdge Solutions',
    industry: 'Finance',
    contact_person: 'Amit Kumar',
    email: 'amit@finedge.com',
    phone: '+91 91230 44556',
    country: 'India',
    city: 'Bangalore',
    client_type: 'SMB',
    account_owner: 'EMP-003',
    status: 'Suspended',
    credit_limit: '₹ 12,00,000',
    onboarding_date: '14 Jul 2024',
    notes: 'Temporarily paused pending regulatory audit submission.'
  },
  {
    id: 'C-008',
    client_code: 'CL-008',
    client_name: 'LogiTrans Global',
    company_name: 'LogiTrans Global Ltd',
    industry: 'Logistics',
    contact_person: 'Sneha Kapoor',
    email: 'sneha@logitrans.com',
    phone: '+91 93456 77889',
    country: 'India',
    city: 'Mumbai',
    client_type: 'Enterprise',
    account_owner: 'EMP-005',
    status: 'Active',
    credit_limit: '₹ 20,00,000',
    onboarding_date: '30 Aug 2024',
    notes: 'Cross-border fleet tracking and route optimization dispatch.'
  },
  // Additional clients for multi-page data
  {
    id: 'C-009',
    client_code: 'CL-009',
    client_name: 'Apex Financials',
    company_name: 'Apex Financials Group',
    industry: 'Finance',
    contact_person: 'Deepak Joshi',
    email: 'deepak@apexfin.com',
    phone: '+91 98112 23344',
    country: 'India',
    city: 'Mumbai',
    client_type: 'Enterprise',
    account_owner: 'EMP-001',
    status: 'Active',
    credit_limit: '₹ 22,00,000',
    onboarding_date: '12 Sep 2024',
    notes: 'Wealth management portfolio analytics and KYC integration.'
  },
  {
    id: 'C-010',
    client_code: 'CL-010',
    client_name: 'Zenith Logistics',
    company_name: 'Zenith Cargo Services',
    industry: 'Logistics',
    contact_person: 'Pooja Verma',
    email: 'pooja@zenithcargo.com',
    phone: '+91 98223 34455',
    country: 'India',
    city: 'Delhi',
    client_type: 'SMB',
    account_owner: 'EMP-002',
    status: 'Active',
    credit_limit: '₹ 9,00,000',
    onboarding_date: '28 Oct 2024',
    notes: 'Automated warehouse inventory management and order fulfillment.'
  },
  {
    id: 'C-011',
    client_code: 'CL-011',
    client_name: 'BioGenix Labs',
    company_name: 'BioGenix Life Sciences',
    industry: 'Healthcare',
    contact_person: 'Dr. Suresh V',
    email: 'suresh@biogenix.com',
    phone: '+91 98334 45566',
    country: 'India',
    city: 'Hyderabad',
    client_type: 'Enterprise',
    account_owner: 'EMP-004',
    status: 'Pending',
    credit_limit: '₹ 14,00,000',
    onboarding_date: '15 Nov 2024',
    notes: 'Clinical trial tracking and LIMS reporting automation.'
  },
  {
    id: 'C-012',
    client_code: 'CL-012',
    client_name: 'Skyline Architects',
    company_name: 'Skyline Design & Build',
    industry: 'Real Estate',
    contact_person: 'Farhan Ali',
    email: 'farhan@skyline.com',
    phone: '+91 98445 56677',
    country: 'UAE',
    city: 'Dubai',
    client_type: 'Enterprise',
    account_owner: 'EMP-003',
    status: 'Active',
    credit_limit: '₹ 30,00,000',
    onboarding_date: '02 Dec 2024',
    notes: '3D BIM rendering pipeline and site progress tracking.'
  },
  {
    id: 'C-013',
    client_code: 'CL-013',
    client_name: 'Nova Retail',
    company_name: 'Nova Retail Mart Ltd',
    industry: 'E-commerce',
    contact_person: 'Kavita Menon',
    email: 'kavita@novamart.com',
    phone: '+91 98556 67788',
    country: 'India',
    city: 'Bangalore',
    client_type: 'SMB',
    account_owner: 'EMP-001',
    status: 'Active',
    credit_limit: '₹ 7,50,000',
    onboarding_date: '10 Jan 2025',
    notes: 'Omnichannel POS sync and personalized loyalty rewards system.'
  },
  {
    id: 'C-014',
    client_code: 'CL-014',
    client_name: 'AeroDynamics Tech',
    company_name: 'AeroDynamics Aerospace',
    industry: 'Manufacturing',
    contact_person: 'Rajesh Iyer',
    email: 'rajesh@aerodynamics.com',
    phone: '+91 98667 78899',
    country: 'Singapore',
    city: 'Singapore',
    client_type: 'Enterprise',
    account_owner: 'EMP-005',
    status: 'Active',
    credit_limit: '₹ 40,00,000',
    onboarding_date: '24 Jan 2025',
    notes: 'Aerospace component inventory compliance and maintenance tracking.'
  },
  {
    id: 'C-015',
    client_code: 'CL-015',
    client_name: 'CyberShield Corp',
    company_name: 'CyberShield Security Ltd',
    industry: 'IT Services',
    contact_person: 'Tarun Saxena',
    email: 'tarun@cybershield.com',
    phone: '+91 98778 89900',
    country: 'India',
    city: 'Pune',
    client_type: 'SMB',
    account_owner: 'EMP-002',
    status: 'Prospect',
    credit_limit: '₹ 11,00,000',
    onboarding_date: '14 Feb 2025',
    notes: 'Threat detection telemetry and automated SOC alert escalation.'
  },
  {
    id: 'C-016',
    client_code: 'CL-016',
    client_name: 'EcoHarvest Farms',
    company_name: 'EcoHarvest Organic Foods',
    industry: 'Education',
    contact_person: 'Sunita Patil',
    email: 'sunita@ecoharvest.com',
    phone: '+91 98889 90011',
    country: 'India',
    city: 'Chennai',
    client_type: 'SMB',
    account_owner: 'EMP-003',
    status: 'Active',
    credit_limit: '₹ 6,50,000',
    onboarding_date: '01 Mar 2025',
    notes: 'Farm-to-fork supply chain traceability and cold-storage alerts.'
  }
];

async function initClientsTable() {
  console.log('Connecting to Supabase PostgreSQL to initialize clients table...');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(64) PRIMARY KEY,
        client_code VARCHAR(64) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        industry VARCHAR(128) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        country VARCHAR(128) NOT NULL DEFAULT 'India',
        city VARCHAR(128) NOT NULL,
        client_type VARCHAR(64) NOT NULL DEFAULT 'Enterprise',
        account_owner VARCHAR(128) NOT NULL DEFAULT 'EMP-001',
        status VARCHAR(64) NOT NULL DEFAULT 'Active',
        credit_limit VARCHAR(64) DEFAULT '₹ 10,00,000',
        onboarding_date VARCHAR(64) DEFAULT '15 Jan 2024',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Table "clients" verified/created successfully.');

    for (const c of initialClients) {
      await pool.query(`
        INSERT INTO clients (
          id, client_code, client_name, company_name, industry, contact_person,
          email, phone, country, city, client_type, account_owner,
          status, credit_limit, onboarding_date, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )
        ON CONFLICT (id) DO UPDATE SET
          client_code = EXCLUDED.client_code,
          client_name = EXCLUDED.client_name,
          company_name = EXCLUDED.company_name,
          industry = EXCLUDED.industry,
          contact_person = EXCLUDED.contact_person,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          country = EXCLUDED.country,
          city = EXCLUDED.city,
          client_type = EXCLUDED.client_type,
          account_owner = EXCLUDED.account_owner,
          status = EXCLUDED.status,
          credit_limit = EXCLUDED.credit_limit,
          onboarding_date = EXCLUDED.onboarding_date,
          notes = EXCLUDED.notes,
          updated_at = NOW();
      `, [
        c.id, c.client_code, c.client_name, c.company_name, c.industry, c.contact_person,
        c.email, c.phone, c.country, c.city, c.client_type, c.account_owner,
        c.status, c.credit_limit, c.onboarding_date, c.notes
      ]);
    }

    const res = await pool.query("SELECT id, client_code, client_name, company_name, industry, contact_person, status FROM clients ORDER BY id ASC LIMIT 8;");
    console.log('Exact Clients seeded into PostgreSQL:');
    console.table(res.rows);
  } catch (err) {
    console.error('Error initializing clients:', err);
  } finally {
    await pool.end();
  }
}

initClientsTable();
