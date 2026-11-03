export type Priority = 'High' | 'Medium' | 'Low';
export type HealthStatus = 'Overdue' | 'Due Soon' | 'On Track';

export interface FollowUpItemData {
  id: number | string;
  moduleCode: string;
  moduleName: string;
  moduleSub: string;
  iconBg: string;
  iconColor: string;
  count: number;
  countVariant: 'red' | 'amber' | 'green';
  keyInfoTitle: string;
  keyInfoSub: string;
  priority: Priority;
  health: HealthStatus;
  daysSinceLastFollowUp: string;
  daysColorRed: boolean;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  isDone?: boolean;
  notes?: string | null;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FollowUpSummaryData {
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  totalPendingItems: number;
  totalCompletedItems: number;
  lastRefreshed: string;
}

export interface ActionPayload {
  action: string;
  notes?: string;
}
