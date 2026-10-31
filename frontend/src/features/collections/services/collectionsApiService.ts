import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/services/api/apiEndpoints';
import { triggerNotificationRefresh } from '@/services/notificationService';
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

export interface SendReminderPayload {
  template: string;
  channels: { email: boolean; whatsapp: boolean; sms: boolean };
  recipient?: string;
  notes?: string;
}

export interface LogCommunicationPayload {
  communicationType: string;
  recipient?: string;
  subject?: string;
  message?: string;
  loggedBy?: string;
}

export const collectionsApiService = {
  // 1. Fetch paginated, filtered invoices
  async getInvoices(params: InvoiceQueryParams = {}): Promise<PageResponse<Invoice>> {
    const queryParams: Record<string, string | number> = {};
    if (params.search) queryParams.search = params.search;
    if (params.client && params.client !== 'All Clients') queryParams.client = params.client;
    if (params.status && params.status !== 'All Statuses') queryParams.status = params.status;
    if (params.ageing && params.ageing !== 'All Buckets') queryParams.ageing = params.ageing;
    if (params.sortField) queryParams.sortField = params.sortField;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;

    const res = await apiClient.get<PageResponse<Invoice>>(API_ENDPOINTS.COLLECTIONS.INVOICES, queryParams);
    return res.data;
  },

  // 2. Fetch single invoice
  async getInvoiceById(id: string): Promise<Invoice> {
    const res = await apiClient.get<Invoice>(API_ENDPOINTS.COLLECTIONS.INVOICE_BY_ID(id));
    return res.data;
  },

  // 3. Create manual invoice (Log Payment modal)
  async createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
    const res = await apiClient.post<Invoice>(API_ENDPOINTS.COLLECTIONS.INVOICES, payload);
    triggerNotificationRefresh();
    return res.data;
  },

  // 3b. Fetch suggested next invoice ID from backend
  async getNextInvoiceId(year?: number): Promise<{ nextInvoiceId: string; year: number; sequenceNumber: number; format: string }> {
    const res = await apiClient.get<{ nextInvoiceId: string; year: number; sequenceNumber: number; format: string }>(
      API_ENDPOINTS.COLLECTIONS.NEXT_ID(year)
    );
    return res.data;
  },

  // 4. Update invoice status
  async updateStatus(id: string, status: CollectionStatus): Promise<Invoice> {
    const res = await apiClient.patch<Invoice>(API_ENDPOINTS.COLLECTIONS.UPDATE_STATUS(id), { status });
    triggerNotificationRefresh();
    return res.data;
  },

  // 5. Fetch payment history for invoice
  async getPayments(invoiceId: string): Promise<PaymentRecord[]> {
    const res = await apiClient.get<PaymentRecord[]>(API_ENDPOINTS.COLLECTIONS.PAYMENTS(invoiceId));
    return res.data || [];
  },

  // 6. Record payment against invoice
  async recordPayment(invoiceId: string, payload: RecordPaymentPayload): Promise<PaymentRecord> {
    const res = await apiClient.post<PaymentRecord>(API_ENDPOINTS.COLLECTIONS.PAYMENTS(invoiceId), payload);
    triggerNotificationRefresh();
    return res.data;
  },

  // 6b. Send payment reminder
  async sendReminder(invoiceId: string, payload: SendReminderPayload): Promise<unknown> {
    const res = await apiClient.post(API_ENDPOINTS.COLLECTIONS.REMINDER(invoiceId), payload);
    return res.data;
  },

  // 6c. Log call/email communication
  async logCommunication(invoiceId: string, payload: LogCommunicationPayload): Promise<unknown> {
    const res = await apiClient.post(API_ENDPOINTS.COLLECTIONS.COMMUNICATIONS(invoiceId), payload);
    return res.data;
  },

  // 7. Fetch KPIs
  async getKpis(): Promise<KpiSummary> {
    const res = await apiClient.get<KpiSummary>(API_ENDPOINTS.COLLECTIONS.KPIS);
    return res.data;
  },

  // 8. Fetch Ageing Chart data
  async getAgeingChart(): Promise<AgeingChartItem[]> {
    const res = await apiClient.get<AgeingChartItem[]>(API_ENDPOINTS.COLLECTIONS.CHART_AGEING);
    return res.data || [];
  },

  // 9. Fetch Status Distribution
  async getStatusDistribution(): Promise<StatusDistributionItem[]> {
    const res = await apiClient.get<StatusDistributionItem[]>(API_ENDPOINTS.COLLECTIONS.CHART_STATUS);
    return res.data || [];
  },

  // 10. Fetch distinct clients
  async getClients(): Promise<string[]> {
    const res = await apiClient.get<string[]>(API_ENDPOINTS.COLLECTIONS.CLIENTS);
    return res.data || [];
  },
};
