export interface ContractData {
  id: number;
  contractId: string;
  clientId: string;
  proposalId: string;
  contractType: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  contractValue: number;
  contractValueFormatted?: string;
  noticePeriod?: number;
  paymentTerms?: string;
  status: 'Active' | 'Expiring' | 'Pending' | 'Terminated' | 'Expired' | string;
  notes?: string;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContractSummaryData {
  totalContracts: number;
  totalContractsTrend?: string | null;
  activeContracts: number;
  activeContractsTrend?: string | null;
  expiringContracts: number;
  expiringContractsTrend?: string | null;
  totalContractValue: number;
  totalContractValueFormatted: string;
  totalContractValueTrend?: string | null;
}

export interface CreateContractPayload {
  contractId?: string;
  clientId: string;
  proposalId?: string;
  contractType: string;
  startDate: string;
  endDate: string;
  renewalDate?: string;
  contractValue: number;
  noticePeriod?: number;
  paymentTerms?: string;
  status?: string;
  notes?: string;
}

