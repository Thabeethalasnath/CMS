export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface EmployeeApproval {
  id: number;
  employee_name: string;
  employee_code: string;
  request_type: string;
  applied_date: string;
  from_date: string;
  to_date: string;
  duration: string;
  reason: string;
  status: ApprovalStatus;
  created_at?: string;
}

export interface ClientApproval {
  id: number;
  approval_id: string;
  client_name: string;
  request_type: string;
  reference_id: string;
  requester: string;
  request_date: string;
  due_date: string;
  amount: string;
  status: ApprovalStatus;
  created_at?: string;
}

export interface TicketAssetApproval {
  id: number;
  approval_id: string;
  record_type: 'Ticket' | 'Asset';
  record_code: string;
  title: string;
  client_requester: string;
  approval_type: string;
  priority: 'High' | 'Medium' | 'Low' | '-';
  request_date: string;
  assigned_approver: string;
  status: ApprovalStatus;
  created_at?: string;
}

export interface ApprovalsSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
