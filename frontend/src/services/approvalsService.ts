import {
  EmployeeApproval,
  ClientApproval,
  TicketAssetApproval,
  ApprovalsSummary,
  ApprovalStatus
} from '../types/approvals';
import { apiClient } from './api/apiClient';
import { triggerNotificationRefresh } from './notificationService';

export interface AllApprovalsData {
  employees: EmployeeApproval[];
  clients: ClientApproval[];
  ticketsAssets: TicketAssetApproval[];
  summary: ApprovalsSummary;
  lastUpdated?: string;
}

export const approvalsService = {
  // Fetch approvals data directly from the Spring Boot API; errors propagate
  async fetchApprovalsData(): Promise<AllApprovalsData> {
    const response = await apiClient.get<any>('/approvals');
    const data = response.data || response;

    const employees: EmployeeApproval[] = data.employees || [];
    const clients: ClientApproval[] = data.clients || [];
    const ticketsAssets: TicketAssetApproval[] = data.ticketsAssets || [];

    const summary: ApprovalsSummary = data.summary || {
      total: employees.length + clients.length + ticketsAssets.length,
      pending: employees.filter(e => e.status === 'Pending').length +
               clients.filter(c => c.status === 'Pending').length +
               ticketsAssets.filter(t => t.status === 'Pending').length,
      approved: employees.filter(e => e.status === 'Approved').length +
                clients.filter(c => c.status === 'Approved').length +
                ticketsAssets.filter(t => t.status === 'Approved').length,
      rejected: employees.filter(e => e.status === 'Rejected').length +
                clients.filter(c => c.status === 'Rejected').length +
                ticketsAssets.filter(t => t.status === 'Rejected').length,
    };

    return {
      employees,
      clients,
      ticketsAssets,
      summary,
      lastUpdated: data.lastUpdated || data.serverTime || new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  },

  async updateEmployeeStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    await apiClient.put(`/approvals/employee/${id}/status`, { status });
    triggerNotificationRefresh();
    return await this.fetchApprovalsData();
  },

  async updateClientStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    await apiClient.put(`/approvals/client/${id}/status`, { status });
    triggerNotificationRefresh();
    return await this.fetchApprovalsData();
  },

  async updateTicketAssetStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    await apiClient.put(`/approvals/ticket-asset/${id}/status`, { status });
    triggerNotificationRefresh();
    return await this.fetchApprovalsData();
  },

  async addEmployeeRequest(
    data: Omit<EmployeeApproval, 'id' | 'applied_date' | 'status'>
  ): Promise<AllApprovalsData> {
    await apiClient.post('/approvals/employee', {
      ...data,
      status: 'Pending'
    });
    triggerNotificationRefresh();
    return await this.fetchApprovalsData();
  },

  async addClientRequest(
    data: Omit<ClientApproval, 'id' | 'approval_id' | 'request_date' | 'status'>
  ): Promise<AllApprovalsData> {
    // Backend generates approval_id and request_date
    await apiClient.post('/approvals/client', {
      ...data,
      status: 'Pending'
    });
    triggerNotificationRefresh();
    return await this.fetchApprovalsData();
  },

  async resetData(): Promise<AllApprovalsData> {
    await apiClient.post('/approvals/reset');
    return await this.fetchApprovalsData();
  }
};
