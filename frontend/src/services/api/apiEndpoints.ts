const rawEnvUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL;
const API_BASE_URL = rawEnvUrl && rawEnvUrl.trim() !== '' ? rawEnvUrl.trim() : '/api/v1';

export const API_ENDPOINTS = {
  COLLECTIONS: {
    INVOICES: `${API_BASE_URL}/collections/invoices`,
    INVOICE_BY_ID: (id: string) => `${API_BASE_URL}/collections/invoices/${encodeURIComponent(id)}`,
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/collections/invoices/${encodeURIComponent(id)}/status`,
    PAYMENTS: (id: string) => `${API_BASE_URL}/collections/invoices/${encodeURIComponent(id)}/payments`,
    KPIS: `${API_BASE_URL}/collections/kpis`,
    CHART_AGEING: `${API_BASE_URL}/collections/charts/ageing`,
    CHART_STATUS: `${API_BASE_URL}/collections/charts/status-distribution`,
    CLIENTS: `${API_BASE_URL}/collections/clients`,
    NEXT_ID: (year?: number) => year ? `${API_BASE_URL}/collections/invoices/next-id?year=${year}` : `${API_BASE_URL}/collections/invoices/next-id`,
  },
  PROPOSALS: {
    BASE: `${API_BASE_URL}/proposals`,
    BY_ID: (id: string) => `${API_BASE_URL}/proposals/${encodeURIComponent(id)}`,
    STATUS: (id: string) => `${API_BASE_URL}/proposals/${encodeURIComponent(id)}/status`,
    KPIS: `${API_BASE_URL}/proposals/kpis`,
    EXPORT: `${API_BASE_URL}/proposals/export`,
    NEXT_ID: `${API_BASE_URL}/proposals/next-id`,
    FILTERS: `${API_BASE_URL}/proposals/filters`,
  },
};

