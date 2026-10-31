export interface KpiCard {
  id: number;
  card_key: string;
  title: string;
  raw_value: number;
  formatted_value: string;
  change_percentage: number;
  change_type: 'positive' | 'negative' | 'neutral';
  comparison_text: string;
  icon_type: string;
  color_theme: string;
  sort_order: number;
}

export interface FinanceMonthlyRecord {
  id: number;
  month_name: string;
  invoice_value: number;
  collected_payments: number;
  outstanding_receivables: number;
  expenses: number;
  sort_order: number;
}

export interface ExpenseBreakdownItem {
  id: number;
  category_name: string;
  percentage: number;
  amount: number;
  color_hex: string;
  sort_order: number;
}

export interface SalesPipelineStage {
  id: number;
  stage_name: string;
  lead_count: number;
  conversion_rate: number;
  color_hex: string;
  sort_order: number;
}

export interface ProjectStatusItem {
  id: number;
  status_name: string;
  project_count: number;
  percentage: number;
  color_hex: string;
  sort_order: number;
}

export interface PeopleMonthlyRecord {
  id: number;
  month_name: string;
  employee_count: number;
  net_payroll: number;
  employer_payroll_cost: number;
  sort_order: number;
}

export interface PeopleSummary {
  id: number;
  active_employees: number;
  new_joiners_ytd: number;
  exits_ytd: number;
  net_growth: number;
}

export interface ManagementAlertItem {
  id: number;
  alert_key: string;
  title: string;
  alert_count: number;
  icon_type: string;
  icon_color: string;
  sort_order: number;
}

export interface DashboardSettings {
  company_name: string;
  dashboard_title: string;
  dashboard_subtitle: string;
  active_date_range: string;
  last_updated: string;
  user_name: string;
  user_role: string;
}

export interface FullDashboardData {
  settings: DashboardSettings;
  kpis: KpiCard[];
  finance_monthly: FinanceMonthlyRecord[];
  expense_breakdown: ExpenseBreakdownItem[];
  sales_pipeline: SalesPipelineStage[];
  project_status: ProjectStatusItem[];
  people_monthly: PeopleMonthlyRecord[];
  people_summary: PeopleSummary;
  alerts: ManagementAlertItem[];
}

export type DashboardKpiCard = KpiCard;
