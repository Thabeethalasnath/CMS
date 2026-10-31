const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false }
});

// The 8 exact clients matching the Figma screenshot and CSS
const exactFirst8 = [
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
    account_owner: 'Akshit Ujjain',
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
    client_type: 'Enterprise',
    account_owner: 'Rohan Sharma',
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
    city: 'Delhi',
    client_type: 'SMB',
    account_owner: 'Priya Patel',
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
    city: 'Hyderabad',
    client_type: 'Enterprise',
    account_owner: 'Akshit Ujjain',
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
    city: 'Chennai',
    client_type: 'SMB',
    account_owner: 'Sneha Reddy',
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
    city: 'Pune',
    client_type: 'Enterprise',
    account_owner: 'Rohan Sharma',
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
    account_owner: 'Priya Patel',
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
    account_owner: 'Sneha Reddy',
    status: 'Active',
    credit_limit: '₹ 20,00,000',
    onboarding_date: '30 Aug 2024',
    notes: 'Cross-border fleet tracking and route optimization dispatch.'
  }
];

const industries = [
  'IT Services',
  'Manufacturing',
  'Education',
  'Healthcare',
  'Real Estate',
  'Renewable Energy',
  'Finance',
  'Logistics',
  'E-commerce'
];

const cities = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad'
];

const countries = ['India', 'United States', 'United Kingdom', 'UAE', 'Singapore'];

const clientTypes = ['Enterprise', 'SMB', 'Startup', 'Government'];

const accountOwners = [
  'Akshit Ujjain',
  'Rohan Sharma',
  'Priya Patel',
  'Sneha Reddy',
  'Amit Patel',
  'Neha Verma'
];

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anvi', 'Navya', 'Avani', 'Myra', 'Ira', 'Riya', 'Kavya'];
const lastNames = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Kumar', 'Kapoor', 'Singh', 'Gupta', 'Joshi', 'Shah', 'Rao', 'Iyer', 'Bhat', 'Saxena'];
const companyPrefixes = ['Apex', 'Zenith', 'BioGenix', 'Skyline', 'Nova', 'AeroDynamics', 'CyberShield', 'EcoHarvest', 'Quantum', 'Pulse', 'Vertex', 'Titan', 'Stellar', 'NexGen', 'Omni', 'Vanguard', 'Prime', 'Beacon', 'Synergy', 'Crest'];
const companySuffixes = ['Technologies', 'Labs', 'Enterprises', 'Ventures', 'Infotech', 'Solutions', 'Logistics', 'Retail', 'Digital', 'Systems', 'Global', 'Industries'];

async function seed() {
  console.log('Seeding 128 clients into Supabase PostgreSQL...');
  
  // Clear existing clients
  await pool.query('DELETE FROM clients');
  console.log('Cleared existing clients.');

  // Total clients: 128
  // Active: 96 (first 8 has 5 Active) -> need 91 more Active
  // New / Pending: 12 (first 8 has 1 Pending) -> need 11 more Pending / New
  // Prospect: first 8 has 1 -> need 8 more
  // Suspended: first 8 has 1 -> need 7 more
  // Inactive: 4
  // 5 + 91 = 96 Active
  // 1 + 11 = 12 Pending (New)
  // 1 + 8 = 9 Prospect
  // 1 + 6 = 7 Suspended
  // 0 + 4 = 4 Inactive
  // Total: 96 + 12 + 9 + 7 + 4 = 128!

  const allClients = [...exactFirst8];

  let activeNeeded = 91;
  let pendingNeeded = 11;
  let prospectNeeded = 8;
  let suspendedNeeded = 6;
  let inactiveNeeded = 4;

  for (let i = 9; i <= 128; i++) {
    const id = `C-${String(i).padStart(3, '0')}`;
    const clientCode = `CL-${String(i).padStart(3, '0')}`;
    
    let status = 'Active';
    if (activeNeeded > 0) {
      status = 'Active';
      activeNeeded--;
    } else if (pendingNeeded > 0) {
      status = 'Pending';
      pendingNeeded--;
    } else if (prospectNeeded > 0) {
      status = 'Prospect';
      prospectNeeded--;
    } else if (suspendedNeeded > 0) {
      status = 'Suspended';
      suspendedNeeded--;
    } else if (inactiveNeeded > 0) {
      status = 'Inactive';
      inactiveNeeded--;
    }

    const prefix = companyPrefixes[(i * 3 + 7) % companyPrefixes.length];
    const suffix = companySuffixes[(i * 5 + 2) % companySuffixes.length];
    const clientName = `${prefix} ${suffix.split(' ')[0]}`;
    const companyName = `${prefix} ${suffix} Pvt Ltd`;
    
    const fName = firstNames[(i * 7 + 3) % firstNames.length];
    const lName = lastNames[(i * 11 + 5) % lastNames.length];
    const contactPerson = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@${prefix.toLowerCase()}.com`;
    const phone = `+91 ${90000 + ((i * 739) % 9999)} ${10000 + ((i * 491) % 89999)}`;
    const industry = industries[(i * 2 + 1) % industries.length];
    const country = countries[(i * 3) % countries.length];
    const city = cities[(i * 4 + 2) % cities.length];
    const clientType = clientTypes[(i * 5) % clientTypes.length];
    const accountOwner = accountOwners[(i * 3 + 1) % accountOwners.length];
    
    const day = String((i % 28) + 1).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[i % 12];
    const year = i > 115 ? '2025' : '2024';
    const onboardingDate = `${day} ${month} ${year}`;
    
    const creditAmount = ((i * 150000) % 3500000) + 500000;
    const creditLimit = `₹ ${(creditAmount).toLocaleString('en-IN')}`;
    const notes = `Strategic account for ${industry.toLowerCase()} digital transformation and support.`;

    allClients.push({
      id,
      client_code: clientCode,
      client_name: clientName,
      company_name: companyName,
      industry,
      contact_person: contactPerson,
      email,
      phone,
      country,
      city,
      client_type: clientType,
      account_owner: accountOwner,
      status,
      credit_limit: creditLimit,
      onboarding_date: onboardingDate,
      notes
    });
  }

  // Insert in batches
  for (const c of allClients) {
    await pool.query(
      `INSERT INTO clients (
         id, client_code, client_name, company_name, industry, contact_person,
         email, phone, country, city, client_type, account_owner,
         status, credit_limit, onboarding_date, notes, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())`,
      [
        c.id,
        c.client_code,
        c.client_name,
        c.company_name,
        c.industry,
        c.contact_person,
        c.email,
        c.phone,
        c.country,
        c.city,
        c.client_type,
        c.account_owner,
        c.status,
        c.credit_limit,
        c.onboarding_date,
        c.notes
      ]
    );
  }

  const check = await pool.query(`
    SELECT 
      count(*) as total,
      count(*) FILTER (WHERE status = 'Active') as active,
      count(*) FILTER (WHERE status = 'Pending') as pending,
      count(*) FILTER (WHERE status = 'Prospect') as prospect,
      count(*) FILTER (WHERE status = 'Suspended') as suspended,
      count(*) FILTER (WHERE status = 'Inactive') as inactive
    FROM clients
  `);
  console.log('Seeded successfully! Verification counts:', check.rows[0]);
  pool.end();
}

seed().catch(e => {
  console.error('Error during seeding:', e);
  pool.end();
});
