import type { Plugin } from 'vite';
import pg from 'pg';

const { Pool } = pg;

// Supabase PostgreSQL Pooler Configuration (Port 6543 for PgBouncer connection pool)
const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

function formatIndianCurrency(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '₹ 0';
  return '₹ ' + Math.round(num).toLocaleString('en-IN');
}

function mapOpportunityRow(row: any) {
  const estVal = Number(row.estimated_value) || 0;
  const weighted = Number(row.weighted_pipeline) || 0;
  return {
    id: Number(row.id),
    opportunityId: row.opportunity_id || '',
    leadId: row.lead_id || '',
    clientId: row.client_id || '',
    opportunityName: row.opportunity_name || '',
    ownerId: row.owner_id || '',
    serviceId: row.service_id || '',
    stage: row.stage || 'New',
    probability: Number(row.probability) || 0,
    estimatedValue: estVal,
    estimatedValueFormatted: formatIndianCurrency(estVal),
    expectedCloseDate: row.expected_close_date || '-',
    lastContact: row.last_contact || '-',
    nextFollowUp: row.next_follow_up || '-',
    status: row.status || 'Open',
    lostReason: row.lost_reason || '-',
    weightedPipeline: weighted,
    weightedPipelineFormatted: formatIndianCurrency(weighted),
    orderIndex: Number(row.order_index) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapContractRow(row: any) {
  const val = Number(row.contract_value) || 0;
  return {
    id: Number(row.id),
    contractId: row.contract_id || '',
    clientId: row.client_id || '',
    proposalId: row.proposal_id || '',
    contractType: row.contract_type || '',
    startDate: row.start_date || '',
    endDate: row.end_date || '',
    renewalDate: row.renewal_date || '',
    contractValue: val,
    contractValueFormatted: formatIndianCurrency(val),
    noticePeriod: Number(row.notice_period) || 30,
    paymentTerms: row.payment_terms || 'Monthly',
    status: row.status || 'Active',
    notes: row.notes || null,
    orderIndex: Number(row.order_index) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapEmployeeRow(row: any) {
  const mCtc = Number(row.monthly_ctc) || 0;
  const aCtc = Number(row.annual_ctc) || (mCtc * 12);
  return {
    id: Number(row.id),
    employeeId: row.employee_id || '',
    employeeCode: row.employee_code || '',
    fullName: row.full_name || '',
    avatarInitials: row.avatar_initials || 'EM',
    avatarColor: row.avatar_color || '#1D4ED8',
    avatarBg: row.avatar_bg || '#DBEAFE',
    workEmail: row.work_email || '',
    phone: row.phone || '',
    department: row.department || '',
    designation: row.designation || '',
    employmentType: row.employment_type || 'Full Time',
    status: row.status || 'Active',
    location: row.location || 'Bangalore',
    reportingManager: row.reporting_manager || 'Akshit Ujjain',
    joiningDate: row.joining_date || '',
    tenureStatus: row.tenure_status || '1-3 Years',
    monthlyCtc: mCtc,
    monthlyCtcFormatted: formatIndianCurrency(mCtc),
    annualCtc: aCtc,
    annualCtcFormatted: formatIndianCurrency(aCtc),
    gender: row.gender || 'Male',
    orderIndex: Number(row.order_index) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapFollowUpRow(r: any) {
  return {
    id: Number(r.id),
    moduleCode: r.module_code || '',
    moduleName: r.module_name || '',
    moduleSub: r.module_sub || '',
    iconBg: r.icon_bg || 'bg-[#EFF6FF]',
    iconColor: r.icon_color || '#2563EB',
    count: Number(r.item_count) || 0,
    countVariant: r.count_variant || 'blue',
    keyInfoTitle: r.key_info_title || '',
    keyInfoSub: r.key_info_sub || '',
    priority: r.priority || 'Medium',
    health: r.health || 'Good',
    daysSinceLastFollowUp: r.days_since_last_follow_up || '0 days',
    daysColorRed: Boolean(r.days_color_red),
    primaryActionLabel: r.primary_action_label || 'Review',
    secondaryActionLabel: r.secondary_action_label || 'View',
    isDone: Boolean(r.is_done),
    notes: r.notes || null,
    orderIndex: Number(r.order_index) || 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

async function queryFullDashboard() {
  const [
    settingsRes,
    kpisRes,
    financeRes,
    expenseRes,
    pipelineRes,
    projectStatusRes,
    peopleMonthlyRes,
    peopleSummaryRes,
    alertsRes
  ] = await Promise.all([
    pool.query('SELECT * FROM dashboard_settings LIMIT 1'),
    pool.query('SELECT * FROM dashboard_kpi_cards ORDER BY sort_order ASC'),
    pool.query('SELECT * FROM finance_monthly ORDER BY sort_order ASC'),
    pool.query('SELECT * FROM expense_breakdown ORDER BY sort_order ASC'),
    pool.query('SELECT * FROM sales_pipeline_stages ORDER BY sort_order ASC'),
    pool.query('SELECT * FROM project_status_distribution ORDER BY sort_order ASC'),
    pool.query('SELECT * FROM people_monthly ORDER BY sort_order ASC'),
    pool.query('SELECT * FROM people_summary LIMIT 1'),
    pool.query('SELECT * FROM management_alerts ORDER BY sort_order ASC')
  ]);

  return {
    settings: settingsRes.rows[0] || {},
    kpis: kpisRes.rows.map((r) => ({
      ...r,
      raw_value: Number(r.raw_value),
      change_percentage: Number(r.change_percentage)
    })),
    finance_monthly: financeRes.rows.map((r) => ({
      ...r,
      invoice_value: Number(r.invoice_value),
      collected_payments: Number(r.collected_payments),
      outstanding_receivables: Number(r.outstanding_receivables),
      expenses: Number(r.expenses)
    })),
    expense_breakdown: expenseRes.rows.map((r) => ({
      ...r,
      percentage: Number(r.percentage),
      amount: Number(r.amount)
    })),
    sales_pipeline: pipelineRes.rows.map((r) => ({
      ...r,
      lead_count: Number(r.lead_count),
      conversion_rate: Number(r.conversion_rate)
    })),
    project_status: projectStatusRes.rows.map((r) => ({
      ...r,
      project_count: Number(r.project_count),
      percentage: Number(r.percentage)
    })),
    people_monthly: peopleMonthlyRes.rows.map((r) => ({
      ...r,
      employee_count: Number(r.employee_count),
      net_payroll: Number(r.net_payroll),
      employer_payroll_cost: Number(r.employer_payroll_cost)
    })),
    people_summary: peopleSummaryRes.rows[0]
      ? {
          ...peopleSummaryRes.rows[0],
          active_employees: Number(peopleSummaryRes.rows[0].active_employees),
          new_joiners_ytd: Number(peopleSummaryRes.rows[0].new_joiners_ytd),
          exits_ytd: Number(peopleSummaryRes.rows[0].exits_ytd),
          net_growth: Number(peopleSummaryRes.rows[0].net_growth)
        }
      : {},
    alerts: alertsRes.rows.map((r) => ({
      ...r,
      alert_count: Number(r.alert_count)
    }))
  };
}

export function supabaseDbPlugin(): Plugin {
  return {
    name: 'supabase-db-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const fullUrl = req.url || '';
        const [urlPath] = fullUrl.split('?');

        // Opportunities: Summary
        if (urlPath === '/api/v1/opportunities/summary' && req.method === 'GET') {
          try {
            const sumRes = await pool.query(`
              SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN status IN ('Open', 'In Progress') THEN 1 ELSE 0 END) AS open_count,
                SUM(CASE WHEN stage = 'Won' THEN 1 ELSE 0 END) AS won_count,
                COALESCE(SUM(weighted_pipeline), 0) AS weighted_sum
              FROM opportunities
            `);
            const row = sumRes.rows[0] || {};
            const total = Number(row.total) || 0;
            const open = Number(row.open_count) || 0;
            const won = Number(row.won_count) || 0;
            const weightedSum = Number(row.weighted_sum) || 0;

            const responseData = {
              success: true,
              message: 'Operation successful',
              data: {
                totalOpportunities: total > 8 ? total : 156,
                openOpportunities: open > 7 ? open : 98,
                weightedPipeline: weightedSum,
                weightedPipelineFormatted: '₹ 128',
                wonOpportunities: won > 0 ? won : 28,
                totalTrend: '↑ 12%',
                openTrend: '↑ 8%',
                weightedTrend: '↑ 15%',
                wonTrend: '↑ 20%'
              },
              timestamp: new Date().toISOString()
            };
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(responseData));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch opportunity summary:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Opportunities: Reset
        if (urlPath === '/api/v1/opportunities/reset' && req.method === 'POST') {
          try {
            await pool.query('DELETE FROM opportunities');
            await pool.query(`
              INSERT INTO opportunities (
                opportunity_id, lead_id, client_id, opportunity_name, owner_id, service_id,
                stage, probability, estimated_value, expected_close_date, last_contact,
                next_follow_up, status, lost_reason, weighted_pipeline, order_index, created_at, updated_at
              ) VALUES 
              ('O-2025-001', 'L-2025-001', 'C-001', 'Website Redesign Project', 'EMP-001', 'S-001', 'New', 20, 500000, '20 Apr 2025', '15 Mar 2025', '18 Mar 2025', 'Open', '-', 100000, 1, NOW(), NOW()),
              ('O-2025-002', 'L-2025-002', 'C-003', 'Mobile App Development', 'EMP-003', 'S-002', 'Qualified', 60, 1200000, '10 May 2025', '08 Mar 2025', '16 Mar 2025', 'In Progress', '-', 720000, 2, NOW(), NOW()),
              ('O-2025-003', 'L-2025-003', 'C-002', 'ERP Implementation', 'EMP-002', 'S-004', 'Proposal', 70, 2500000, '25 Apr 2025', '12 Mar 2025', '14 Mar 2025', 'Open', '-', 1750000, 3, NOW(), NOW()),
              ('O-2025-004', 'L-2025-004', 'C-005', 'Digital Marketing Package', 'EMP-004', 'S-003', 'Negotiation', 80, 850000, '30 Apr 2025', '11 Mar 2025', '20 Mar 2025', 'In Progress', '-', 680000, 4, NOW(), NOW()),
              ('O-2025-005', 'L-2025-005', 'C-004', 'Cloud Infrastructure Setup', 'EMP-001', 'S-005', 'Qualified', 50, 1800000, '18 Apr 2025', '10 Mar 2025', '15 Mar 2025', 'Open', '-', 900000, 5, NOW(), NOW()),
              ('O-2025-006', 'L-2025-006', 'C-007', 'IT Support & Maintenance', 'EMP-003', 'S-006', 'New', 30, 600000, '28 Apr 2025', '09 Mar 2025', '17 Mar 2025', 'Open', '-', 180000, 6, NOW(), NOW()),
              ('O-2025-007', 'L-2025-007', 'C-006', 'Custom Software Solution', 'EMP-002', 'S-001', 'Proposal', 75, 2000000, '12 May 2025', '12 Mar 2025', '19 Mar 2025', 'In Progress', '-', 1500000, 7, NOW(), NOW()),
              ('O-2025-008', 'L-2025-008', 'C-008', 'Cybersecurity Audit', 'EMP-005', 'S-007', 'Lost', 0, 400000, '-', '10 Mar 2025', '-', 'Lost', 'Budget issue', 0, 8, NOW(), NOW())
            `);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Opportunities reset to seed data successfully', data: null }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to reset opportunities:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Opportunities: List
        if (urlPath === '/api/v1/opportunities' && req.method === 'GET') {
          try {
            const result = await pool.query('SELECT * FROM opportunities ORDER BY order_index ASC, id ASC');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Operation successful',
              data: result.rows.map(mapOpportunityRow),
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to query opportunities:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Opportunities: Create
        if (urlPath === '/api/v1/opportunities' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const countRes = await pool.query('SELECT COUNT(*) FROM opportunities');
              const totalCount = Number(countRes.rows[0].count) + 1;
              const oppId = payload.opportunityId || `O-2025-${String(totalCount).padStart(3, '0')}`;
              const estVal = Number(payload.estimatedValue) || 0;
              const prob = Number(payload.probability) || 0;
              const weighted = (estVal * prob) / 100;

              const insertRes = await pool.query(`
                INSERT INTO opportunities (
                  opportunity_id, lead_id, client_id, opportunity_name, owner_id, service_id,
                  stage, probability, estimated_value, expected_close_date, last_contact,
                  next_follow_up, status, lost_reason, weighted_pipeline, order_index, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
                RETURNING *
              `, [
                oppId,
                payload.leadId || `L-2025-${String(totalCount).padStart(3, '0')}`,
                payload.clientId || 'C-001',
                payload.opportunityName || 'Untitled Opportunity',
                payload.ownerId || 'EMP-001',
                payload.serviceId || 'S-001',
                payload.stage || 'New',
                prob,
                estVal,
                payload.expectedCloseDate || '-',
                payload.lastContact || '15 Mar 2025',
                payload.nextFollowUp || '-',
                payload.status || 'Open',
                payload.lostReason || '-',
                weighted,
                totalCount
              ]);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({
                success: true,
                message: 'Opportunity created successfully',
                data: mapOpportunityRow(insertRes.rows[0]),
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              console.error('[Supabase API] Failed to create opportunity:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Opportunities: Update
        const oppPutMatch = urlPath.match(/^\/api\/v1\/opportunities\/(\d+)$/);
        if (oppPutMatch && req.method === 'PUT') {
          const id = parseInt(oppPutMatch[1], 10);
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const existingRes = await pool.query('SELECT * FROM opportunities WHERE id = $1', [id]);
              if (existingRes.rows.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({ success: false, message: `Opportunity with ID ${id} not found` }));
                return;
              }
              const old = existingRes.rows[0];
              const leadId = payload.leadId !== undefined ? payload.leadId : old.lead_id;
              const clientId = payload.clientId !== undefined ? payload.clientId : old.client_id;
              const name = payload.opportunityName !== undefined ? payload.opportunityName : old.opportunity_name;
              const ownerId = payload.ownerId !== undefined ? payload.ownerId : old.owner_id;
              const serviceId = payload.serviceId !== undefined ? payload.serviceId : old.service_id;
              const stage = payload.stage !== undefined ? payload.stage : old.stage;
              const prob = payload.probability !== undefined ? Number(payload.probability) : Number(old.probability);
              const estVal = payload.estimatedValue !== undefined ? Number(payload.estimatedValue) : Number(old.estimated_value);
              const expClose = payload.expectedCloseDate !== undefined ? payload.expectedCloseDate : old.expected_close_date;
              const lastContact = payload.lastContact !== undefined ? payload.lastContact : old.last_contact;
              const nextFollow = payload.nextFollowUp !== undefined ? payload.nextFollowUp : old.next_follow_up;
              const status = payload.status !== undefined ? payload.status : old.status;
              const lostReason = payload.lostReason !== undefined ? payload.lostReason : old.lost_reason;
              const weighted = (estVal * prob) / 100;

              const updateRes = await pool.query(`
                UPDATE opportunities SET
                  lead_id = $1, client_id = $2, opportunity_name = $3, owner_id = $4, service_id = $5,
                  stage = $6, probability = $7, estimated_value = $8, expected_close_date = $9,
                  last_contact = $10, next_follow_up = $11, status = $12, lost_reason = $13,
                  weighted_pipeline = $14, updated_at = NOW()
                WHERE id = $15
                RETURNING *
              `, [leadId, clientId, name, ownerId, serviceId, stage, prob, estVal, expClose, lastContact, nextFollow, status, lostReason, weighted, id]);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Opportunity updated successfully',
                data: mapOpportunityRow(updateRes.rows[0]),
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              console.error('[Supabase API] Failed to update opportunity:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Opportunities: Delete
        const oppDelMatch = urlPath.match(/^\/api\/v1\/opportunities\/(\d+)$/);
        if (oppDelMatch && req.method === 'DELETE') {
          const id = parseInt(oppDelMatch[1], 10);
          try {
            await pool.query('DELETE FROM opportunities WHERE id = $1', [id]);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Opportunity deleted successfully',
              data: null,
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to delete opportunity:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Contracts: Ensure table & seed
        const ensureContractsTable = async () => {
          await pool.query(`
            CREATE TABLE IF NOT EXISTS contracts (
              id BIGSERIAL PRIMARY KEY,
              contract_id VARCHAR(50) UNIQUE NOT NULL,
              client_id VARCHAR(50) NOT NULL,
              proposal_id VARCHAR(50),
              contract_type VARCHAR(100) NOT NULL,
              start_date VARCHAR(50) NOT NULL,
              end_date VARCHAR(50) NOT NULL,
              renewal_date VARCHAR(50),
              contract_value NUMERIC(15,2) NOT NULL,
              notice_period INT DEFAULT 30,
              payment_terms VARCHAR(100) DEFAULT 'Monthly',
              status VARCHAR(50) NOT NULL DEFAULT 'Active',
              notes TEXT,
              order_index INT DEFAULT 0,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
          `);
          const countRes = await pool.query('SELECT COUNT(*) FROM contracts');
          if (parseInt(countRes.rows[0].count, 10) < 72) {
            await seed72Contracts(pool);
          }
        };

        // Helper to seed complete 72 contracts
        async function seed72Contracts(poolClient: any) {
          const contractTypes = [
            'Service Agreement', 'Project Contract', 'Support & Maintenance', 'Software License',
            'Consulting Agreement', 'Implementation Contract', 'Annual Maintenance', 'Managed Services'
          ];
          const paymentTermsList = ['Monthly', 'Milestone', 'Quarterly', 'Annual'];
          const noticePeriods = [15, 30, 45, 60, 90];
          const values = [
            350000, 420000, 580000, 650000, 720000, 800000, 950000, 1050000,
            1150000, 1250000, 1350000, 1450000, 1600000, 1750000, 1900000, 2100000,
            2400000, 2750000, 3000000, 3500000
          ];
          const dates = [
            { start: '28 Jan 2025', end: '27 Jan 2026', renewal: '27 Dec 2025' },
            { start: '20 Jan 2025', end: '19 Jan 2026', renewal: '19 Dec 2025' },
            { start: '15 Jan 2025', end: '14 Jan 2026', renewal: '14 Dec 2025' },
            { start: '10 Jan 2025', end: '09 Jan 2026', renewal: '09 Dec 2025' },
            { start: '05 Jan 2025', end: '04 Jan 2026', renewal: '04 Dec 2025' },
            { start: '28 Dec 2024', end: '27 Dec 2025', renewal: '27 Nov 2025' },
            { start: '20 Dec 2024', end: '19 Dec 2025', renewal: '19 Nov 2025' },
            { start: '15 Dec 2024', end: '14 Dec 2025', renewal: '14 Nov 2025' },
            { start: '10 Dec 2024', end: '09 Dec 2025', renewal: '09 Nov 2025' },
            { start: '01 Dec 2024', end: '30 Nov 2025', renewal: '30 Oct 2025' },
            { start: '25 Nov 2024', end: '24 Nov 2025', renewal: '24 Oct 2025' },
            { start: '15 Nov 2024', end: '14 Nov 2025', renewal: '14 Oct 2025' },
            { start: '01 Nov 2024', end: '31 Oct 2025', renewal: '30 Sep 2025' },
            { start: '20 Oct 2024', end: '19 Oct 2025', renewal: '19 Sep 2025' },
            { start: '10 Oct 2024', end: '09 Oct 2025', renewal: '09 Sep 2025' },
            { start: '01 Oct 2024', end: '30 Sep 2025', renewal: '31 Aug 2025' }
          ];

          await poolClient.query('DELETE FROM contracts');

          const first8 = [
            ['C-2025-001', 'C-001', 'P-2025-001', 'Service Agreement', '15 Mar 2025', '14 Mar 2026', '14 Feb 2026', 1200000.00, 30, 'Monthly', 'Active', 'Standard IT services agreement with quarterly reviews', 1],
            ['C-2025-002', 'C-003', 'P-2025-002', 'Project Contract', '10 Mar 2025', '09 Mar 2026', '09 Feb 2026', 850000.00, 30, 'Milestone', 'Active', 'Phase 2 ERP implementation deliverables', 2],
            ['C-2025-003', 'C-002', 'P-2025-003', 'Support & Maintenance', '01 Mar 2025', '28 Feb 2026', '28 Jan 2026', 600000.00, 15, 'Quarterly', 'Expiring', 'Annual 24/7 technical support tier 1 and tier 2', 3],
            ['C-2025-004', 'C-005', 'P-2025-004', 'Software License', '25 Feb 2025', '24 Feb 2026', '24 Jan 2026', 475000.00, 30, 'Annual', 'Active', 'Enterprise cloud subscription 100 seats', 4],
            ['C-2025-005', 'C-004', 'P-2025-005', 'Consulting Agreement', '20 Feb 2025', '19 Feb 2026', '19 Jan 2026', 1500000.00, 60, 'Monthly', 'Active', 'Digital transformation architecture advisory services', 5],
            ['C-2025-006', 'C-007', 'P-2025-006', 'Implementation Contract', '15 Feb 2025', '14 Feb 2026', '14 Jan 2026', 920000.00, 30, 'Milestone', 'Expiring', 'Custom CRM module deployment and data migration', 6],
            ['C-2025-007', 'C-006', 'P-2025-007', 'Annual Maintenance', '10 Feb 2025', '09 Feb 2026', '09 Jan 2026', 540000.00, 30, 'Quarterly', 'Pending', 'Hardware infrastructure maintenance renewal pending approval', 7],
            ['C-2025-008', 'C-008', 'P-2025-008', 'Managed Services', '01 Feb 2025', '31 Jan 2026', '31 Dec 2025', 1800000.00, 90, 'Monthly', 'Terminated', 'Legacy datacenter managed services transitioned to cloud', 8]
          ];

          for (const c of first8) {
            await poolClient.query(`
              INSERT INTO contracts (
                contract_id, client_id, proposal_id, contract_type, start_date, end_date,
                renewal_date, contract_value, notice_period, payment_terms, status, notes,
                order_index, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
            `, c);
          }

          for (let i = 9; i <= 72; i++) {
            const cNum = String(i).padStart(3, '0');
            const contractId = `C-2025-${cNum}`;
            const clientNum = ((i - 1) % 18) + 1;
            const clientId = `C-${String(clientNum).padStart(3, '0')}`;
            const proposalId = `P-2025-${cNum}`;
            const contractType = contractTypes[(i - 1) % contractTypes.length];
            let status = 'Active';
            if (i === 12 || i === 22 || i === 33 || i === 44 || i === 55 || i === 66) {
              status = 'Expiring';
            } else if (i === 18 || i === 38 || i === 58) {
              status = 'Pending';
            } else if (i === 28 || i === 48 || i === 68) {
              status = 'Terminated';
            }
            const d = dates[(i - 1) % dates.length];
            const contractValue = values[(i - 1) % values.length];
            const noticePeriod = noticePeriods[(i - 1) % noticePeriods.length];
            const paymentTerms = paymentTermsList[(i - 1) % paymentTermsList.length];
            const notes = `${contractType} for client ${clientId} with ${paymentTerms.toLowerCase()} billing schedule.`;

            await poolClient.query(`
              INSERT INTO contracts (
                contract_id, client_id, proposal_id, contract_type, start_date, end_date,
                renewal_date, contract_value, notice_period, payment_terms, status, notes,
                order_index, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
            `, [contractId, clientId, proposalId, contractType, d.start, d.end, d.renewal, contractValue, noticePeriod, paymentTerms, status, notes, i]);
          }
        }

        // Contracts: Summary
        if (urlPath === '/api/v1/contracts/summary' && req.method === 'GET') {
          try {
            await ensureContractsTable();
            const [totalRes, activeRes, expiringRes, sumRes] = await Promise.all([
              pool.query('SELECT COUNT(*) FROM contracts'),
              pool.query("SELECT COUNT(*) FROM contracts WHERE LOWER(status) = 'active'"),
              pool.query("SELECT COUNT(*) FROM contracts WHERE LOWER(status) = 'expiring'"),
              pool.query('SELECT COALESCE(SUM(contract_value), 0) as total FROM contracts')
            ]);
            const total = Number(totalRes.rows[0].count) || 0;
            const active = Number(activeRes.rows[0].count) || 0;
            const expiring = Number(expiringRes.rows[0].count) || 0;
            const sum = Number(sumRes.rows[0].total) || 0;

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Contract summary retrieved successfully',
              data: {
                totalContracts: total,
                totalContractsTrend: '↑ 14% vs last month',
                activeContracts: active,
                activeContractsTrend: '↑ 8% vs last month',
                expiringContracts: expiring,
                expiringContractsTrend: '↓ 20% vs last month',
                totalContractValue: sum,
                totalContractValueFormatted: formatIndianCurrency(sum),
                totalContractValueTrend: '↑ 22% vs last month'
              },
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to query contract summary:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Contracts: Reset
        if (urlPath === '/api/v1/contracts/reset' && req.method === 'POST') {
          try {
            await seed72Contracts(pool);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Contracts reset to seed data successfully', data: null }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to reset contracts:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Contracts: List
        if (urlPath === '/api/v1/contracts' && req.method === 'GET') {
          try {
            await ensureContractsTable();
            const urlObj = new URL(req.url || '', 'http://localhost');
            const clientId = urlObj.searchParams.get('clientId');
            const proposalId = urlObj.searchParams.get('proposalId');
            const contractType = urlObj.searchParams.get('contractType');
            const status = urlObj.searchParams.get('status');
            const search = urlObj.searchParams.get('search');

            let query = 'SELECT * FROM contracts WHERE 1=1';
            const queryParams: any[] = [];

            if (clientId && clientId !== 'All') {
              queryParams.push(clientId);
              query += ` AND client_id = $${queryParams.length}`;
            }
            if (proposalId && proposalId !== 'All') {
              queryParams.push(proposalId);
              query += ` AND proposal_id = $${queryParams.length}`;
            }
            if (contractType && contractType !== 'All') {
              queryParams.push(contractType);
              query += ` AND contract_type = $${queryParams.length}`;
            }
            if (status && status !== 'All') {
              queryParams.push(status.toLowerCase());
              query += ` AND LOWER(status) = $${queryParams.length}`;
            }
            if (search && search.trim()) {
              queryParams.push(`%${search.trim().toLowerCase()}%`);
              const pIdx = queryParams.length;
              query += ` AND (LOWER(contract_id) LIKE $${pIdx} OR LOWER(client_id) LIKE $${pIdx} OR LOWER(proposal_id) LIKE $${pIdx} OR LOWER(contract_type) LIKE $${pIdx})`;
            }

            query += ' ORDER BY order_index ASC, id ASC';
            const result = await pool.query(query, queryParams);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Operation successful',
              data: result.rows.map(mapContractRow),
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to query contracts:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Contracts: Create
        if (urlPath === '/api/v1/contracts' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              await ensureContractsTable();
              const payload = JSON.parse(body || '{}');
              const countRes = await pool.query('SELECT COUNT(*) FROM contracts');
              const totalCount = Number(countRes.rows[0].count) + 1;
              const cId = payload.contractId || `C-2025-${String(totalCount).padStart(3, '0')}`;
              const val = Number(payload.contractValue) || 0;

              const insertRes = await pool.query(`
                INSERT INTO contracts (
                  contract_id, client_id, proposal_id, contract_type, start_date, end_date,
                  renewal_date, contract_value, notice_period, payment_terms, status, notes,
                  order_index, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
                RETURNING *
              `, [
                cId,
                payload.clientId || 'C-001',
                payload.proposalId || `P-2025-${String(totalCount).padStart(3, '0')}`,
                payload.contractType || 'Service Agreement',
                payload.startDate || '15 Mar 2025',
                payload.endDate || '14 Mar 2026',
                payload.renewalDate || '14 Feb 2026',
                val,
                Number(payload.noticePeriod) || 30,
                payload.paymentTerms || 'Monthly',
                payload.status || 'Active',
                payload.notes || null,
                totalCount
              ]);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({
                success: true,
                message: 'Contract created successfully',
                data: mapContractRow(insertRes.rows[0]),
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              console.error('[Supabase API] Failed to create contract:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Contracts: Update
        const contractPutMatch = urlPath.match(/^\/api\/v1\/contracts\/(\d+)$/);
        if (contractPutMatch && req.method === 'PUT') {
          const id = parseInt(contractPutMatch[1], 10);
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              await ensureContractsTable();
              const payload = JSON.parse(body || '{}');
              const existingRes = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);
              if (existingRes.rows.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({ success: false, message: 'Contract not found' }));
                return;
              }
              const old = existingRes.rows[0];

              const updatedRes = await pool.query(`
                UPDATE contracts SET
                  client_id = $1,
                  proposal_id = $2,
                  contract_type = $3,
                  start_date = $4,
                  end_date = $5,
                  renewal_date = $6,
                  contract_value = $7,
                  notice_period = $8,
                  payment_terms = $9,
                  status = $10,
                  notes = $11,
                  updated_at = NOW()
                WHERE id = $12
                RETURNING *
              `, [
                payload.clientId !== undefined ? payload.clientId : old.client_id,
                payload.proposalId !== undefined ? payload.proposalId : old.proposal_id,
                payload.contractType !== undefined ? payload.contractType : old.contract_type,
                payload.startDate !== undefined ? payload.startDate : old.start_date,
                payload.endDate !== undefined ? payload.endDate : old.end_date,
                payload.renewalDate !== undefined ? payload.renewalDate : old.renewal_date,
                payload.contractValue !== undefined ? Number(payload.contractValue) : old.contract_value,
                payload.noticePeriod !== undefined ? Number(payload.noticePeriod) : old.notice_period,
                payload.paymentTerms !== undefined ? payload.paymentTerms : old.payment_terms,
                payload.status !== undefined ? payload.status : old.status,
                payload.notes !== undefined ? payload.notes : old.notes,
                id
              ]);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Contract updated successfully',
                data: mapContractRow(updatedRes.rows[0]),
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              console.error('[Supabase API] Failed to update contract:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Contracts: Delete
        const contractDelMatch = urlPath.match(/^\/api\/v1\/contracts\/(\d+)$/);
        if (contractDelMatch && req.method === 'DELETE') {
          const id = parseInt(contractDelMatch[1], 10);
          try {
            await pool.query('DELETE FROM contracts WHERE id = $1', [id]);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Contract deleted successfully',
              data: null,
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to delete contract:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Employees: Summary
        if (urlPath === '/api/v1/employees/summary' && req.method === 'GET') {
          try {
            const countRes = await pool.query('SELECT COUNT(*) FROM employees');
            const activeRes = await pool.query("SELECT COUNT(*) FROM employees WHERE LOWER(status) = 'active'");
            const noticeRes = await pool.query("SELECT COUNT(*) FROM employees WHERE LOWER(status) = 'on notice'");
            const sumRes = await pool.query('SELECT COALESCE(SUM(monthly_ctc), 0) as total_monthly_ctc FROM employees');

            const total = Number(countRes.rows[0]?.count) || 0;
            const active = Number(activeRes.rows[0]?.count) || 0;
            const onNotice = Number(noticeRes.rows[0]?.count) || 0;
            const totalMonthly = Number(sumRes.rows[0]?.total_monthly_ctc) || 0;

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Employee summary retrieved successfully',
              data: {
                totalEmployees: total,
                totalEmployeesTrend: '↑ 12% vs last month',
                activeEmployees: active,
                activeEmployeesTrend: '↑ 8% vs last month',
                onNoticeEmployees: onNotice,
                onNoticeEmployeesTrend: '↓ 25% vs last month',
                totalMonthlyCtc: totalMonthly,
                totalMonthlyCtcFormatted: formatIndianCurrency(totalMonthly),
                totalMonthlyCtcTrend: '↑ 8% vs last month'
              },
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to query employee summary:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Employees: List
        if (urlPath === '/api/v1/employees' && req.method === 'GET') {
          try {
            const urlObj = new URL(req.url || '', 'http://localhost');
            const department = urlObj.searchParams.get('department');
            const designation = urlObj.searchParams.get('designation');
            const employmentType = urlObj.searchParams.get('employmentType');
            const status = urlObj.searchParams.get('status');
            const location = urlObj.searchParams.get('location');
            const reportingManager = urlObj.searchParams.get('reportingManager');
            const search = urlObj.searchParams.get('search');

            let query = 'SELECT * FROM employees WHERE 1=1';
            const queryParams: any[] = [];

            if (department && department !== 'All') {
              queryParams.push(department);
              query += ` AND LOWER(department) = LOWER($${queryParams.length})`;
            }
            if (designation && designation !== 'All') {
              queryParams.push(designation);
              query += ` AND LOWER(designation) = LOWER($${queryParams.length})`;
            }
            if (employmentType && employmentType !== 'All') {
              queryParams.push(employmentType);
              query += ` AND LOWER(employment_type) = LOWER($${queryParams.length})`;
            }
            if (status && status !== 'All') {
              queryParams.push(status);
              query += ` AND LOWER(status) = LOWER($${queryParams.length})`;
            }
            if (location && location !== 'All') {
              queryParams.push(location);
              query += ` AND LOWER(location) = LOWER($${queryParams.length})`;
            }
            if (reportingManager && reportingManager !== 'All') {
              queryParams.push(reportingManager);
              query += ` AND LOWER(reporting_manager) = LOWER($${queryParams.length})`;
            }
            if (search && search.trim()) {
              queryParams.push(`%${search.trim().toLowerCase()}%`);
              const pIdx = queryParams.length;
              query += ` AND (LOWER(employee_id) LIKE $${pIdx} OR LOWER(employee_code) LIKE $${pIdx} OR LOWER(full_name) LIKE $${pIdx} OR LOWER(work_email) LIKE $${pIdx} OR LOWER(phone) LIKE $${pIdx})`;
            }

            query += ' ORDER BY order_index ASC, id ASC';
            const result = await pool.query(query, queryParams);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Operation successful',
              data: result.rows.map(mapEmployeeRow),
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to query employees:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Employees: Get Single
        const empGetMatch = urlPath.match(/^\/api\/v1\/employees\/(\d+)$/);
        if (empGetMatch && req.method === 'GET') {
          const id = parseInt(empGetMatch[1], 10);
          try {
            const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
            if (result.rows.length === 0) {
              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
              return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Employee retrieved successfully',
              data: mapEmployeeRow(result.rows[0]),
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to get employee:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Employees: Create
        if (urlPath === '/api/v1/employees' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const countRes = await pool.query('SELECT COUNT(*) FROM employees');
              const totalCount = Number(countRes.rows[0].count) + 1;
              const empId = payload.employeeId || `EMP-${String(totalCount).padStart(3, '0')}`;
              const empCode = payload.employeeCode || `E-${String(totalCount).padStart(3, '0')}`;
              const mCtc = Number(payload.monthlyCtc) || 50000;
              const aCtc = Number(payload.annualCtc) || (mCtc * 12);

              const nameParts = (payload.fullName || 'New Employee').trim().split(/\s+/);
              const initials = payload.avatarInitials || (nameParts.length >= 2 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : nameParts[0].substring(0, 2).toUpperCase());

              const insertRes = await pool.query(`
                INSERT INTO employees (
                  employee_id, employee_code, full_name, avatar_initials, avatar_color, avatar_bg,
                  work_email, phone, department, designation, employment_type, status,
                  location, reporting_manager, joining_date, tenure_status, monthly_ctc, annual_ctc,
                  gender, order_index, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())
                RETURNING *
              `, [
                empId,
                empCode,
                payload.fullName || 'New Employee',
                initials,
                payload.avatarColor || '#1D4ED8',
                payload.avatarBg || '#DBEAFE',
                payload.workEmail || `${empId.toLowerCase()}@company.com`,
                payload.phone || '+91 98765 43210',
                payload.department || 'Engineering',
                payload.designation || 'Software Engineer',
                payload.employmentType || 'Full Time',
                payload.status || 'Active',
                payload.location || 'Bangalore',
                payload.reportingManager || 'Akshit Ujjain',
                payload.joiningDate || '15 Mar 2025',
                payload.tenureStatus || '1-3 Years',
                mCtc,
                aCtc,
                payload.gender || 'Male',
                totalCount
              ]);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({
                success: true,
                message: 'Employee created successfully',
                data: mapEmployeeRow(insertRes.rows[0]),
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              console.error('[Supabase API] Failed to create employee:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Employees: Update
        const empPutMatch = urlPath.match(/^\/api\/v1\/employees\/(\d+)$/);
        if (empPutMatch && req.method === 'PUT') {
          const id = parseInt(empPutMatch[1], 10);
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const existingRes = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
              if (existingRes.rows.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
                return;
              }
              const old = existingRes.rows[0];

              const mCtc = payload.monthlyCtc !== undefined ? Number(payload.monthlyCtc) : old.monthly_ctc;
              const aCtc = payload.annualCtc !== undefined ? Number(payload.annualCtc) : (mCtc * 12);

              const updatedRes = await pool.query(`
                UPDATE employees SET
                  full_name = $1,
                  work_email = $2,
                  phone = $3,
                  department = $4,
                  designation = $5,
                  employment_type = $6,
                  status = $7,
                  location = $8,
                  reporting_manager = $9,
                  joining_date = $10,
                  tenure_status = $11,
                  monthly_ctc = $12,
                  annual_ctc = $13,
                  updated_at = NOW()
                WHERE id = $14
                RETURNING *
              `, [
                payload.fullName !== undefined ? payload.fullName : old.full_name,
                payload.workEmail !== undefined ? payload.workEmail : old.work_email,
                payload.phone !== undefined ? payload.phone : old.phone,
                payload.department !== undefined ? payload.department : old.department,
                payload.designation !== undefined ? payload.designation : old.designation,
                payload.employmentType !== undefined ? payload.employmentType : old.employment_type,
                payload.status !== undefined ? payload.status : old.status,
                payload.location !== undefined ? payload.location : old.location,
                payload.reportingManager !== undefined ? payload.reportingManager : old.reporting_manager,
                payload.joiningDate !== undefined ? payload.joiningDate : old.joining_date,
                payload.tenureStatus !== undefined ? payload.tenureStatus : old.tenure_status,
                mCtc,
                aCtc,
                id
              ]);

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Employee updated successfully',
                data: mapEmployeeRow(updatedRes.rows[0]),
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              console.error('[Supabase API] Failed to update employee:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Employees: Delete
        const empDelMatch = urlPath.match(/^\/api\/v1\/employees\/(\d+)$/);
        if (empDelMatch && req.method === 'DELETE') {
          const id = parseInt(empDelMatch[1], 10);
          try {
            await pool.query('DELETE FROM employees WHERE id = $1', [id]);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Employee deleted successfully',
              data: null,
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to delete employee:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // ==========================================
        // DYNAMIC MODULE ENGINE: /api/v1/modules/:key
        // ==========================================
        const moduleSummaryMatch = urlPath.match(/^\/api\/v1\/modules\/([a-zA-Z0-9_-]+)\/summary$/);
        if (moduleSummaryMatch && req.method === 'GET') {
          const rawKey = moduleSummaryMatch[1].toLowerCase();
          try {
            let total = 0;
            let active = 0;
            let secondary = 0;
            let primaryLabel = 'Total Records';
            let activeLabel = 'Active / Ongoing';
            let secondaryLabel = 'Total Volume';
            let metricValFormatted = '₹ 0';

            if (rawKey === 'leads') {
              const countRes = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE LOWER(status) NOT LIKE \'%lost%\') as active FROM leads');
              total = Number(countRes.rows[0]?.total) || 0;
              active = Number(countRes.rows[0]?.active) || 0;
              primaryLabel = 'Total Leads';
              activeLabel = 'Active Leads';
              secondaryLabel = 'Follow-Ups Pending';
              secondary = 12;
              metricValFormatted = '₹ 1.84 Cr';
            } else if (rawKey === 'proposals') {
              const pRes = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE LOWER(status) = \'sent\' OR LOWER(status) = \'accepted\') as active, COALESCE(SUM(total_amount), 0) as val FROM proposals');
              total = Number(pRes.rows[0]?.total) || 0;
              active = Number(pRes.rows[0]?.active) || 0;
              primaryLabel = 'Total Proposals';
              activeLabel = 'Active Proposals';
              secondaryLabel = 'Pipeline Value';
              secondary = active;
              metricValFormatted = formatIndianCurrency(Number(pRes.rows[0]?.val) || 0);
            } else if (rawKey === 'clients' || rawKey === 'clients-list' || rawKey === 'client-dashboard') {
              const cRes = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE LOWER(status) = \'active\') as active FROM clients');
              total = Number(cRes.rows[0]?.total) || 0;
              active = Number(cRes.rows[0]?.active) || 0;
              primaryLabel = 'Total Clients';
              activeLabel = 'Active Accounts';
              secondaryLabel = 'Enterprise Tier';
              secondary = Math.round(active * 0.45);
              metricValFormatted = '₹ 4.85 Cr';
            } else if (rawKey === 'attendance') {
              const aRes = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE LOWER(status) = \'present\') as active, COUNT(*) FILTER (WHERE is_late = true) as late FROM attendance');
              total = Number(aRes.rows[0]?.total) || 0;
              active = Number(aRes.rows[0]?.active) || 0;
              secondary = Number(aRes.rows[0]?.late) || 0;
              primaryLabel = 'Attendance Logs';
              activeLabel = 'Present Days';
              secondaryLabel = 'Late Flags';
              metricValFormatted = '98.4% On-Time';
            } else if (['invoices', 'collections', 'collections-mgmt', 'collections-fin'].includes(rawKey)) {
              const iRes = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE LOWER(status) = \'open\') as active, COALESCE(SUM(outstanding), 0) as out FROM collections_invoices');
              total = Number(iRes.rows[0]?.total) || 0;
              active = Number(iRes.rows[0]?.active) || 0;
              primaryLabel = 'Total Invoices';
              activeLabel = 'Open Invoices';
              secondaryLabel = 'Outstanding Amount';
              secondary = active;
              metricValFormatted = formatIndianCurrency(Number(iRes.rows[0]?.out) || 0);
            } else if (rawKey === 'payments') {
              const payRes = await pool.query('SELECT COUNT(*) as total, COALESCE(SUM(amount), 0) as val FROM collections_payments');
              total = Number(payRes.rows[0]?.total) || 0;
              active = total;
              primaryLabel = 'Total Transactions';
              activeLabel = 'Cleared Payments';
              secondaryLabel = 'Total Disbursed';
              secondary = total;
              metricValFormatted = formatIndianCurrency(Number(payRes.rows[0]?.val) || 0);
            } else {
              const dRes = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE LOWER(status) IN (\'active\', \'approved\', \'in progress\', \'allocated\', \'processed\', \'resolved\', \'released\')) as active, COALESCE(SUM(numeric_value), 0) as num_sum FROM dynamic_module_records WHERE module_key = $1', [rawKey]);
              total = Number(dRes.rows[0]?.total) || 0;
              active = Number(dRes.rows[0]?.active) || 0;
              const nSum = Number(dRes.rows[0]?.num_sum) || 0;
              metricValFormatted = nSum > 1000 ? formatIndianCurrency(nSum) : String(nSum);
              secondary = Math.max(1, total - active);
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Summary loaded successfully',
              data: {
                total,
                primaryLabel,
                active,
                activeLabel,
                secondary,
                secondaryLabel,
                metricValFormatted,
                trend: '↑ 12% vs last month'
              },
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to query module summary:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        const moduleListMatch = urlPath.match(/^\/api\/v1\/modules\/([a-zA-Z0-9_-]+)$/);
        if (moduleListMatch && req.method === 'GET') {
          const rawKey = moduleListMatch[1].toLowerCase();
          try {
            let records: any[] = [];

            if (rawKey === 'leads') {
              const resRows = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 200');
              records = resRows.rows.map(r => ({
                id: r.id,
                code: r.id,
                title: r.company,
                subtitle: `${r.contact_name || ''} • ${r.email || ''}`,
                category: r.service_interest || r.source || 'Lead',
                status: r.status || r.stage || 'Open',
                priority: r.lead_score ? (r.lead_score >= 70 ? 'High' : 'Normal') : 'Normal',
                assignee: r.owner_id || 'Akshit Ujjain',
                value: r.estimated_value || r.expected_value || '₹ 0',
                date: r.lead_date || r.next_follow_up || 'Recent',
                details: r.notes || ''
              }));
            } else if (rawKey === 'proposals') {
              const resRows = await pool.query('SELECT * FROM proposals ORDER BY created_at DESC LIMIT 200');
              records = resRows.rows.map(r => ({
                id: r.id,
                code: r.id,
                title: r.title,
                subtitle: r.client_name,
                category: r.service_name || 'Enterprise Service',
                status: r.status || 'Sent',
                priority: r.version || 'v1.0',
                assignee: r.owner_name || 'Akshit Ujjain',
                value: formatIndianCurrency(Number(r.total_amount) || 0),
                date: r.proposal_date ? new Date(r.proposal_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
                details: r.description || ''
              }));
            } else if (rawKey === 'clients' || rawKey === 'clients-list' || rawKey === 'client-dashboard') {
              const resRows = await pool.query('SELECT * FROM clients ORDER BY created_at DESC LIMIT 200');
              records = resRows.rows.map(r => ({
                id: r.id,
                code: r.client_code || r.id,
                title: r.client_name,
                subtitle: `${r.industry || 'Enterprise'} • ${r.city || 'India'}`,
                category: r.client_type || 'Corporate',
                status: r.status || 'Active',
                priority: r.credit_limit || 'Standard',
                assignee: r.account_owner || 'Akshit Ujjain',
                value: r.credit_limit || '₹ 15,00,000',
                date: r.onboarding_date || 'Active',
                details: r.notes || ''
              }));
            } else if (rawKey === 'attendance') {
              const resRows = await pool.query('SELECT * FROM attendance ORDER BY attendance_date DESC, id ASC LIMIT 200');
              records = resRows.rows.map(r => ({
                id: r.id,
                code: r.employee_id,
                title: r.employee_name,
                subtitle: `${r.check_in || '09:30 AM'} - ${r.check_out || '06:30 PM'}${r.is_late ? ' • Late' : ''}`,
                category: r.day_type || 'Regular',
                status: r.status || 'Present',
                priority: r.is_late ? 'Late' : 'On Time',
                assignee: r.employee_name,
                value: r.work_hours ? `${r.work_hours} hrs` : '8.5 hrs',
                date: r.attendance_date || 'Today',
                details: r.notes || r.remarks || ''
              }));
            } else if (['invoices', 'collections', 'collections-mgmt', 'collections-fin'].includes(rawKey)) {
              const resRows = await pool.query('SELECT * FROM collections_invoices ORDER BY invoice_date DESC LIMIT 200');
              records = resRows.rows.map(r => ({
                id: r.id,
                code: r.id,
                title: r.client_name,
                subtitle: r.ageing_bucket ? `Ageing: ${r.ageing_bucket}` : 'Current',
                category: r.recommended_action || 'Commercial Invoice',
                status: r.status || 'Open',
                priority: r.days_overdue ? `${r.days_overdue}d Overdue` : 'Current',
                assignee: r.client_name,
                value: formatIndianCurrency(Number(r.outstanding || r.invoice_amount) || 0),
                date: r.due_date ? new Date(r.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Due Soon',
                details: r.recommended_action || ''
              }));
            } else if (rawKey === 'payments') {
              const resRows = await pool.query('SELECT * FROM collections_payments ORDER BY payment_date DESC LIMIT 200');
              records = resRows.rows.map(r => ({
                id: r.id,
                code: r.reference_id || r.id,
                title: r.client_name,
                subtitle: `${r.payment_method || 'Bank Transfer'} • Inv: ${r.invoice_id || 'Direct'}`,
                category: r.invoice_id || 'Invoice Payment',
                status: 'Completed',
                priority: r.payment_method || 'Verified',
                assignee: r.client_name,
                value: formatIndianCurrency(Number(r.amount) || 0),
                date: r.payment_date ? new Date(r.payment_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
                details: r.notes || ''
              }));
            } else {
              const resRows = await pool.query('SELECT * FROM dynamic_module_records WHERE module_key = $1 ORDER BY order_index ASC, id ASC', [rawKey]);
              records = resRows.rows.map(r => ({
                id: r.id,
                code: r.record_id,
                title: r.title,
                subtitle: r.subtitle || '',
                category: r.category || 'Standard',
                status: r.status || 'Active',
                priority: r.priority || 'Normal',
                assignee: r.assignee || 'Akshit Ujjain',
                value: r.numeric_value ? (Number(r.numeric_value) > 1000 ? formatIndianCurrency(Number(r.numeric_value)) : String(r.numeric_value)) : '-',
                date: r.date_value || 'Active',
                details: r.subtitle || ''
              }));
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Module records loaded successfully',
              data: records,
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to query module records:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Dynamic Module Engine: Create Record
        if (moduleListMatch && req.method === 'POST') {
          const rawKey = moduleListMatch[1].toLowerCase();
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const countRes = await pool.query('SELECT COUNT(*) FROM dynamic_module_records WHERE module_key = $1', [rawKey]);
              const recNum = Number(countRes.rows[0]?.count) + 1;
              const recId = payload.recordId || `${rawKey.substring(0, 3).toUpperCase()}-2025-${String(recNum).padStart(3, '0')}`;

              const insertRes = await pool.query(`
                INSERT INTO dynamic_module_records (
                  module_key, record_id, title, subtitle, category, status, priority,
                  assignee, numeric_value, date_value, order_index, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
                RETURNING *
              `, [
                rawKey,
                recId,
                payload.title || 'New Item',
                payload.subtitle || '',
                payload.category || 'General',
                payload.status || 'Active',
                payload.priority || 'Normal',
                payload.assignee || 'Akshit Ujjain',
                Number(payload.numericValue) || 0,
                payload.dateValue || 'Today',
                recNum
              ]);

              const r = insertRes.rows[0];
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({
                success: true,
                message: 'Record created successfully',
                data: {
                  id: r.id,
                  code: r.record_id,
                  title: r.title,
                  subtitle: r.subtitle,
                  category: r.category,
                  status: r.status,
                  priority: r.priority,
                  assignee: r.assignee,
                  value: r.numeric_value ? formatIndianCurrency(Number(r.numeric_value)) : '-',
                  date: r.date_value,
                  details: r.subtitle
                },
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              console.error('[Supabase API] Failed to create module record:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Dynamic Module Engine: Delete Record
        const moduleDeleteMatch = urlPath.match(/^\/api\/v1\/modules\/([a-zA-Z0-9_-]+)\/(\d+)$/);
        if (moduleDeleteMatch && req.method === 'DELETE') {
          const id = parseInt(moduleDeleteMatch[2], 10);
          try {
            await pool.query('DELETE FROM dynamic_module_records WHERE id = $1', [id]);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Record deleted successfully', data: null }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to delete module record:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Follow-Up Queue: Summary
        if (urlPath === '/api/v1/follow-up-queue/summary' && req.method === 'GET') {
          try {
            const sumRes = await pool.query(`
              SELECT 
                SUM(CASE WHEN LOWER(priority) = 'high' AND is_done = false THEN item_count ELSE 0 END) AS high_count,
                SUM(CASE WHEN LOWER(priority) = 'medium' AND is_done = false THEN item_count ELSE 0 END) AS med_count,
                SUM(CASE WHEN LOWER(priority) = 'low' AND is_done = false THEN item_count ELSE 0 END) AS low_count,
                COUNT(CASE WHEN is_done = false THEN 1 END) AS total_pending,
                COUNT(CASE WHEN is_done = true THEN 1 END) AS total_completed
              FROM follow_up_queue
            `);
            const r = sumRes.rows[0] || {};
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Operation successful',
              data: {
                highPriorityCount: Number(r.high_count) || 25,
                mediumPriorityCount: Number(r.med_count) || 17,
                lowPriorityCount: Number(r.low_count) || 5,
                totalPendingItems: Number(r.total_pending) || 8,
                totalCompletedItems: Number(r.total_completed) || 0
              },
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch follow-up summary:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Approvals: List
        if (urlPath === '/api/v1/approvals' && req.method === 'GET') {
          try {
            const empRes = await pool.query('SELECT * FROM employee_approvals ORDER BY sort_order ASC, id ASC');
            const clRes = await pool.query('SELECT * FROM client_approvals ORDER BY sort_order ASC, id ASC');
            const tkRes = await pool.query('SELECT * FROM ticket_asset_approvals ORDER BY sort_order ASC, id ASC');

            const employees = empRes.rows;
            const clients = clRes.rows;
            const ticketsAssets = tkRes.rows;

            let pending = 0, approved = 0, rejected = 0;
            [...employees, ...clients, ...ticketsAssets].forEach((item: any) => {
              if (item.status === 'Pending') pending++;
              else if (item.status === 'Approved') approved++;
              else if (item.status === 'Rejected') rejected++;
            });

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Approvals fetched successfully',
              data: {
                employees,
                clients,
                ticketsAssets,
                summary: {
                  total: employees.length + clients.length + ticketsAssets.length,
                  pending,
                  approved,
                  rejected
                }
              },
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            // Pass to Spring Boot backend
          }
        }

        // Approvals: Update Employee Status
        const empStatusMatch = urlPath.match(/^\/api\/v1\/approvals\/employee\/(\d+)\/status$/);
        if (empStatusMatch && req.method === 'PUT') {
          const id = parseInt(empStatusMatch[1], 10);
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const status = payload.status || 'Pending';
              const upd = await pool.query(
                'UPDATE employee_approvals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
                [status, id]
              );
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Employee approval status updated',
                data: upd.rows[0],
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Approvals: Update Client Status
        const clStatusMatch = urlPath.match(/^\/api\/v1\/approvals\/client\/(\d+)\/status$/);
        if (clStatusMatch && req.method === 'PUT') {
          const id = parseInt(clStatusMatch[1], 10);
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const status = payload.status || 'Pending';
              const upd = await pool.query(
                'UPDATE client_approvals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
                [status, id]
              );
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Client approval status updated',
                data: upd.rows[0],
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Approvals: Update Ticket/Asset Status
        const tkStatusMatch = urlPath.match(/^\/api\/v1\/approvals\/ticket-asset\/(\d+)\/status$/);
        if (tkStatusMatch && req.method === 'PUT') {
          const id = parseInt(tkStatusMatch[1], 10);
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const status = payload.status || 'Pending';
              const upd = await pool.query(
                'UPDATE ticket_asset_approvals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
                [status, id]
              );
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Ticket/Asset approval status updated',
                data: upd.rows[0],
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }

        // Follow-Up Queue: List
        if (urlPath === '/api/v1/follow-up-queue' && req.method === 'GET') {
          try {
            const result = await pool.query('SELECT * FROM follow_up_queue ORDER BY order_index ASC, id ASC');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Operation successful',
              data: result.rows.map(mapFollowUpRow),
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch follow-up items:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Follow-Up Queue: Toggle Done
        const toggleMatch = urlPath.match(/^\/api\/v1\/follow-up-queue\/(\d+)\/toggle-done$/);
        if (toggleMatch && req.method === 'PUT') {
          const id = parseInt(toggleMatch[1], 10);
          try {
            const upd = await pool.query('UPDATE follow_up_queue SET is_done = NOT is_done, updated_at = NOW() WHERE id = $1 RETURNING *', [id]);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'Item status toggled successfully',
              data: mapFollowUpRow(upd.rows[0]),
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to toggle done status:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Dashboard CEO: GET
        if (urlPath === '/api/v1/dashboard/ceo' && req.method === 'GET') {
          try {
            const data = await queryFullDashboard();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: 'CEO dashboard retrieved successfully',
              data,
              timestamp: new Date().toISOString()
            }));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch dashboard data:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err.message }));
            return;
          }
        }

        // Dashboard CEO: PUT
        if (urlPath === '/api/v1/dashboard/ceo' && req.method === 'PUT') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');

              if (Array.isArray(payload.kpis)) {
                for (const kpi of payload.kpis) {
                  await pool.query(
                    `UPDATE dashboard_kpi_cards 
                     SET formatted_value = $1, raw_value = $2, change_percentage = $3, change_type = $4, updated_at = NOW()
                     WHERE card_key = $5 OR id = $6`,
                    [kpi.formatted_value, kpi.raw_value, kpi.change_percentage, kpi.change_type, kpi.card_key, kpi.id || 0]
                  );
                }
              }

              if (Array.isArray(payload.alerts)) {
                for (const alert of payload.alerts) {
                  await pool.query(
                    `UPDATE management_alerts 
                     SET alert_count = $1 
                     WHERE id = $2 OR alert_key = $3`,
                    [alert.alert_count, alert.id || 0, alert.alert_key || '']
                  );
                }
              }

              if (payload.settings) {
                const s = payload.settings;
                await pool.query(
                  `UPDATE dashboard_settings 
                   SET dashboard_title = COALESCE($1, dashboard_title),
                       dashboard_subtitle = COALESCE($2, dashboard_subtitle),
                       last_updated = COALESCE($3, last_updated)
                   WHERE id = 1`,
                  [s.dashboard_title, s.dashboard_subtitle, s.last_updated]
                );
              }

              const updated = await queryFullDashboard();
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(updated));
            } catch (err: any) {
              console.error('[Supabase API] Failed to update dashboard data:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // Dashboard Alerts: PUT
        const alertMatch = urlPath.match(/^\/api\/v1\/dashboard\/ceo\/alerts\/(\d+)$/);
        if (alertMatch && req.method === 'PUT') {
          const alertId = parseInt(alertMatch[1], 10);
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const { delta, alert_count } = JSON.parse(body || '{}');
              if (delta !== undefined) {
                await pool.query(
                  `UPDATE management_alerts 
                   SET alert_count = GREATEST(0, alert_count + $1)
                   WHERE id = $2`,
                  [delta, alertId]
                );
              } else if (alert_count !== undefined) {
                await pool.query(
                  `UPDATE management_alerts 
                   SET alert_count = GREATEST(0, $1)
                   WHERE id = $2`,
                  [alert_count, alertId]
                );
              }

              const updated = await queryFullDashboard();
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(updated));
            } catch (err: any) {
              console.error('[Supabase API] Failed to update alert count:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}
