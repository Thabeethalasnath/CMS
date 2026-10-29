import type { Plugin } from 'vite';
import pg from 'pg';

const { Pool } = pg;

// Supabase PostgreSQL Pooler Configuration
const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

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
        const url = req.url || '';

        // Handle GET /api/v1/dashboard/ceo
        if (url === '/api/v1/dashboard/ceo' && req.method === 'GET') {
          try {
            const data = await queryFullDashboard();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(data));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch dashboard data:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }

        // Handle PUT /api/v1/dashboard/ceo (Full or partial update)
        if (url === '/api/v1/dashboard/ceo' && req.method === 'PUT') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');

              // Update KPIs if provided
              if (Array.isArray(payload.kpis)) {
                for (const kpi of payload.kpis) {
                  await pool.query(
                    `UPDATE dashboard_kpi_cards 
                     SET formatted_value = $1, raw_value = $2, change_percentage = $3, change_type = $4, updated_at = NOW()
                     WHERE card_key = $5 OR id = $6`,
                    [
                      kpi.formatted_value,
                      kpi.raw_value,
                      kpi.change_percentage,
                      kpi.change_type,
                      kpi.card_key,
                      kpi.id || 0
                    ]
                  );
                }
              }

              // Update Alerts if provided
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

              // Update Settings if provided
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

        // Handle PUT /api/v1/dashboard/ceo/alerts/:id
        const alertMatch = url.match(/^\/api\/v1\/dashboard\/ceo\/alerts\/(\d+)$/);
        if (alertMatch && req.method === 'PUT') {
          const alertId = parseInt(alertMatch[1], 10);
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
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

        // ==========================================
        // /api/v1/leads CRUD Endpoints (Supabase DB)
        // ==========================================

        function mapLeadRow(r: any) {
          return {
            id: r.id,
            leadDate: r.lead_date,
            company: r.company,
            contactName: r.contact_name,
            email: r.email,
            phone: r.phone,
            source: r.source,
            serviceInterest: r.service_interest,
            country: r.country,
            city: r.city,
            ownerId: r.owner_id,
            stage: r.stage,
            status: r.status,
            leadScore: r.lead_score !== null && r.lead_score !== undefined ? Number(r.lead_score) : 65,
            expectedValue: r.expected_value || r.estimated_value || '₹ 10,00,000',
            expectedCloseDate: r.expected_close_date || '—',
            nextFollowUp: r.next_follow_up || '—',
            estimatedValue: r.estimated_value || r.expected_value || '₹ 10,00,000',
            lostReason: r.lost_reason || '-',
            notes: r.notes || '-',
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          };
        }

        // 1. GET /api/v1/leads
        if ((url === '/api/v1/leads' || url.startsWith('/api/v1/leads?')) && req.method === 'GET') {
          try {
            const resLeads = await pool.query('SELECT * FROM leads ORDER BY id ASC');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(resLeads.rows.map(mapLeadRow)));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch leads:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }

        // 2. POST /api/v1/leads
        if (url === '/api/v1/leads' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const p = JSON.parse(body || '{}');

              // Generate sequential ID if not passed
              let leadId = p.id;
              if (!leadId) {
                const countRes = await pool.query('SELECT id FROM leads ORDER BY id DESC');
                let maxNum = 16;
                countRes.rows.forEach((r: any) => {
                  const m = String(r.id).match(/L-\d{4}-(\d+)/);
                  if (m) {
                    const n = parseInt(m[1], 10);
                    if (n > maxNum) maxNum = n;
                  }
                });
                const nextNumStr = String(maxNum + 1).padStart(3, '0');
                const curYear = new Date().getFullYear();
                leadId = `L-${curYear}-${nextNumStr}`;
              }

              const leadDate =
                p.leadDate ||
                p.lead_date ||
                new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

              const insertRes = await pool.query(
                `INSERT INTO leads (
                   id, lead_date, company, contact_name, email, phone, source,
                   service_interest, country, city, owner_id, stage, status,
                   next_follow_up, estimated_value, notes, created_at, updated_at
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
                 RETURNING *`,
                [
                  leadId,
                  leadDate,
                  p.company || 'Unknown Company',
                  p.contactName || p.contact_name || 'Unknown Contact',
                  p.email || '',
                  p.phone || '',
                  p.source || 'Website',
                  p.serviceInterest || p.service_interest || 'Web Development',
                  p.country || 'India',
                  p.city || 'Mumbai',
                  p.ownerId || p.owner_id || 'Akshit Ujjain (CEO)',
                  p.stage || 'New',
                  p.status || 'Active',
                  p.nextFollowUp || p.next_follow_up || '',
                  p.estimatedValue || p.estimated_value || '',
                  p.notes || '',
                ]
              );

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(mapLeadRow(insertRes.rows[0])));
            } catch (err: any) {
              console.error('[Supabase API] Failed to create lead:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 3. PUT /api/v1/leads/:id
        const leadPutMatch = url.match(/^\/api\/v1\/leads\/([^\/\?]+)$/);
        if (leadPutMatch && req.method === 'PUT') {
          const leadId = decodeURIComponent(leadPutMatch[1]);
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const p = JSON.parse(body || '{}');
              const updateRes = await pool.query(
                `UPDATE leads SET
                   company = COALESCE($1, company),
                   contact_name = COALESCE($2, contact_name),
                   email = COALESCE($3, email),
                   phone = COALESCE($4, phone),
                   source = COALESCE($5, source),
                   service_interest = COALESCE($6, service_interest),
                   country = COALESCE($7, country),
                   city = COALESCE($8, city),
                   owner_id = COALESCE($9, owner_id),
                   stage = COALESCE($10, stage),
                   status = COALESCE($11, status),
                   next_follow_up = COALESCE($12, next_follow_up),
                   estimated_value = COALESCE($13, estimated_value),
                   notes = COALESCE($14, notes),
                   updated_at = NOW()
                 WHERE id = $15
                 RETURNING *`,
                [
                  p.company,
                  p.contactName || p.contact_name,
                  p.email,
                  p.phone,
                  p.source,
                  p.serviceInterest || p.service_interest,
                  p.country,
                  p.city,
                  p.ownerId || p.owner_id,
                  p.stage,
                  p.status,
                  p.nextFollowUp || p.next_follow_up,
                  p.estimatedValue || p.estimated_value,
                  p.notes,
                  leadId,
                ]
              );

              if (updateRes.rows.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Lead not found' }));
                return;
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(mapLeadRow(updateRes.rows[0])));
            } catch (err: any) {
              console.error('[Supabase API] Failed to update lead:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 4. DELETE /api/v1/leads/:id
        const leadDelMatch = url.match(/^\/api\/v1\/leads\/([^\/\?]+)$/);
        if (leadDelMatch && req.method === 'DELETE') {
          const leadId = decodeURIComponent(leadDelMatch[1]);
          try {
            await pool.query('DELETE FROM leads WHERE id = $1', [leadId]);
            res.statusCode = 204;
            res.end();
          } catch (err: any) {
            console.error('[Supabase API] Failed to delete lead:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // ==========================================
        // CLIENTS ENDPOINTS (/api/v1/clients)
        // ==========================================
        function mapClientRow(r: any) {
          return {
            id: r.id,
            clientCode: r.client_code,
            clientName: r.client_name,
            companyName: r.company_name,
            industry: r.industry,
            contactPerson: r.contact_person,
            email: r.email,
            phone: r.phone,
            country: r.country || 'India',
            city: r.city,
            clientType: r.client_type || 'Enterprise',
            accountOwner: r.account_owner || 'EMP-001',
            status: r.status || 'Active',
            creditLimit: r.credit_limit || '₹ 10,00,000',
            onboardingDate: r.onboarding_date || '15 Jan 2024',
            notes: r.notes || '',
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          };
        }

        // 1. GET /api/v1/clients
        if ((url === '/api/v1/clients' || url.startsWith('/api/v1/clients?')) && req.method === 'GET') {
          try {
            const resClients = await pool.query('SELECT * FROM clients ORDER BY id ASC');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(resClients.rows.map(mapClientRow)));
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch clients:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }

        // 2. POST /api/v1/clients
        if (url === '/api/v1/clients' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const p = JSON.parse(body || '{}');
              let clientId = p.id;
              if (!clientId) {
                const countRes = await pool.query('SELECT id FROM clients ORDER BY id DESC');
                let maxNum = 16;
                countRes.rows.forEach((r: any) => {
                  const m = String(r.id).match(/C-(\d+)/);
                  if (m) {
                    const n = parseInt(m[1], 10);
                    if (n > maxNum) maxNum = n;
                  }
                });
                const nextNumStr = String(maxNum + 1).padStart(3, '0');
                clientId = `C-${nextNumStr}`;
              }

              const clientCode = p.clientCode || p.client_code || `CL-${clientId.replace('C-', '')}`;
              const insertRes = await pool.query(
                `INSERT INTO clients (
                   id, client_code, client_name, company_name, industry, contact_person,
                   email, phone, country, city, client_type, account_owner,
                   status, credit_limit, onboarding_date, notes, created_at, updated_at
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
                 RETURNING *`,
                [
                  clientId,
                  clientCode,
                  p.clientName || p.client_name || 'New Client Corp',
                  p.companyName || p.company_name || 'New Client Company Ltd',
                  p.industry || 'IT Services',
                  p.contactPerson || p.contact_person || 'Contact Person',
                  p.email || '',
                  p.phone || '',
                  p.country || 'India',
                  p.city || 'Bangalore',
                  p.clientType || p.client_type || 'Enterprise',
                  p.accountOwner || p.account_owner || 'EMP-001',
                  p.status || 'Active',
                  p.creditLimit || p.credit_limit || '₹ 10,00,000',
                  p.onboardingDate || p.onboarding_date || '15 Mar 2025',
                  p.notes || '',
                ]
              );

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(mapClientRow(insertRes.rows[0])));
            } catch (err: any) {
              console.error('[Supabase API] Failed to create client:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 3. PUT /api/v1/clients/:id
        const clientPutMatch = url.match(/^\/api\/v1\/clients\/([^\/\?]+)$/);
        if (clientPutMatch && req.method === 'PUT') {
          const clientId = decodeURIComponent(clientPutMatch[1]);
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const p = JSON.parse(body || '{}');
              const updateRes = await pool.query(
                `UPDATE clients SET
                   client_code = COALESCE($1, client_code),
                   client_name = COALESCE($2, client_name),
                   company_name = COALESCE($3, company_name),
                   industry = COALESCE($4, industry),
                   contact_person = COALESCE($5, contact_person),
                   email = COALESCE($6, email),
                   phone = COALESCE($7, phone),
                   country = COALESCE($8, country),
                   city = COALESCE($9, city),
                   client_type = COALESCE($10, client_type),
                   account_owner = COALESCE($11, account_owner),
                   status = COALESCE($12, status),
                   credit_limit = COALESCE($13, credit_limit),
                   onboarding_date = COALESCE($14, onboarding_date),
                   notes = COALESCE($15, notes),
                   updated_at = NOW()
                 WHERE id = $16
                 RETURNING *`,
                [
                  p.clientCode || p.client_code,
                  p.clientName || p.client_name,
                  p.companyName || p.company_name,
                  p.industry,
                  p.contactPerson || p.contact_person,
                  p.email,
                  p.phone,
                  p.country,
                  p.city,
                  p.clientType || p.client_type,
                  p.accountOwner || p.account_owner,
                  p.status,
                  p.creditLimit || p.credit_limit,
                  p.onboardingDate || p.onboarding_date,
                  p.notes,
                  clientId,
                ]
              );

              if (updateRes.rows.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Client not found' }));
                return;
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(mapClientRow(updateRes.rows[0])));
            } catch (err: any) {
              console.error('[Supabase API] Failed to update client:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 4. DELETE /api/v1/clients/:id
        const clientDelMatch = url.match(/^\/api\/v1\/clients\/([^\/\?]+)$/);
        if (clientDelMatch && req.method === 'DELETE') {
          const clientId = decodeURIComponent(clientDelMatch[1]);
          try {
            await pool.query('DELETE FROM clients WHERE id = $1', [clientId]);
            res.statusCode = 204;
            res.end();
          } catch (err: any) {
            console.error('[Supabase API] Failed to delete client:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // ===============================================
        // /api/v1/attendance CRUD Endpoints (Supabase DB)
        // ===============================================

        function mapAttendanceRow(r: any) {
          return {
            id: r.id,
            attendanceDate: r.attendance_date,
            employeeId: r.employee_id,
            employeeName: r.employee_name,
            avatarInitials: r.avatar_initials,
            avatarColor: r.avatar_color,
            status: r.status,
            checkIn: r.check_in,
            checkOut: r.check_out,
            workHours: r.work_hours,
            overtimeHours: r.overtime_hours,
            workMinutes: r.work_minutes,
            overtimeMinutes: r.overtime_minutes,
            dayType: r.day_type,
            isLate: Boolean(r.is_late),
            hasOvertime: Boolean(r.has_overtime),
            notes: r.notes || '',
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          };
        }

        // 1. GET /api/v1/attendance/metrics
        if (url.startsWith('/api/v1/attendance/metrics') && req.method === 'GET') {
          try {
            const countRes = await pool.query('SELECT COUNT(*) as total FROM attendance');
            const presentRes = await pool.query("SELECT COUNT(*) as count FROM attendance WHERE LOWER(status) = 'present'");
            const lateRes = await pool.query('SELECT COUNT(*) as count FROM attendance WHERE is_late = true');
            const otRes = await pool.query('SELECT COALESCE(SUM(overtime_minutes), 0) as ot_min FROM attendance');

            const total = parseInt(countRes.rows[0].total, 10);
            const present = parseInt(presentRes.rows[0].count, 10);
            const late = parseInt(lateRes.rows[0].count, 10);
            const otHours = (parseInt(otRes.rows[0].ot_min || 0, 10) / 60).toFixed(1);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                totalRecords: total,
                totalRecordsTrend: '↑ 12% vs last month',
                presentRecords: present,
                presentRecordsTrend: '↑ 8% vs last month',
                lateRecords: late,
                lateRecordsTrend: '↓ 18% vs last month',
                totalOvertimeHours: otHours,
                totalOvertimeHoursTrend: '↑ 25% vs last month',
              })
            );
          } catch (err: any) {
            console.error('[Supabase API] Failed to get attendance metrics:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 2. GET /api/v1/attendance (All records)
        if ((url === '/api/v1/attendance' || url.startsWith('/api/v1/attendance?')) && req.method === 'GET') {
          try {
            const result = await pool.query('SELECT * FROM attendance ORDER BY id DESC');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result.rows.map(mapAttendanceRow)));
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch attendance:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 3. GET /api/v1/attendance/:id
        const attGetMatch = url.match(/^\/api\/v1\/attendance\/([^\/\?]+)$/);
        if (attGetMatch && req.method === 'GET') {
          const recordId = decodeURIComponent(attGetMatch[1]);
          try {
            const result = await pool.query('SELECT * FROM attendance WHERE id = $1', [recordId]);
            if (result.rows.length === 0) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Attendance record not found' }));
              return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(mapAttendanceRow(result.rows[0])));
          } catch (err: any) {
            console.error('[Supabase API] Failed to get attendance record:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 4. POST /api/v1/attendance
        if (url === '/api/v1/attendance' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const p = JSON.parse(body || '{}');
              let newId = p.id;
              if (!newId) {
                const countRes = await pool.query('SELECT COUNT(*) as cnt FROM attendance');
                const nextNum = parseInt(countRes.rows[0].cnt, 10) + 1;
                newId = `ATT-${String(nextNum).padStart(6, '0')}`;
              }

              const insertRes = await pool.query(
                `INSERT INTO attendance (
                  id, attendance_date, employee_id, employee_name, avatar_initials, avatar_color,
                  status, check_in, check_out, work_hours, overtime_hours,
                  work_minutes, overtime_minutes, day_type, is_late, has_overtime, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *`,
                [
                  newId,
                  p.attendanceDate || p.attendance_date || '31 Oct 2026',
                  p.employeeId || p.employee_id || 'EMP-001',
                  p.employeeName || p.employee_name || 'Amit Sharma',
                  p.avatarInitials || p.avatar_initials || 'AS',
                  p.avatarColor || p.avatar_color || 'blue',
                  p.status || 'Present',
                  p.checkIn || p.check_in || '09:00 AM',
                  p.checkOut || p.check_out || '06:00 PM',
                  p.workHours || p.work_hours || '8h 00m',
                  p.overtimeHours || p.overtime_hours || '0h 00m',
                  p.workMinutes !== undefined ? p.workMinutes : 480,
                  p.overtimeMinutes !== undefined ? p.overtimeMinutes : 0,
                  p.dayType || p.day_type || 'Regular',
                  Boolean(p.isLate ?? p.is_late),
                  Boolean(p.hasOvertime ?? p.has_overtime),
                  p.notes || '',
                ]
              );

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(mapAttendanceRow(insertRes.rows[0])));
            } catch (err: any) {
              console.error('[Supabase API] Failed to create attendance:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 5. PUT /api/v1/attendance/:id
        const attPutMatch = url.match(/^\/api\/v1\/attendance\/([^\/\?]+)$/);
        if (attPutMatch && req.method === 'PUT') {
          const recordId = decodeURIComponent(attPutMatch[1]);
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const p = JSON.parse(body || '{}');
              const updateRes = await pool.query(
                `UPDATE attendance SET
                   attendance_date = COALESCE($1, attendance_date),
                   employee_id = COALESCE($2, employee_id),
                   employee_name = COALESCE($3, employee_name),
                   avatar_initials = COALESCE($4, avatar_initials),
                   avatar_color = COALESCE($5, avatar_color),
                   status = COALESCE($6, status),
                   check_in = COALESCE($7, check_in),
                   check_out = COALESCE($8, check_out),
                   work_hours = COALESCE($9, work_hours),
                   overtime_hours = COALESCE($10, overtime_hours),
                   work_minutes = COALESCE($11, work_minutes),
                   overtime_minutes = COALESCE($12, overtime_minutes),
                   day_type = COALESCE($13, day_type),
                   is_late = COALESCE($14, is_late),
                   has_overtime = COALESCE($15, has_overtime),
                   notes = COALESCE($16, notes),
                   updated_at = NOW()
                 WHERE id = $17
                 RETURNING *`,
                [
                  p.attendanceDate || p.attendance_date,
                  p.employeeId || p.employee_id,
                  p.employeeName || p.employee_name,
                  p.avatarInitials || p.avatar_initials,
                  p.avatarColor || p.avatar_color,
                  p.status,
                  p.checkIn || p.check_in,
                  p.checkOut || p.check_out,
                  p.workHours || p.work_hours,
                  p.overtimeHours || p.overtime_hours,
                  p.workMinutes !== undefined ? p.workMinutes : null,
                  p.overtimeMinutes !== undefined ? p.overtimeMinutes : null,
                  p.dayType || p.day_type,
                  p.isLate !== undefined ? Boolean(p.isLate) : (p.is_late !== undefined ? Boolean(p.is_late) : null),
                  p.hasOvertime !== undefined ? Boolean(p.hasOvertime) : (p.has_overtime !== undefined ? Boolean(p.has_overtime) : null),
                  p.notes,
                  recordId,
                ]
              );

              if (updateRes.rows.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Attendance record not found' }));
                return;
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(mapAttendanceRow(updateRes.rows[0])));
            } catch (err: any) {
              console.error('[Supabase API] Failed to update attendance:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 6. DELETE /api/v1/attendance/:id
        const attDelMatch = url.match(/^\/api\/v1\/attendance\/([^\/\?]+)$/);
        if (attDelMatch && req.method === 'DELETE') {
          const recordId = decodeURIComponent(attDelMatch[1]);
          try {
            await pool.query('DELETE FROM attendance WHERE id = $1', [recordId]);
            res.statusCode = 204;
            res.end();
          } catch (err: any) {
            console.error('[Supabase API] Failed to delete attendance record:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // ==========================================
        // APPROVALS ENDPOINTS (/api/v1/approvals)
        // ==========================================
        function mapEmpRow(r: any) {
          return {
            id: parseInt(r.id, 10),
            employee_name: r.employee_name,
            employee_code: r.employee_code,
            request_type: r.request_type,
            applied_date: r.applied_date,
            from_date: r.from_date,
            to_date: r.to_date,
            duration: r.duration,
            reason: r.reason,
            status: r.status,
            created_at: r.created_at,
          };
        }

        function mapClientAppRow(r: any) {
          return {
            id: parseInt(r.id, 10),
            approval_id: r.approval_id,
            client_name: r.client_name,
            request_type: r.request_type,
            reference_id: r.reference_id,
            requester: r.requester,
            request_date: r.request_date,
            due_date: r.due_date,
            amount: r.amount || '-',
            status: r.status,
            created_at: r.created_at,
          };
        }

        function mapTicketRow(r: any) {
          return {
            id: parseInt(r.id, 10),
            approval_id: r.approval_id,
            record_type: r.record_type,
            record_code: r.record_code,
            title: r.title,
            client_requester: r.client_requester,
            approval_type: r.approval_type,
            priority: r.priority || '-',
            request_date: r.request_date,
            assigned_approver: r.assigned_approver,
            status: r.status,
            created_at: r.created_at,
          };
        }

        // 1. GET /api/v1/approvals
        if (url === '/api/v1/approvals' && req.method === 'GET') {
          try {
            const [empRes, clientRes, ticketRes] = await Promise.all([
              pool.query('SELECT * FROM employee_approvals ORDER BY id ASC'),
              pool.query('SELECT * FROM client_approvals ORDER BY id ASC'),
              pool.query('SELECT * FROM ticket_asset_approvals ORDER BY id ASC'),
            ]);

            const employees = empRes.rows.map(mapEmpRow);
            const clients = clientRes.rows.map(mapClientAppRow);
            const ticketsAssets = ticketRes.rows.map(mapTicketRow);

            let pending = 0;
            let approved = 0;
            let rejected = 0;
            [...employees, ...clients, ...ticketsAssets].forEach((item) => {
              if (item.status === 'Pending') pending++;
              else if (item.status === 'Approved') approved++;
              else if (item.status === 'Rejected') rejected++;
            });

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                employees,
                clients,
                ticketsAssets,
                summary: {
                  total: employees.length + clients.length + ticketsAssets.length,
                  pending,
                  approved,
                  rejected,
                },
              })
            );
            return;
          } catch (err: any) {
            console.error('[Supabase API] Failed to fetch approvals:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }

        // 2. PUT /api/v1/approvals/employee/:id
        const empPutMatch = url.match(/^\/api\/v1\/approvals\/employee\/(\d+)$/);
        if (empPutMatch && req.method === 'PUT') {
          const empId = parseInt(empPutMatch[1], 10);
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', async () => {
            try {
              const { status } = JSON.parse(body || '{}');
              await pool.query('UPDATE employee_approvals SET status = $1, updated_at = NOW() WHERE id = $2', [status, empId]);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, id: empId, status }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 3. POST /api/v1/approvals/employee
        if (url === '/api/v1/approvals/employee' && req.method === 'POST') {
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', async () => {
            try {
              const p = JSON.parse(body || '{}');
              const now = new Date();
              const applied_date = p.applied_date || now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
              const insertRes = await pool.query(
                `INSERT INTO employee_approvals (employee_name, employee_code, request_type, applied_date, from_date, to_date, duration, reason, status, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending', NOW(), NOW())
                 RETURNING *`,
                [p.employee_name, p.employee_code, p.request_type, applied_date, p.from_date, p.to_date, p.duration, p.reason]
              );
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(mapEmpRow(insertRes.rows[0])));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 4. PUT /api/v1/approvals/client/:id
        const clientAppPutMatch = url.match(/^\/api\/v1\/approvals\/client\/(\d+)$/);
        if (clientAppPutMatch && req.method === 'PUT') {
          const clientId = parseInt(clientAppPutMatch[1], 10);
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', async () => {
            try {
              const { status } = JSON.parse(body || '{}');
              await pool.query('UPDATE client_approvals SET status = $1, updated_at = NOW() WHERE id = $2', [status, clientId]);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, id: clientId, status }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 5. POST /api/v1/approvals/client
        if (url === '/api/v1/approvals/client' && req.method === 'POST') {
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', async () => {
            try {
              const p = JSON.parse(body || '{}');
              const now = new Date();
              const request_date = p.request_date || now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
              const countRes = await pool.query('SELECT COUNT(*) as count FROM client_approvals');
              const nextNum = String(parseInt(countRes.rows[0].count, 10) + 1).padStart(3, '0');
              const approval_id = p.approval_id || `APP-2025-${nextNum}`;
              const insertRes = await pool.query(
                `INSERT INTO client_approvals (approval_id, client_name, request_type, reference_id, requester, request_date, due_date, amount, status, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending', NOW(), NOW())
                 RETURNING *`,
                [approval_id, p.client_name, p.request_type, p.reference_id, p.requester, request_date, p.due_date, p.amount || '-']
              );
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(mapClientAppRow(insertRes.rows[0])));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 6. PUT /api/v1/approvals/ticket-asset/:id
        const ticketPutMatch = url.match(/^\/api\/v1\/approvals\/ticket-asset\/(\d+)$/);
        if (ticketPutMatch && req.method === 'PUT') {
          const ticketId = parseInt(ticketPutMatch[1], 10);
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', async () => {
            try {
              const { status } = JSON.parse(body || '{}');
              await pool.query('UPDATE ticket_asset_approvals SET status = $1, updated_at = NOW() WHERE id = $2', [status, ticketId]);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, id: ticketId, status }));
            } catch (err: any) {
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
