import { FullDashboardData } from '../types/dashboard';
import { initialDashboardData } from '../constants/initialDashboardData';

const STORAGE_KEY = 'kalpanaaa_cms_dashboard_data';
const BACKEND_API_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Normalizer to convert any API response (camelCase or snake_case) into robust FullDashboardData
export function normalizeDashboardData(raw: any): FullDashboardData {
  if (!raw || typeof raw !== 'object') {
    return initialDashboardData;
  }

  const getArray = (snake: string, camel: string) => {
    const val = raw[snake] ?? raw[camel];
    return Array.isArray(val) ? val : [];
  };

  const financeMonthlyRaw = getArray('finance_monthly', 'financeMonthly');
  const finance_monthly = (financeMonthlyRaw.length > 0 ? financeMonthlyRaw : initialDashboardData.finance_monthly).map((d: any, idx: number) => ({
    id: d.id ?? idx + 1,
    month_name: d.month_name ?? d.monthName ?? `M${idx + 1}`,
    invoice_value: Number(d.invoice_value ?? d.invoiceValue ?? 0),
    collected_payments: Number(d.collected_payments ?? d.collectedPayments ?? 0),
    outstanding_receivables: Number(d.outstanding_receivables ?? d.outstandingReceivables ?? 0),
    expenses: Number(d.expenses ?? 0),
    sort_order: Number(d.sort_order ?? d.sortOrder ?? idx + 1),
  }));

  const expenseBreakdownRaw = getArray('expense_breakdown', 'expenseBreakdown');
  const expense_breakdown = (expenseBreakdownRaw.length > 0 ? expenseBreakdownRaw : initialDashboardData.expense_breakdown).map((d: any, idx: number) => ({
    id: d.id ?? idx + 1,
    category_name: d.category_name ?? d.categoryName ?? 'Other',
    percentage: Number(d.percentage ?? 0),
    amount: Number(d.amount ?? 0),
    color_hex: d.color_hex ?? d.colorHex ?? '#64748B',
    sort_order: Number(d.sort_order ?? d.sortOrder ?? idx + 1),
  }));

  const salesPipelineRaw = getArray('sales_pipeline', 'salesPipeline');
  const sales_pipeline = (salesPipelineRaw.length > 0 ? salesPipelineRaw : initialDashboardData.sales_pipeline).map((d: any, idx: number) => ({
    id: d.id ?? idx + 1,
    stage_name: d.stage_name ?? d.stageName ?? 'Stage',
    lead_count: Number(d.lead_count ?? d.leadCount ?? 0),
    conversion_rate: Number(d.conversion_rate ?? d.conversionRate ?? 0),
    color_hex: d.color_hex ?? d.colorHex ?? '#3B82F6',
    sort_order: Number(d.sort_order ?? d.sortOrder ?? idx + 1),
  }));

  const projectStatusRaw = getArray('project_status', 'projectStatus');
  const project_status = (projectStatusRaw.length > 0 ? projectStatusRaw : initialDashboardData.project_status).map((d: any, idx: number) => ({
    id: d.id ?? idx + 1,
    status_name: d.status_name ?? d.statusName ?? 'Status',
    project_count: Number(d.project_count ?? d.projectCount ?? 0),
    percentage: Number(d.percentage ?? 0),
    color_hex: d.color_hex ?? d.colorHex ?? '#10B981',
    sort_order: Number(d.sort_order ?? d.sortOrder ?? idx + 1),
  }));

  const peopleMonthlyRaw = getArray('people_monthly', 'peopleMonthly');
  const people_monthly = (peopleMonthlyRaw.length > 0 ? peopleMonthlyRaw : initialDashboardData.people_monthly).map((d: any, idx: number) => ({
    id: d.id ?? idx + 1,
    month_name: d.month_name ?? d.monthName ?? `M${idx + 1}`,
    employee_count: Number(d.employee_count ?? d.employeeCount ?? 0),
    net_payroll: Number(d.net_payroll ?? d.netPayroll ?? 0),
    employer_payroll_cost: Number(d.employer_payroll_cost ?? d.employerPayrollCost ?? 0),
    sort_order: Number(d.sort_order ?? d.sortOrder ?? idx + 1),
  }));

  const peopleSummaryRaw = raw.people_summary ?? raw.peopleSummary ?? initialDashboardData.people_summary;
  const people_summary = {
    id: peopleSummaryRaw?.id ?? 1,
    active_employees: Number(peopleSummaryRaw?.active_employees ?? peopleSummaryRaw?.activeEmployees ?? initialDashboardData.people_summary.active_employees),
    new_joiners_ytd: Number(peopleSummaryRaw?.new_joiners_ytd ?? peopleSummaryRaw?.newJoinersYtd ?? initialDashboardData.people_summary.new_joiners_ytd),
    exits_ytd: Number(peopleSummaryRaw?.exits_ytd ?? peopleSummaryRaw?.exitsYtd ?? initialDashboardData.people_summary.exits_ytd),
    net_growth: Number(peopleSummaryRaw?.net_growth ?? peopleSummaryRaw?.netGrowth ?? initialDashboardData.people_summary.net_growth),
  };

  const alertsRaw = getArray('alerts', 'alerts');
  const alerts = (alertsRaw.length > 0 ? alertsRaw : initialDashboardData.alerts).map((a: any, idx: number) => ({
    id: a.id ?? idx + 1,
    alert_key: a.alert_key ?? a.alertKey ?? `alert_${idx}`,
    title: a.title ?? 'Alert',
    alert_count: Number(a.alert_count ?? a.alertCount ?? 0),
    icon_type: a.icon_type ?? a.iconType ?? 'alert',
    icon_color: a.icon_color ?? a.iconColor ?? '#EF4444',
    sort_order: Number(a.sort_order ?? a.sortOrder ?? idx + 1),
  }));

  const kpisRaw = getArray('kpis', 'kpis');
  const kpis = (kpisRaw.length > 0 ? kpisRaw : initialDashboardData.kpis).map((k: any, idx: number) => ({
    id: k.id ?? idx + 1,
    card_key: k.card_key ?? k.cardKey ?? `kpi_${idx}`,
    title: k.title ?? 'KPI',
    raw_value: Number(k.raw_value ?? k.rawValue ?? 0),
    formatted_value: String(k.formatted_value ?? k.formattedValue ?? '0'),
    change_percentage: Number(k.change_percentage ?? k.changePercentage ?? 0),
    change_type: k.change_type ?? k.changeType ?? 'neutral',
    comparison_text: k.comparison_text ?? k.comparisonText ?? 'vs last month',
    icon_type: k.icon_type ?? k.iconType ?? 'dollar',
    color_theme: k.color_theme ?? k.colorTheme ?? 'emerald',
    sort_order: Number(k.sort_order ?? k.sortOrder ?? idx + 1),
  }));

  const settingsRaw = raw.settings ?? initialDashboardData.settings;
  const settings = {
    company_name: settingsRaw?.company_name ?? settingsRaw?.companyName ?? initialDashboardData.settings.company_name,
    dashboard_title: settingsRaw?.dashboard_title ?? settingsRaw?.dashboardTitle ?? initialDashboardData.settings.dashboard_title,
    dashboard_subtitle: settingsRaw?.dashboard_subtitle ?? settingsRaw?.dashboardSubtitle ?? initialDashboardData.settings.dashboard_subtitle,
    active_date_range: settingsRaw?.active_date_range ?? settingsRaw?.activeDateRange ?? initialDashboardData.settings.active_date_range,
    last_updated: settingsRaw?.last_updated ?? settingsRaw?.lastUpdated ?? initialDashboardData.settings.last_updated,
    user_name: settingsRaw?.user_name ?? settingsRaw?.userName ?? initialDashboardData.settings.user_name,
    user_role: settingsRaw?.user_role ?? settingsRaw?.userRole ?? initialDashboardData.settings.user_role,
  };

  return {
    settings,
    kpis,
    finance_monthly,
    expense_breakdown,
    sales_pipeline,
    project_status,
    people_monthly,
    people_summary,
    alerts,
  };
}

