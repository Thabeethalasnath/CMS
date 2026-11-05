export interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  clientId: string;
  projectManager: string;
  startDate: string;
  plannedEndDate: string;
  status: 'In Progress' | 'Completed' | 'Planning' | 'On Hold' | string;
  priority: 'High' | 'Medium' | 'Low' | string;
  health: 'On Track' | 'At Risk' | string;
  contractValue: number;
  tasksCompleted: number;
  tasksTotal: number;
  progress: number;
  daysRemaining?: number;
  scheduleStatus?: 'On Schedule' | 'At Risk' | 'Completed' | 'Delayed' | string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  milestone: string;
  taskName: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  status: 'In Progress' | 'Completed' | 'Pending' | 'Review' | string;
  progress: number;
  dependencies: string;
  subtasksCompleted: number;
  subtasksTotal: number;
  health: 'On Track' | 'At Risk' | 'Healthy' | string;
  billable?: boolean;
  daysRemaining?: number;
}

export interface ProjectKpis {
  totalProjects: number;
  totalProjectsTrend: string;
  activeProjects: number;
  activeProjectsTrend: string;
  projectsAtRisk: number;
  projectsAtRiskTrend: string;
  totalContractValue: number;
  totalContractValueFormatted: string;
  totalContractValueTrend: string;
}

export interface CreateProjectPayload {
  id?: string;
  projectCode: string;
  projectName: string;
  clientId: string;
  projectManager: string;
  startDate: string;
  plannedEndDate: string;
  status?: string;
  priority?: string;
  health?: string;
  contractValue?: number;
  tasksCompleted?: number;
  tasksTotal?: number;
  progress?: number;
}

export interface CreateTaskPayload {
  id?: string;
  projectId: string;
  milestone: string;
  taskName: string;
  assignedTo: string;
  priority?: string;
  startDate: string;
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  status?: string;
  progress?: number;
  dependencies?: string;
  subtasksCompleted?: number;
  subtasksTotal?: number;
  health?: string;
}

export interface UpdateProjectPayload {
  projectCode?: string;
  projectName?: string;
  clientId?: string;
  projectManager?: string;
  startDate?: string;
  plannedEndDate?: string;
  status?: string;
  priority?: string;
  health?: string;
  contractValue?: number;
  tasksCompleted?: number;
  tasksTotal?: number;
  progress?: number;
}

export interface UpdateTaskPayload {
  projectId?: string;
  milestone?: string;
  taskName?: string;
  assignedTo?: string;
  priority?: string;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  status?: string;
  progress?: number;
  dependencies?: string;
  subtasksCompleted?: number;
  subtasksTotal?: number;
  health?: string;
}

export interface ProjectFilterOptions {
  clients: string[];
  managers: string[];
  statuses: string[];
  priorities: string[];
}

export interface TaskFilterOptions {
  projects: string[];
  milestones: string[];
  assignees: string[];
  statuses: string[];
  priorities: string[];
}


