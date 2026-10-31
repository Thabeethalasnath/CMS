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
  yearsOfService?: string;
  monthlyCtc: number;
  monthlyCtcFormatted?: string;
  monthlyCost?: number;
  monthlyCostFormatted?: string;
  annualCtc?: number;
  annualCtcFormatted?: string;
  basicPercentage?: number;
  hraPercentage?: number;
  otherAllowance?: number;
  otherAllowanceFormatted?: string;
  employeePfPercentage?: number;
  employeeEsiPercentage?: number;
  ptMonthly?: number;
  tdsMonthly?: number;
  notes?: string;
  gender?: string;
  probationPeriod?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  shiftTiming?: string;
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
  yearsOfService?: string;
  notes?: string;
  monthlyCost?: number;
  basicPercentage?: number;
  hraPercentage?: number;
  otherAllowance?: number;
  employeePfPercentage?: number;
  employeeEsiPercentage?: number;
  ptMonthly?: number;
  tdsMonthly?: number;
}

