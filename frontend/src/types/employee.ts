export interface EmployeeData {
  id: number;
  employeeId: string;
  employeeCode: string;
  fullName: string;
  avatarInitials: string;
  avatarColor: string;
  avatarBg: string;
  workEmail: string;
  phone: string;
  department: string;
  designation: string;
  employmentType: string;
  status: 'Active' | 'On Notice' | 'Probation' | 'Inactive' | string;
  location: string;
  reportingManager: string;
  joiningDate: string;
  tenureStatus: string;
  monthlyCtc: number;
  monthlyCtcFormatted?: string;
  annualCtc?: number;
  annualCtcFormatted?: string;
  gender?: string;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeSummaryData {
  totalEmployees: number;
  totalEmployeesTrend?: string;
  activeEmployees: number;
  activeEmployeesTrend?: string;
  onNoticeEmployees: number;
  onNoticeEmployeesTrend?: string;
  totalMonthlyCtc: number;
  totalMonthlyCtcFormatted: string;
  totalMonthlyCtcTrend?: string;
}

export interface CreateEmployeePayload {
  employeeId?: string;
  employeeCode?: string;
  fullName: string;
  avatarInitials?: string;
  avatarColor?: string;
  avatarBg?: string;
  workEmail: string;
  phone: string;
  department: string;
  designation: string;
  employmentType?: string;
  status?: string;
  location?: string;
  reportingManager?: string;
  joiningDate: string;
  tenureStatus?: string;
  monthlyCtc: number;
  annualCtc?: number;
  gender?: string;
}

