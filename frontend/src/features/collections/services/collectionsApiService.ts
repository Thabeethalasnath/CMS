import { apiRequest } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/services/api/apiEndpoints';
import {
  Invoice,
  PaymentRecord,
  KpiSummary,
  AgeingChartItem,
  StatusDistributionItem,
  CollectionStatus,
} from '../types';

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface InvoiceQueryParams {
  search?: string;
  client?: string;
  status?: string;
  ageing?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface CreateInvoicePayload {
  invoiceId: string;
  clientId?: string;
  client: string;
  invoiceDate: string;
  dueDate: string;
  outstanding: number;
  statusOverride?: string;
  autoAssignIfTaken?: boolean;
}

export interface RecordPaymentPayload {
  amount: number;
  paymentMethod?: string;
  referenceId?: string;
  notes?: string;
  paymentDate?: string;
}

export const collectionsApiService = {
  // 1. Fetch paginated, filtered invoices
  async getInvoices(params: InvoiceQueryParams = {}): Promise<PageResponse<Invoice>> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.client && params.client !== 'All Clients') query.set('client', params.client);
    if (params.status && params.status !== 'All Statuses') query.set('status', params.status);
    if (params.ageing && params.ageing !== 'All Buckets') query.set('ageing', params.ageing);
    if (params.sortField) query.set('sortField', params.sortField);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));

    const url = `${API_ENDPOINTS.COLLECTIONS.INVOICES}?${query.toString()}`;
    return apiRequest<PageResponse<Invoice>>(url);
  },

  // 2. Fetch single invoice
  async getInvoiceById(id: string): Promise<Invoice> {
    return apiRequest<Invoice>(API_ENDPOINTS.COLLECTIONS.INVOICE_BY_ID(id));
  },

  // 3. Create manual invoice (Log Payment modal)
  async createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
    return apiRequest<Invoice>(API_ENDPOINTS.COLLECTIONS.INVOICES, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 3b. Fetch suggested next invoice ID from Supabase PostgreSQL
  async getNextInvoiceId(year?: number): Promise<{ nextInvoiceId: string; year: number; sequenceNumber: number; format: string }> {
    return apiRequest<{ nextInvoiceId: string; year: number; sequenceNumber: number; format: string }>(
      API_ENDPOINTS.COLLECTIONS.NEXT_ID(year)
    );
  },

  // 4. Update invoice status
  async updateStatus(id: string, status: CollectionStatus): Promise<Invoice> {
    return apiRequest<Invoice>(API_ENDPOINTS.COLLECTIONS.UPDATE_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // 5. Fetch payment history for invoice
  async getPayments(invoiceId: string): Promise<PaymentRecord[]> {
    return apiRequest<PaymentRecord[]>(API_ENDPOINTS.COLLECTIONS.PAYMENTS(invoiceId));
  },

  // 6. Record payment against invoice
  async recordPayment(invoiceId: string, payload: RecordPaymentPayload): Promise<PaymentRecord> {
    return apiRequest<PaymentRecord>(API_ENDPOINTS.COLLECTIONS.PAYMENTS(invoiceId), {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 7. Fetch KPIs
  async getKpis(): Promise<KpiSummary> {
    return apiRequest<KpiSummary>(API_ENDPOINTS.COLLECTIONS.KPIS);
  },

  // 8. Fetch Ageing Chart data
  async getAgeingChart(): Promise<AgeingChartItem[]> {
    return apiRequest<AgeingChartItem[]>(API_ENDPOINTS.COLLECTIONS.CHART_AGEING);
  },

  // 9. Fetch Status Distribution
  async getStatusDistribution(): Promise<StatusDistributionItem[]> {
    return apiRequest<StatusDistributionItem[]>(API_ENDPOINTS.COLLECTIONS.CHART_STATUS);
  },

  // 10. Fetch distinct clients
  async getClients(): Promise<string[]> {
    return apiRequest<string[]>(API_ENDPOINTS.COLLECTIONS.CLIENTS);
  },
};