export const dashboardService = {
  // Fetch dashboard data
  async getDashboardData(): Promise<FullDashboardData> {
    // 1. Try fetching from Backend / Supabase API
    try {
      const response = await fetch(`${BACKEND_API_URL}/dashboard/ceo`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const rawData = await response.json();
        const normalized = normalizeDashboardData(rawData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    } catch (err) {
      console.warn('Backend API fetch failed, trying local fallback:', err);
    }

    // 2. Check Local Storage
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const normalized = normalizeDashboardData(parsed);
        return normalized;
      } catch (e) {
        // parsing error
      }
    }

    // 3. Fallback to Initial Database Seed
    return initialDashboardData;
  },

  // Save/Update full dashboard data
  async saveDashboardData(data: FullDashboardData): Promise<void> {
    const normalized = normalizeDashboardData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    try {
      await fetch(`${BACKEND_API_URL}/dashboard/ceo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      });
    } catch (err) {
      console.warn('API server not responding, data saved locally:', err);
    }
  },

  // Update specific alert count
  async updateAlertCount(alertId: number, delta: number): Promise<FullDashboardData> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/dashboard/ceo/alerts/${alertId}?delta=${delta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });

      if (response.ok) {
        const rawUpdated = await response.json();
        const normalized = normalizeDashboardData(rawUpdated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    } catch (err) {
      console.warn('API alert update failed, updating locally:', err);
    }

    const current = await this.getDashboardData();
    const updatedAlerts = current.alerts.map((a) => {
      if (a.id === alertId) {
        return { ...a, alert_count: Math.max(0, a.alert_count + delta) };
      }
      return a;
    });

    const updatedData: FullDashboardData = {
      ...current,
      alerts: updatedAlerts
    };

    await this.saveDashboardData(updatedData);
    return updatedData;
  }
};
