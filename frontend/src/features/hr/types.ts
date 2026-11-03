import { LucideIcon } from 'lucide-react';

export type Department =
  | 'All'
  | 'Engineering'
  | 'Sales'
  | 'Product'
  | 'Design'
  | 'HR'
  | 'Finance';

export type PeriodFilter =
  | 'All'
  | 'Apr 2024 - Mar 2025'
  | 'This Month'
  | 'Last Month'
  | 'Q4 FY25';

export interface EmployeeRecord {
  id: string;
  name: string;
  department: Department;
  role: string;
  email: string;
  monthlyCtc: number;
  joiningDate: string; // YYYY-MM-DD
  status: 'Active' | 'On Notice' | 'Exited';
  noticePeriodEnd?: string;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Paid Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string;
  attendanceDate?: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Half Day' | 'Late' | 'Absent';
  notes?: string;
}

export interface CandidateRecord {
  id: string;
  name: string;
  role: string;
  department: Department;
  email?: string;
  status: 'Open' | 'Interviewing' | 'Offered' | 'Hired' | 'Rejected' | string;
  createdDate: string;
  daysInPipeline: number;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  department: string;
  role: string;
  monthlyCtc: number;
  joiningDate: string;
  status?: string;
  noticePeriodEnd?: string;
}

export interface LogAttendancePayload {
  employeeId: string;
  employeeName: string;
  status: string;
  attendanceDate?: string;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export interface HrKpiItem {
  id: string;
  label: string;
  value: string | number;
  target?: string;
  icon: LucideIcon;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
}

export type ActivityType = 'Attendance' | 'Recruitment' | 'Leave' | 'Employee';
export type ActivityStatus = 'Completed' | 'Pending';

export interface RecentActivityItem {
  id: string;
  date: string;
  rawDate: string; // YYYY-MM-DD for sorting/filtering
  type: ActivityType;
  typeColor: string;
  description: string;
  status: ActivityStatus;
  department?: Department;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  targetPath?: string;
  actionKey?: 'add-employee' | 'manage-leaves' | 'view-attendance';
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst?: boolean;
  isLast?: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface HrDashboardMetrics {
  workforce: {
    activeEmployees: number;
    onNotice: number;
    totalMonthlyCtc: string;
    newHiresThisMonth: number;
  };
  recruitment: {
    openCandidates: number;
    candidatesOver30Days: number;
  };
  leave: {
    pendingApprovals: number;
  };
  attendance: {
    records: number;
    halfDays: number;
    lateRecords: number;
    effectiveDate?: string;
  };
  lifecycle: {
    employeesExiting: number;
  };
}

export interface HrDashboardData extends HrDashboardMetrics {
  lastUpdated: string;
  recentActivities: RecentActivityItem[];
  quickActions: QuickActionItem[];
}

// ==========================================
// Employee Exit Types
// ==========================================

export type ExitStatus = 'Approved' | 'Pending' | 'In Review' | 'Rejected';
export type ExitType = 'Resignation' | 'Termination' | 'Retirement' | 'Absconding';
export type AssetsReturnedStatus = 'Returned' | 'Pending' | '-';
export type FullAndFinalStatus = 'Approved' | 'Pending' | 'In Review';
export type ExitReadiness = 'Completed' | 'In Progress' | 'Not Started';

export interface EmployeeExitRecord {
  id: string; // e.g. "EXI-00018"
  employeeId: string; // e.g. "EMP-001"
  employeeName: string; // e.g. "Amit Sharma"
  resignationDate: string; // e.g. "25 Oct 2026"
  approvalDate: string; // e.g. "26 Oct 2026"
  noticePeriodDays: number; // e.g. 30
  lastWorkingDay: string; // e.g. "24 Nov 2026"
  exitType: ExitType;
  reason: string;
  exitStatus: ExitStatus;
  assetsReturned: AssetsReturnedStatus;
  fullAndFinalStatus: FullAndFinalStatus;
  notes: string;
  noticeCompletionDate: string;
  exitReadiness: ExitReadiness;
}

export interface ExitKpiSummary {
  totalExitRequests: number;
  totalExitRequestsTrend: number;
  approvedExits: number;
  approvedExitsTrend: number;
  pendingApprovals: number;
  pendingApprovalsTrend: number;
  completedExits: number;
  completedExitsTrend: number;
}

export interface ExitFilters {
  search: string;
  exitStatus: string;
  exitType: string;
  noticePeriod: string;
  approvalStatus: string;
  dateRange: string;
}

export type ExitSortOption =
  | 'id-desc'
  | 'id-asc'
  | 'date-desc'
  | 'date-asc'
  | 'name-asc'
  | 'name-desc';
