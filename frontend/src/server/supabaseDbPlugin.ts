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

        next();
      });
    }
  };
}
