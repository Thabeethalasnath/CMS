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
  totalContractsTrend?: string;
  activeContracts: number;
  activeContractsTrend?: string;
  expiringContracts: number;
  expiringContractsTrend?: string;
  totalContractValue: number;
  totalContractValueFormatted: string;
  totalContractValueTrend?: string;
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

