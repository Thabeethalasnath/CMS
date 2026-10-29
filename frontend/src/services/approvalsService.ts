import {
  EmployeeApproval,
  ClientApproval,
  TicketAssetApproval,
  ApprovalsSummary,
  ApprovalStatus
} from '../types/approvals';

const API_BASE = '/api/v1/approvals';

export interface AllApprovalsData {
  employees: EmployeeApproval[];
  clients: ClientApproval[];
  ticketsAssets: TicketAssetApproval[];
  summary: ApprovalsSummary;
}

export const approvalsService = {
  // Load all approvals directly from PostgreSQL DB
  async getApprovalsData(): Promise<AllApprovalsData> {
    const res = await fetch(API_BASE);
    if (!res.ok) {
      throw new Error(`Failed to fetch approvals from database: HTTP ${res.status}`);
    }
    const data: AllApprovalsData = await res.json();
    return data;
  },

  async updateEmployeeStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    const res = await fetch(`${API_BASE}/employee/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      throw new Error(`Failed to update employee approval status: HTTP ${res.status}`);
    }
    return this.getApprovalsData();
  },

  async updateClientStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    const res = await fetch(`${API_BASE}/client/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      throw new Error(`Failed to update client approval status: HTTP ${res.status}`);
    }
    return this.getApprovalsData();
  },

  async updateTicketAssetStatus(id: number, status: ApprovalStatus): Promise<AllApprovalsData> {
    const res = await fetch(`${API_BASE}/ticket-asset/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      throw new Error(`Failed to update ticket/asset approval status: HTTP ${res.status}`);
    }
    return this.getApprovalsData();
  },

  async addEmployeeRequest(
    data: Omit<EmployeeApproval, 'id' | 'applied_date' | 'status'>
  ): Promise<AllApprovalsData> {
    const res = await fetch(`${API_BASE}/employee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error(`Failed to create employee approval: HTTP ${res.status}`);
    }
    return this.getApprovalsData();
  },

  async addClientRequest(
    data: Omit<ClientApproval, 'id' | 'approval_id' | 'request_date' | 'status'>
  ): Promise<AllApprovalsData> {
    const res = await fetch(`${API_BASE}/client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error(`Failed to create client approval: HTTP ${res.status}`);
    }
    return this.getApprovalsData();
  }
};
