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

        next();
      });
    }
  };
}
