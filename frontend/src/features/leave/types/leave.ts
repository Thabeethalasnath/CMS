export type LeaveApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  approvalStatus: LeaveApprovalStatus;
  approvedBy: string | null;
  calculatedDays: number;
  leaveStatus: LeaveStatus;
  appliedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveMetrics {
  totalRequests: number;
  totalRequestsTrend: string;
  approvedRequests: number;
  approvedRequestsTrend: string;
  pendingRequests: number;
  pendingRequestsTrend: string;
  rejectedRequests: number;
  rejectedRequestsTrend: string;
}

export interface LeaveFilterState {
  search: string;
  dateRange: string;
  employee: string;
  leaveType: string;
  approvalStatus: string;
  leaveStatus: string;
  sortBy: string;
}

export interface CreateLeavePayload {
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  approvalStatus?: string;
  approvedBy?: string;
}

export interface UpdateLeavePayload {
  employeeId?: string;
  employeeName?: string;
  leaveType?: string;
  fromDate?: string;
  toDate?: string;
  days?: number;
  reason?: string;
  approvalStatus?: LeaveApprovalStatus;
  approvedBy?: string;
  calculatedDays?: number;
  leaveStatus?: LeaveStatus;
}

