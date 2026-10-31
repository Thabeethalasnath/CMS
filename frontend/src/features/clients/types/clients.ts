export type ClientStatus = 'Active' | 'Pending' | 'Prospect' | 'Suspended' | 'Inactive';
export type ClientType = 'Enterprise' | 'SMB' | 'Startup' | 'Government';
export type IndustryType =
  | 'IT Services'
  | 'Manufacturing'
  | 'Education'
  | 'Healthcare'
  | 'Real Estate'
  | 'Renewable Energy'
  | 'Finance'
  | 'Logistics'
  | 'E-commerce'
  | 'Other';

export interface Client {
  id: string; // e.g. "C-001"
  clientCode: string; // e.g. "CL-001"
  clientName: string; // e.g. "TechNova Solutions"
  companyName: string; // e.g. "TechNova Pvt Ltd"
  industry: IndustryType | string;
  contactPerson: string; // e.g. "Rohan Mehta"
  email: string; // e.g. "rohan@technova.com"
  phone: string; // e.g. "+91 98765 43210"
  country: string; // e.g. "India"
  city: string; // e.g. "Bangalore"
  clientType: ClientType | string;
  accountOwner: string; // e.g. "EMP-001"
  status: ClientStatus | string;
  creditLimit?: string; // e.g. "₹ 15,00,000"
  onboardingDate?: string; // e.g. "15 Jan 2024"
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientsMetrics {
  totalClients: number; // 128
  totalClientsTrend: string; // "↑ 12% vs last month"
  activeClients: number; // 96
  activeClientsTrend: string; // "↑ 8% vs last month"
  newClients: number; // 12
  newClientsTrend: string; // "↑ 20% vs last month"
  totalCreditLimit: string; // "₹ 4,8500"
  totalCreditLimitTrend: string; // "↑ 18% vs last month"
}

export interface ClientsFilterState {
  searchQuery: string;
  status: string;
  clientType: string;
  industry: string;
  country: string;
  city: string;
  accountOwner: string;
  onboardingDateRange: string;
}

export type ClientSortOption =
  | 'onboarding-desc'
  | 'onboarding-asc'
  | 'client-asc'
  | 'client-desc'
  | 'company-asc'
  | 'id-asc'
  | 'id-desc';
