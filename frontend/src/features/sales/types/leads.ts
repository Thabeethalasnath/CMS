export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'LinkedIn'
  | 'Event'
  | 'Cold Call'
  | 'Partner'
  | 'Social Media'
  | 'Other';

export type ServiceInterest =
  | 'Web Development'
  | 'Mobile App'
  | 'AI Solutions'
  | 'ERP Solution'
  | 'E-commerce'
  | 'Digital Marketing'
  | 'Cloud & DevOps'
  | 'Custom Software'
  | 'UI/UX Design'
  | 'Cybersecurity';

export type LeadStage =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export type LeadStatus =
  | 'Open'
  | 'In Progress'
  | 'Active'
  | 'Follow-up Required'
  | 'Converted'
  | 'Archived'
  | 'On Hold'
  | 'Lost';

export interface Lead {
  id: string; // e.g. "L-2025-001"
  leadDate: string; // e.g. "15 Mar 2025"
  company: string; // e.g. "Acme Pvt Ltd"
  contactName: string; // e.g. "Rahul Mehta"
  email: string; // e.g. "rahul@acme.com"
  phone: string; // e.g. "+91 98765 43210"
  source: LeadSource;
  serviceInterest: ServiceInterest;
  country: string;
  city: string;
  ownerId: string;
  stage: LeadStage;
  status: LeadStatus;
  leadScore?: number; // e.g. 85
  expectedValue?: string; // e.g. "₹ 12,00,000"
  expectedCloseDate?: string; // e.g. "20 Apr 2025"
  nextFollowUp?: string; // e.g. "18 Mar 2025"
  estimatedValue?: string; // e.g. "₹ 12,00,000"
  lostReason?: string; // e.g. "Budget issue"
  notes?: string;
  createdAt?: string;
}

export interface LeadsMetrics {
  totalLeads: number;
  totalLeadsTrend: string;
  newLeads: number;
  newLeadsTrend: string;
  followUpsDue: number;
  followUpsDueTrend: string;
  convertedLeads: number;
  convertedLeadsTrend: string;
}

export interface LeadsFilterState {
  searchQuery: string;
  leadDateRange: string;
  source: string;
  serviceInterest: string;
  country: string;
  city: string;
  ownerId: string;
  stage: string;
  status: string;
  nextFollowUpDateRange: string;
}

export type LeadSortOption =
  | 'date-desc'
  | 'date-asc'
  | 'company-asc'
  | 'company-desc'
  | 'contact-asc'
  | 'id-desc';
