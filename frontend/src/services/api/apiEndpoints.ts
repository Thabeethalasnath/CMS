const rawEnvUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL;
const API_BASE_URL = rawEnvUrl && rawEnvUrl.trim() !== '' ? rawEnvUrl.trim() : '/api/v1';

export const API_ENDPOINTS = {
  FOLLOW_UP_QUEUE: {
    BASE: '/follow-up-queue',
    SUMMARY: '/follow-up-queue/summary',
    BY_ID: (id: string | number) => `/follow-up-queue/${id}`,
    TOGGLE_DONE: (id: string | number) => `/follow-up-queue/${id}/toggle-done`,
    ACTION: (id: string | number) => `/follow-up-queue/${id}/action`,
    RESET: '/follow-up-queue/reset',
  },
  OPPORTUNITIES: {
    BASE: '/opportunities',
    SUMMARY: '/opportunities/summary',
    BY_ID: (id: string | number) => `/opportunities/${id}`,
    RESET: '/opportunities/reset',
  },
  CONTRACTS: {
    BASE: '/contracts',
    SUMMARY: '/contracts/summary',
    BY_ID: (id: string | number) => `/contracts/${id}`,
    RESET: '/contracts/reset',
  },
  EMPLOYEES: {
    BASE: '/employees',
    SUMMARY: '/employees/summary',
    BY_ID: (id: string | number) => `/employees/${id}`,
  },
  APPROVALS: {
    BASE: '/approvals',
    EMPLOYEE_STATUS: (id: string | number) => `/approvals/employee/${id}/status`,
    CLIENT_STATUS: (id: string | number) => `/approvals/client/${id}/status`,
    TICKET_ASSET_STATUS: (id: string | number) => `/approvals/ticket-asset/${id}/status`,
    EMPLOYEE: '/approvals/employee',
    CLIENT: '/approvals/client',
    TICKET_ASSET: '/approvals/ticket-asset',
    RESET: '/approvals/reset',
  },
  COLLECTIONS: {
    INVOICES: '/collections/invoices',
    INVOICE_BY_ID: (id: string) => `/collections/invoices/${encodeURIComponent(id)}`,
    UPDATE_STATUS: (id: string) => `/collections/invoices/${encodeURIComponent(id)}/status`,
    PAYMENTS: (id: string) => `/collections/invoices/${encodeURIComponent(id)}/payments`,
    KPIS: '/collections/kpis',
    CHART_AGEING: '/collections/charts/ageing',
    CHART_STATUS: '/collections/charts/status-distribution',
    CLIENTS: '/collections/clients',
    NEXT_ID: (year?: number) => (year ? `/collections/invoices/next-id?year=${year}` : '/collections/invoices/next-id'),
    REMINDER: (id: string) => `/collections/invoices/${encodeURIComponent(id)}/reminders`,
    COMMUNICATIONS: (id: string) => `/collections/invoices/${encodeURIComponent(id)}/communications`,
  },
  PROPOSALS: {
    BASE: '/proposals',
    BY_ID: (id: string) => `/proposals/${encodeURIComponent(id)}`,
    STATUS: (id: string) => `/proposals/${encodeURIComponent(id)}/status`,
    KPIS: '/proposals/kpis',
    EXPORT: '/proposals/export',
    NEXT_ID: '/proposals/next-id',
    FILTERS: '/proposals/filters',
  },
  LEADS: {
    BASE: '/leads',
    SUMMARY: '/leads/summary',
    BY_ID: (id: string | number) => `/leads/${encodeURIComponent(String(id))}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string | number) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
  LEAVES: {
    BASE: '/leaves',
    METRICS: '/leaves/metrics',
    BY_ID: (id: string | number) => `/leaves/${encodeURIComponent(String(id))}`,
  },
  ATTENDANCE: {
    BASE: '/attendance',
    METRICS: '/attendance/metrics',
    BY_ID: (id: string | number) => `/attendance/${encodeURIComponent(String(id))}`,
  },
  CLIENTS_RESOURCE: {
    BASE: '/clients',
    BY_ID: (id: string | number) => `/clients/${encodeURIComponent(String(id))}`,
  },
};
