import { Client, ClientsMetrics } from '../types/clients';

const PRIMARY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const FALLBACK_URL = '/api/v1';

async function requestWithFallback(endpoint: string, options?: RequestInit): Promise<Response> {
  try {
    const res = await fetch(`${PRIMARY_URL}${endpoint}`, options);
    if (res.ok) return res;
    console.warn(`[ClientsService] ${PRIMARY_URL}${endpoint} returned ${res.status}, attempting fallback to ${FALLBACK_URL}${endpoint}`);
  } catch (err) {
    console.warn(`[ClientsService] ${PRIMARY_URL}${endpoint} failed, falling back to ${FALLBACK_URL}${endpoint}:`, err);
  }

  // Gracefully fallback to Vite local DB proxy
  return fetch(`${FALLBACK_URL}${endpoint}`, options);
}

function mapClient(item: any): Client {
  return {
    id: item.id,
    clientCode: item.clientCode || item.client_code || `CL-${String(item.id || '').replace('C-', '')}`,
    clientName: item.clientName || item.client_name || 'Unnamed Client',
    companyName: item.companyName || item.company_name || 'Company Name',
    industry: item.industry || 'IT Services',
    contactPerson: item.contactPerson || item.contact_person || 'Contact Person',
    email: item.email || '',
    phone: item.phone || '',
    country: item.country || 'India',
    city: item.city || 'Bangalore',
    clientType: item.clientType || item.client_type || 'Enterprise',
    accountOwner: item.accountOwner || item.account_owner || 'Akshit Ujjain',
    status: item.status || 'Active',
    creditLimit: item.creditLimit || item.credit_limit || '₹ 10,00,000',
    onboardingDate: item.onboardingDate || item.onboarding_date || '15 Jan 2024',
    notes: item.notes || '',
    createdAt: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
  };
}

export const clientsService = {
  async getClients(): Promise<Client[]> {
    const res = await requestWithFallback('/clients');
    if (!res.ok) {
      throw new Error(`Failed to fetch clients: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid clients data format received');
    }
    return data.map(mapClient);
  },

  async getClientById(id: string): Promise<Client> {
    const res = await requestWithFallback(`/clients/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch client ${id}: HTTP ${res.status}`);
    }
    const data = await res.json();
    return mapClient(data);
  },

  async createClient(client: Partial<Client>): Promise<Client> {
    const res = await requestWithFallback('/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!res.ok) {
      throw new Error(`Failed to create client: HTTP ${res.status}`);
    }
    const data = await res.json();
    return mapClient(data);
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const res = await requestWithFallback(`/clients/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error(`Failed to update client ${id}: HTTP ${res.status}`);
    }
    const data = await res.json();
    return mapClient(data);
  },

  async deleteClient(id: string): Promise<void> {
    const res = await requestWithFallback(`/clients/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok && res.status !== 204 && res.status !== 404) {
      throw new Error(`Failed to delete client ${id}: HTTP ${res.status}`);
    }
  },

  getMetrics(clients: Client[]): ClientsMetrics {
    const totalClients = clients.length;
    const activeClients = clients.filter(
      (c) => String(c.status).toLowerCase() === 'active'
    ).length;
    const newClients = clients.filter(
      (c) =>
        String(c.status).toLowerCase() === 'pending' ||
        String(c.status).toLowerCase() === 'new'
    ).length;

    let sum = 0;
    clients.forEach((c) => {
      const num = parseInt(String(c.creditLimit || '').replace(/[^\d]/g, ''), 10);
      if (!isNaN(num)) sum += num;
    });
    const totalCreditLimit = `₹ ${sum.toLocaleString('en-IN')}`;

    return {
      totalClients,
      totalClientsTrend: '↑ 12% vs last month',
      activeClients,
      activeClientsTrend: '↑ 8% vs last month',
      newClients,
      newClientsTrend: '↑ 20% vs last month',
      totalCreditLimit,
      totalCreditLimitTrend: '↑ 18% vs last month',
    };
  },
};
