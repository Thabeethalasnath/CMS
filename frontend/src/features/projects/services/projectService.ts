import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/services/api/apiEndpoints';
import {
  Project,
  ProjectTask,
  ProjectKpis,
  CreateProjectPayload,
  UpdateProjectPayload,
  CreateTaskPayload,
  UpdateTaskPayload,
  ProjectFilterOptions,
  TaskFilterOptions,
} from '../types/project';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const res = await apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS.BASE);
    return res.data || [];
  },

  getProjectKpis: async (): Promise<ProjectKpis> => {
    const res = await apiClient.get<ProjectKpis>(API_ENDPOINTS.PROJECTS.KPIS);
    return res.data || {
      totalProjects: 0,
      totalProjectsTrend: '↑ 0% vs last month',
      activeProjects: 0,
      activeProjectsTrend: '↑ 0% vs last month',
      projectsAtRisk: 0,
      projectsAtRiskTrend: '↓ 0% vs last month',
      totalContractValue: 0,
      totalContractValueFormatted: '₹ 0',
      totalContractValueTrend: '↑ 0% vs last month',
    };
  },

  getProjectFilters: async (): Promise<ProjectFilterOptions> => {
    const res = await apiClient.get<ProjectFilterOptions>(API_ENDPOINTS.PROJECTS.FILTERS);
    return res.data || { clients: [], managers: [], statuses: [], priorities: [] };
  },

  getProjectById: async (id: string): Promise<Project> => {
    const res = await apiClient.get<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id));
    return res.data;
  },

  createProject: async (payload: CreateProjectPayload): Promise<Project> => {
    const res = await apiClient.post<Project>(API_ENDPOINTS.PROJECTS.BASE, payload);
    return res.data;
  },

  updateProject: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
    const res = await apiClient.put<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id), payload);
    return res.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PROJECTS.BY_ID(id));
  },

  getTasks: async (): Promise<ProjectTask[]> => {
    const res = await apiClient.get<ProjectTask[]>(API_ENDPOINTS.PROJECTS.TASKS);
    return res.data || [];
  },

  getTaskFilters: async (): Promise<TaskFilterOptions> => {
    const res = await apiClient.get<TaskFilterOptions>(API_ENDPOINTS.PROJECTS.TASKS_FILTERS);
    return res.data || { projects: [], milestones: [], assignees: [], statuses: [], priorities: [] };
  },

  getTasksByProject: async (projectId: string): Promise<ProjectTask[]> => {
    const res = await apiClient.get<ProjectTask[]>(API_ENDPOINTS.PROJECTS.TASKS_BY_PROJECT(projectId));
    return res.data || [];
  },

  getTaskById: async (id: string): Promise<ProjectTask> => {
    const res = await apiClient.get<ProjectTask>(API_ENDPOINTS.PROJECTS.TASK_BY_ID(id));
    return res.data;
  },

  createTask: async (payload: CreateTaskPayload): Promise<ProjectTask> => {
    const res = await apiClient.post<ProjectTask>(API_ENDPOINTS.PROJECTS.TASKS, payload);
    return res.data;
  },

  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<ProjectTask> => {
    const res = await apiClient.put<ProjectTask>(API_ENDPOINTS.PROJECTS.TASK_BY_ID(id), payload);
    return res.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PROJECTS.TASK_BY_ID(id));
  },
};
