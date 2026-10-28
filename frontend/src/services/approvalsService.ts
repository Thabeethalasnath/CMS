import {
  EmployeeApproval,
  ClientApproval,
  TicketAssetApproval,
  ApprovalsSummary,
  ApprovalStatus
} from '../types/approvals';
import {
  initialEmployeeApprovals,
  initialClientApprovals,
  initialTicketAssetApprovals
} from '../constants/initialApprovalsData';
import { apiClient } from './api/apiClient';

const EMP_KEY = 'kalpanaaa_cms_employee_approvals';
const CLIENT_KEY = 'kalpanaaa_cms_client_approvals';
const TICKET_KEY = 'kalpanaaa_cms_ticket_asset_approvals';

export interface AllApprovalsData {
  employees: EmployeeApproval[];
  clients: ClientApproval[];
  ticketsAssets: TicketAssetApproval[];
  summary: ApprovalsSummary;
}

export const approvalsService = {
  // Load all approvals from backend API, with fallback to cache/local
  async fetchApprovalsData(): Promise<AllApprovalsData> {
    try {
      const response = await apiClient.get<any>('/approvals');
      const data = response.data || response;
      if (data && (data.employees || data.clients || data.ticketsAssets)) {
        // Cache in localStorage for offline resiliency
        try {
          if (data.employees) localStorage.setItem(EMP_KEY, JSON.stringify(data.employees));
          if (data.clients) localStorage.setItem(CLIENT_KEY, JSON.stringify(data.clients));
          if (data.ticketsAssets) localStorage.setItem(TICKET_KEY, JSON.stringify(data.ticketsAssets));
        } catch {}
        return {
          employees: data.employees || [],
          clients: data.clients || [],
          ticketsAssets: data.ticketsAssets || [],
          summary: data.summary || {
            total: (data.employees?.length || 0) + (data.clients?.length || 0) + (data.ticketsAssets?.length || 0),
            pending: 0,
            approved: 0,
            rejected: 0
          }
        };
      }
    } catch {
      // Fallback cleanly to local cache
    }
    return this.getApprovalsData();
  },

  // Synchronous fallback loader
  getApprovalsData(): AllApprovalsData {
    let employees = initialEmployeeApprovals;
    let clients = initialClientApprovals;
    let ticketsAssets = initialTicketAssetApprovals;

    try {
      const storedEmp = localStorage.getItem(EMP_KEY);
      if (storedEmp) employees = JSON.parse(storedEmp);

      const storedClient = localStorage.getItem(CLIENT_KEY);
      if (storedClient) clients = JSON.parse(storedClient);

      const storedTicket = localStorage.getItem(TICKET_KEY);
      if (storedTicket) ticketsAssets = JSON.parse(storedTicket);
    } catch (e) {
      console.warn('Failed to parse cached approvals:', e);
    }

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    [...employees, ...clients, ...ticketsAssets].forEach((item) => {
      if (item.status === 'Pending') pendingCount++;
      else if (item.status === 'Approved') approvedCount++;
      else if (item.status === 'Rejected') rejectedCount++;
    });

    const finalTotal = employees.length + clients.length + ticketsAssets.length;

    return {
      employees,
      clients,
      ticketsAssets,
      summary: {
        total: finalTotal,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      }
    };
  },

  async updateEmployeeStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    try {
      await apiClient.put(`/approvals/employee/${id}/status`, { status });
      return await this.fetchApprovalsData();
    } catch {
      const current = this.getApprovalsData();
      const updated = current.employees.map((e) => (e.id === id ? { ...e, status } : e));
      localStorage.setItem(EMP_KEY, JSON.stringify(updated));
      return this.getApprovalsData();
    }
  },

  async updateClientStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    try {
      await apiClient.put(`/approvals/client/${id}/status`, { status });
      return await this.fetchApprovalsData();
    } catch {
      const current = this.getApprovalsData();
      const updated = current.clients.map((c) => (c.id === id ? { ...c, status } : c));
      localStorage.setItem(CLIENT_KEY, JSON.stringify(updated));
      return this.getApprovalsData();
    }
  },

  async updateTicketAssetStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    try {
      await apiClient.put(`/approvals/ticket-asset/${id}/status`, { status });
      return await this.fetchApprovalsData();
    } catch {
      const current = this.getApprovalsData();
      const updated = current.ticketsAssets.map((t) => (t.id === id ? { ...t, status } : t));
      localStorage.setItem(TICKET_KEY, JSON.stringify(updated));
      return this.getApprovalsData();
    }
  },

  async addEmployeeRequest(
    data: Omit<EmployeeApproval, 'id' | 'applied_date' | 'status'>
  ): Promise<AllApprovalsData> {
    try {
      const now = new Date();
      const applied_date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      await apiClient.post('/approvals/employee', {
        ...data,
        applied_date,
        status: 'Pending'
      });
      return await this.fetchApprovalsData();
    } catch {
      const current = this.getApprovalsData();
      const now = new Date();
      const applied_date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const newRecord: EmployeeApproval = {
        ...data,
        id: Date.now(),
        applied_date,
        status: 'Pending'
      };
      const updated = [newRecord, ...current.employees];
      localStorage.setItem(EMP_KEY, JSON.stringify(updated));
      return this.getApprovalsData();
    }
  },

  async addClientRequest(
    data: Omit<ClientApproval, 'id' | 'approval_id' | 'request_date' | 'status'>
  ): Promise<AllApprovalsData> {
    try {
      const now = new Date();
      const request_date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      await apiClient.post('/approvals/client', {
        ...data,
        request_date,
        status: 'Pending'
      });
      return await this.fetchApprovalsData();
    } catch {
      const current = this.getApprovalsData();
      const now = new Date();
      const request_date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const nextNum = String(current.clients.length + 1).padStart(3, '0');
      const newRecord: ClientApproval = {
        ...data,
        id: Date.now(),
        approval_id: `APP-2025-${nextNum}`,
        request_date,
        status: 'Pending'
      };
      const updated = [newRecord, ...current.clients];
      localStorage.setItem(CLIENT_KEY, JSON.stringify(updated));
      return this.getApprovalsData();
    }
  },

  async resetData(): Promise<AllApprovalsData> {
    try {
      await apiClient.post('/approvals/reset');
      localStorage.removeItem(EMP_KEY);
      localStorage.removeItem(CLIENT_KEY);
      localStorage.removeItem(TICKET_KEY);
      return await this.fetchApprovalsData();
    } catch {
      localStorage.removeItem(EMP_KEY);
      localStorage.removeItem(CLIENT_KEY);
      localStorage.removeItem(TICKET_KEY);
      return this.getApprovalsData();
    }
  }
};
