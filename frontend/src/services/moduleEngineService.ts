import { apiClient } from './api/apiClient';

export interface ModuleRecord {
  id: number | string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  priority: string;
  assignee: string;
  value: string;
  date: string;
  details?: string;
}

export interface ModuleSummary {
  total: number;
  primaryLabel: string;
  active: number;
  activeLabel: string;
  secondary: number;
  secondaryLabel: string;
  metricValFormatted: string;
  trend: string;
}

export const moduleEngineService = {
  getModuleRecords: async (moduleKey: string): Promise<ModuleRecord[]> => {
    const res = await apiClient.get<ModuleRecord[]>(`/modules/${moduleKey}`);
    return res.data;
  },

  getModuleSummary: async (moduleKey: string): Promise<ModuleSummary> => {
    const res = await apiClient.get<ModuleSummary>(`/modules/${moduleKey}/summary`);
    return res.data;
  },

  createRecord: async (moduleKey: string, payload: Partial<ModuleRecord>): Promise<ModuleRecord> => {
    const res = await apiClient.post<ModuleRecord>(`/modules/${moduleKey}`, payload);
    return res.data;
  },

  deleteRecord: async (moduleKey: string, id: number | string): Promise<void> => {
    await apiClient.delete(`/modules/${moduleKey}/${id}`);
  },
};

