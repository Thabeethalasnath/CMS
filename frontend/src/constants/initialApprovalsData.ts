import { EmployeeApproval, ClientApproval, TicketAssetApproval } from '../types/approvals';

export const initialEmployeeApprovals: EmployeeApproval[] = [
  {
    id: 1,
    employee_name: 'Arun S',
    employee_code: 'EMP-0012',
    request_type: 'Sick Leave',
    applied_date: '12 Mar 2025',
    from_date: '14 Mar 2025',
    to_date: '16 Mar 2025',
    duration: '3 days',
    reason: 'Not feeling well due to fever.',
    status: 'Pending'
  },
  {
    id: 2,
    employee_name: 'Priya D',
    employee_code: 'EMP-0045',
    request_type: 'Work From Home',
    applied_date: '11 Mar 2025',
    from_date: '12 Mar 2025',
    to_date: '13 Mar 2025',
    duration: '2 days',
    reason: 'Personal work at home.',
    status: 'Pending'
  },
  {
    id: 3,
    employee_name: 'Rahul K',
    employee_code: 'EMP-0032',
    request_type: 'Earned Leave',
    applied_date: '10 Mar 2025',
    from_date: '18 Mar 2025',
    to_date: '20 Mar 2025',
    duration: '3 days',
    reason: 'Family function.',
    status: 'Approved'
  },
  {
    id: 4,
    employee_name: 'Sneha K',
    employee_code: 'EMP-0051',
    request_type: 'Sick Leave',
    applied_date: '09 Mar 2025',
    from_date: '09 Mar 2025',
    to_date: '10 Mar 2025',
    duration: '2 days',
    reason: 'Medical checkup.',
    status: 'Rejected'
  },
  {
    id: 5,
    employee_name: 'Manoj J',
    employee_code: 'EMP-0021',
    request_type: 'Work From Home',
    applied_date: '08 Mar 2025',
    from_date: '10 Mar 2025',
    to_date: '11 Mar 2025',
    duration: '2 days',
    reason: 'Home repair work.',
    status: 'Pending'
  },
  {
    id: 6,
    employee_name: 'Ananya Roy',
    employee_code: 'EMP-0019',
    request_type: 'Casual Leave',
    applied_date: '07 Mar 2025',
    from_date: '12 Mar 2025',
    to_date: '12 Mar 2025',
    duration: '1 day',
    reason: 'Personal appointment.',
    status: 'Approved'
  },
  {
    id: 7,
    employee_name: 'Vikram Singh',
    employee_code: 'EMP-0028',
    request_type: 'Earned Leave',
    applied_date: '06 Mar 2025',
    from_date: '21 Mar 2025',
    to_date: '25 Mar 2025',
    duration: '5 days',
    reason: 'Annual vacation with family.',
    status: 'Approved'
  },
  {
    id: 8,
    employee_name: 'Kavita Nair',
    employee_code: 'EMP-0062',
    request_type: 'Work From Home',
    applied_date: '05 Mar 2025',
    from_date: '06 Mar 2025',
    to_date: '07 Mar 2025',
    duration: '2 days',
    reason: 'Mild sprain recovery.',
    status: 'Pending'
  }
];

