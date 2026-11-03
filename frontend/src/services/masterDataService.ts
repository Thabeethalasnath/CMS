import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/apiEndpoints';

export interface MasterEmployee {
  id: number;
  employeeId: string;
  fullName: string;
  department?: string;
  designation?: string;
}

export interface MasterClient {
  id: string;
  companyName?: string;
  clientName?: string;
  name?: string;
}

export interface MasterOpportunity {
  opportunityId: string;
  opportunityName: string;
}

export interface MasterDataState {
  employees: MasterEmployee[];
  clients: MasterClient[];
  services: string[];
  opportunities: MasterOpportunity[];
}

export const masterDataService = {
  getEmployees: async (): Promise<MasterEmployee[]> => {
    try {
      const res = await apiClient.get<MasterEmployee[]>(API_ENDPOINTS.EMPLOYEES.BASE);
      return res.data || [];
    } catch {
      return [];
    }
  },

  getClients: async (): Promise<MasterClient[]> => {
    try {
      const res = await apiClient.get<MasterClient[]>('/clients');
      return res.data || [];
    } catch {
      return [];
    }
  },

  getServices: async (): Promise<string[]> => {
    try {
      const res = await apiClient.get<{ services?: string[] }>(API_ENDPOINTS.PROPOSALS.FILTERS);
      return res.data?.services || [];
    } catch {
      return [];
    }
  },

  getOpportunities: async (): Promise<MasterOpportunity[]> => {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.OPPORTUNITIES.BASE);
      const items = res.data?.content || res.data || [];
      return items.map((op: any) => ({
        opportunityId: op.opportunityId,
        opportunityName: op.opportunityName || op.title || op.name || op.opportunityId,
      }));
    } catch {
      return [];
    }
  },

  getAllMasterData: async (): Promise<MasterDataState> => {
    const [employees, clients, services, opportunities] = await Promise.all([
      masterDataService.getEmployees(),
      masterDataService.getClients(),
      masterDataService.getServices(),
      masterDataService.getOpportunities(),
    ]);
    return { employees, clients, services, opportunities };
  },
};
