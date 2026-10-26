import { FullDashboardData } from '../types/dashboard';

export const initialDashboardData: FullDashboardData = {
  settings: {
    company_name: 'KALPANAAA SOFTWARE SOLUTIONS',
    dashboard_title: 'CEO Dashboard',
    dashboard_subtitle: 'Executive view of business performance across Finance, Sales, Delivery, People and Risk.',
    active_date_range: 'Apr 2024 - Mar 2025',
    last_updated: '15 Mar 2025, 10:30 AM',
    user_name: 'Akshit Ujjain',
    user_role: 'CEO'
  },
  kpis: [
    {
      id: 1,
      card_key: 'revenue_invoice_value',
      title: 'Revenue | Invoice Value',
      raw_value: 12450000,
      formatted_value: '₹ 1,24,50,000',
      change_percentage: 12,
      change_type: 'positive',
      comparison_text: 'vs last period',
      icon_type: 'receipt',
      color_theme: 'emerald',
      sort_order: 1
    },
    {
      id: 2,
      card_key: 'outstanding_receivables',
      title: 'Outstanding Receivables',
      raw_value: 2840000,
      formatted_value: '₹ 28,40,000',
      change_percentage: 8,
      change_type: 'positive',
      comparison_text: 'vs last period',
      icon_type: 'document',
      color_theme: 'sky',
      sort_order: 2
    },
    {
      id: 3,
      card_key: 'collected_payments',
      title: 'Collected Payments',
      raw_value: 9610000,
      formatted_value: '₹ 96,10,000',
      change_percentage: 18,
      change_type: 'positive',
      comparison_text: 'vs last period',
      icon_type: 'dollar',
      color_theme: 'purple',
      sort_order: 3
    },
    {
      id: 4,
      card_key: 'total_expenses',
      title: 'Total Expenses',
      raw_value: 4230000,
      formatted_value: '₹ 42,30,000',
      change_percentage: 6,
      change_type: 'negative',
      comparison_text: 'vs last period',
      icon_type: 'invoice',
      color_theme: 'rose',
      sort_order: 4
    },
    {
      id: 5,
      card_key: 'estimated_project_profit',
      title: 'Estimated Project Profit',
      raw_value: 3820000,
      formatted_value: '₹ 38,20,000',
      change_percentage: 15,
      change_type: 'positive',
      comparison_text: 'vs last period',
      icon_type: 'profit',
      color_theme: 'amber',
      sort_order: 5
    },
    {
      id: 6,
      card_key: 'weighted_sales_pipeline',
      title: 'Weighted Sales Pipeline',
      raw_value: 27560000,
      formatted_value: '₹ 2,75,60,000',
      change_percentage: 20,
      change_type: 'positive',
      comparison_text: 'vs last period',
      icon_type: 'pipeline',
      color_theme: 'indigo',
      sort_order: 6
    },
    {
      id: 7,
      card_key: 'active_projects',
      title: 'Active Projects',
      raw_value: 12,
      formatted_value: '12',
      change_percentage: 9,
      change_type: 'positive',
      comparison_text: 'vs last period',
      icon_type: 'briefcase',
      color_theme: 'violet',
      sort_order: 7
    },
    {
      id: 8,
      card_key: 'active_employees',
      title: 'Active Employees',
      raw_value: 48,
      formatted_value: '48',
      change_percentage: 4,
      change_type: 'positive',
      comparison_text: 'vs last period',
      icon_type: 'users',
      color_theme: 'teal',
      sort_order: 8
    },
    {
      id: 9,
      card_key: 'net_payroll',
      title: 'Net Payroll',
      raw_value: 1890000,
      formatted_value: '₹ 18,90,000',
      change_percentage: -5,
      change_type: 'negative',
      comparison_text: 'vs last period',
      icon_type: 'cash',
      color_theme: 'pink',
      sort_order: 9
    },
    {
      id: 10,
      card_key: 'employer_payroll_cost',
      title: 'Employer Payroll Cost',
      raw_value: 2340000,
      formatted_value: '₹ 23,40,000',
      change_percentage: 6,
      change_type: 'negative',
      comparison_text: 'vs last period',
      icon_type: 'shield',
      color_theme: 'blue',
      sort_order: 10
    }
  ],
  finance_monthly: [
    { id: 1, month_name: 'Oct', invoice_value: 1800000, collected_payments: 1400000, outstanding_receivables: 2200000, expenses: 600000, sort_order: 1 },
    { id: 2, month_name: 'Nov', invoice_value: 2100000, collected_payments: 1650000, outstanding_receivables: 2450000, expenses: 680000, sort_order: 2 },
    { id: 3, month_name: 'Dec', invoice_value: 1950000, collected_payments: 1500000, outstanding_receivables: 2100000, expenses: 620000, sort_order: 3 },
    { id: 4, month_name: 'Jan', invoice_value: 2300000, collected_payments: 1850000, outstanding_receivables: 2600000, expenses: 740000, sort_order: 4 },
    { id: 5, month_name: 'Feb', invoice_value: 2200000, collected_payments: 1750000, outstanding_receivables: 2750000, expenses: 780000, sort_order: 5 },
    { id: 6, month_name: 'Mar', invoice_value: 2500000, collected_payments: 2100000, outstanding_receivables: 2840000, expenses: 810000, sort_order: 6 }
  ],
  expense_breakdown: [
    { id: 1, category_name: 'Salaries', percentage: 45, amount: 1903500, color_hex: '#2563eb', sort_order: 1 },
    { id: 2, category_name: 'Operations', percentage: 20, amount: 846000, color_hex: '#06b6d4', sort_order: 2 },
    { id: 3, category_name: 'Software & Tools', percentage: 15, amount: 634500, color_hex: '#f59e0b', sort_order: 3 },
    { id: 4, category_name: 'Travel & Admin', percentage: 10, amount: 423000, color_hex: '#ea580c', sort_order: 4 },
    { id: 5, category_name: 'Others', percentage: 10, amount: 423000, color_hex: '#e11d48', sort_order: 5 }
  ],
  sales_pipeline: [
    { id: 1, stage_name: 'Leads', lead_count: 120, conversion_rate: 100, color_hex: '#1d4ed8', sort_order: 1 },
    { id: 2, stage_name: 'Opportunities', lead_count: 95, conversion_rate: 79, color_hex: '#06b6d4', sort_order: 2 },
    { id: 3, stage_name: 'Proposals', lead_count: 60, conversion_rate: 50, color_hex: '#f59e0b', sort_order: 3 },
    { id: 4, stage_name: 'Contracts', lead_count: 42, conversion_rate: 35, color_hex: '#ea580c', sort_order: 4 }
  ],
  project_status: [
    { id: 1, status_name: 'Planning', project_count: 2, percentage: 17, color_hex: '#3b82f6', sort_order: 1 },
    { id: 2, status_name: 'In Progress', project_count: 6, percentage: 50, color_hex: '#10b981', sort_order: 2 },
    { id: 3, status_name: 'UAT', project_count: 2, percentage: 17, color_hex: '#f59e0b', sort_order: 3 },
    { id: 4, status_name: 'Deployment', project_count: 1, percentage: 8, color_hex: '#8b5cf6', sort_order: 4 },
    { id: 5, status_name: 'On Hold', project_count: 1, percentage: 8, color_hex: '#ef4444', sort_order: 5 }
  ],
  people_monthly: [
    { id: 1, month_name: 'Oct', employee_count: 42, net_payroll: 1600000, employer_payroll_cost: 1950000, sort_order: 1 },
    { id: 2, month_name: 'Nov', employee_count: 44, net_payroll: 1650000, employer_payroll_cost: 2020000, sort_order: 2 },
    { id: 3, month_name: 'Dec', employee_count: 45, net_payroll: 1700000, employer_payroll_cost: 2100000, sort_order: 3 },
    { id: 4, month_name: 'Jan', employee_count: 46, net_payroll: 1750000, employer_payroll_cost: 2180000, sort_order: 4 },
    { id: 5, month_name: 'Feb', employee_count: 47, net_payroll: 1820000, employer_payroll_cost: 2260000, sort_order: 5 },
    { id: 6, month_name: 'Mar', employee_count: 48, net_payroll: 1890000, employer_payroll_cost: 2340000, sort_order: 6 }
  ],
  people_summary: {
    id: 1,
    active_employees: 48,
    new_joiners_ytd: 6,
    exits_ytd: 2,
    net_growth: 4
  },
  alerts: [
    { id: 1, alert_key: 'overdue_invoices', title: 'Overdue Invoices', alert_count: 0, icon_type: 'invoice', icon_color: '#ef4444', sort_order: 1 },
    { id: 2, alert_key: 'contracts_expiring', title: 'Contracts Expiring', alert_count: 0, icon_type: 'contract', icon_color: '#f59e0b', sort_order: 2 },
    { id: 3, alert_key: 'overdue_projects', title: 'Overdue Projects', alert_count: 0, icon_type: 'project', icon_color: '#06b6d4', sort_order: 3 },
    { id: 4, alert_key: 'overdue_compliance', title: 'Overdue Compliance', alert_count: 0, icon_type: 'compliance', icon_color: '#10b981', sort_order: 4 },
    { id: 5, alert_key: 'expiring_documents', title: 'Expiring Documents', alert_count: 0, icon_type: 'doc_expiring', icon_color: '#8b5cf6', sort_order: 5 },
    { id: 6, alert_key: 'expired_documents', title: 'Expired Documents', alert_count: 0, icon_type: 'doc_expired', icon_color: '#ef4444', sort_order: 6 },
    { id: 7, alert_key: 'expired_warranties', title: 'Expired Warranties', alert_count: 0, icon_type: 'warranty', icon_color: '#f97316', sort_order: 7 },
    { id: 8, alert_key: 'pending_approvals', title: 'Pending Approvals', alert_count: 0, icon_type: 'approval_pending', icon_color: '#3b82f6', sort_order: 8 },
    { id: 9, alert_key: 'overdue_approvals', title: 'Overdue Approvals', alert_count: 0, icon_type: 'approval_overdue', icon_color: '#dc2626', sort_order: 9 },
    { id: 10, alert_key: 'candidate_followups', title: 'Candidate Follow-ups', alert_count: 0, icon_type: 'candidate', icon_color: '#a855f7', sort_order: 10 }
  ]
};