export const initialClientApprovals: ClientApproval[] = [
  {
    id: 1,
    approval_id: 'APP-2025-001',
    client_name: 'Acme Pvt Ltd',
    request_type: 'Client Onboarding',
    reference_id: 'CL-0012',
    requester: 'Rahul K',
    request_date: '12 Mar 2025',
    due_date: '18 Mar 2025',
    amount: '-',
    status: 'Pending'
  },
  {
    id: 2,
    approval_id: 'APP-2025-002',
    client_name: 'Bright Solutions',
    request_type: 'Proposal Approval',
    reference_id: 'PR-2025-004',
    requester: 'Sneha K',
    request_date: '10 Mar 2025',
    due_date: '15 Mar 2025',
    amount: '₹ 4,50,000',
    status: 'Approved'
  },
  {
    id: 3,
    approval_id: 'APP-2025-003',
    client_name: 'CloudTech Services',
    request_type: 'Contract Approval',
    reference_id: 'CT-2025-010',
    requester: 'Vikram T',
    request_date: '08 Mar 2025',
    due_date: '20 Mar 2025',
    amount: '₹ 12,00,000',
    status: 'Pending'
  },
  {
    id: 4,
    approval_id: 'APP-2025-004',
    client_name: 'Delta Systems',
    request_type: 'Special Pricing / Payment Terms',
    reference_id: 'PRC-2025-006',
    requester: 'Priya D',
    request_date: '07 Mar 2025',
    due_date: '14 Mar 2025',
    amount: '₹ 2,25,000',
    status: 'Rejected'
  },
  {
    id: 5,
    approval_id: 'APP-2025-005',
    client_name: 'Evergreen Retail',
    request_type: 'Client Change Request',
    reference_id: 'CCR-2025-003',
    requester: 'Manoj J',
    request_date: '05 Mar 2025',
    due_date: '12 Mar 2025',
    amount: '-',
    status: 'Pending'
  },
  {
    id: 6,
    approval_id: 'APP-2025-006',
    client_name: 'Nexus Healthcare',
    request_type: 'Contract Approval',
    reference_id: 'CT-2025-014',
    requester: 'Rahul K',
    request_date: '04 Mar 2025',
    due_date: '19 Mar 2025',
    amount: '₹ 8,40,000',
    status: 'Approved'
  }
];

export const initialTicketAssetApprovals: TicketAssetApproval[] = [
  {
    id: 1,
    approval_id: 'APP-2025-101',
    record_type: 'Ticket',
    record_code: 'TKT-2025-044',
    title: 'System downtime issue',
    client_requester: 'Acme Pvt Ltd',
    approval_type: 'Escalation',
    priority: 'High',
    request_date: '12 Mar 2025',
    assigned_approver: 'Akshit Ujjain',
    status: 'Pending'
  },
  {
    id: 2,
    approval_id: 'APP-2025-102',
    record_type: 'Ticket',
    record_code: 'TKT-2025-038',
    title: 'Additional customization',
    client_requester: 'Bright Solutions',
    approval_type: 'Paid Support / Additional Work',
    priority: 'Medium',
    request_date: '10 Mar 2025',
    assigned_approver: 'Vikram T',
    status: 'Approved'
  },
  {
    id: 3,
    approval_id: 'APP-2025-103',
    record_type: 'Asset',
    record_code: 'AST-2025-021',
    title: 'Laptop replacement',
    client_requester: 'Rahul K',
    approval_type: 'Asset Purchase Approval',
    priority: '-',
    request_date: '08 Mar 2025',
    assigned_approver: 'Priya D',
    status: 'Pending'
  },
  {
    id: 4,
    approval_id: 'APP-2025-104',
    record_type: 'Ticket',
    record_code: 'TKT-2025-031',
    title: 'Reopen ticket request',
    client_requester: 'CloudTech Services',
    approval_type: 'Reopening / Closure Exception',
    priority: 'Low',
    request_date: '07 Mar 2025',
    assigned_approver: 'Sneha K',
    status: 'Rejected'
  },
  {
    id: 5,
    approval_id: 'APP-2025-105',
    record_type: 'Asset',
    record_code: 'AST-2025-018',
    title: 'Software license renewal',
    client_requester: 'IT Team',
    approval_type: 'Asset Renewal Approval',
    priority: '-',
    request_date: '05 Mar 2025',
    assigned_approver: 'Akshit Ujjain',
    status: 'Pending'
  },
  {
    id: 6,
    approval_id: 'APP-2025-106',
    record_type: 'Asset',
    record_code: 'AST-2025-015',
    title: 'Server rack UPS upgrade',
    client_requester: 'Infra Ops',
    approval_type: 'Asset Purchase Approval',
    priority: 'High',
    request_date: '03 Mar 2025',
    assigned_approver: 'Akshit Ujjain',
    status: 'Approved'
  }
];
