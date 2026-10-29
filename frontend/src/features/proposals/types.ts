export type ProposalStatus = 'Sent' | 'Pending' | 'Approved' | 'In Review' | 'Rejected';

export interface Proposal {
  proposalId: string;
  opportunityId: string;
  clientId: string;
  clientName?: string;
  proposalDate: string;
  validUntil: string;
  version: string;
  title: string;
  serviceId: string;
  serviceName?: string;
  serviceBeforeTax: number;
  taxAmount: number;
  totalAmount: number;
  ownerId: string;
  ownerName?: string;
  status: ProposalStatus;
  expectedDecisionDate: string;
  description?: string;
  createdAt?: string;
}

export interface ProposalFilters {
  search: string;
  status: string;
  ownerId: string;
  clientId: string;
  opportunityId: string;
  serviceId: string;
  proposalDateRange: string;
  validUntilRange: string;
  expectedDecisionDateRange: string;
}

export type ProposalSortOption =
  | 'date-newest'
  | 'date-oldest'
  | 'value-highest'
  | 'value-lowest'
  | 'valid-until-soonest';

export interface ProposalKpiSummary {
  totalProposals: number;
  totalProposalsTrend: number;
  pendingDecisions: number;
  pendingDecisionsTrend: number;
  approvedProposals: number;
  approvedProposalsTrend: number;
  totalProposalValue: number;
  totalProposalValueTrend: number;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ProposalQueryParams {
  search?: string;
  status?: string;
  ownerId?: string;
  clientId?: string;
  opportunityId?: string;
  serviceId?: string;
  proposalDateRange?: string;
  validUntilRange?: string;
  expectedDecisionDateRange?: string;
  sortOption?: ProposalSortOption;
  page?: number;
  size?: number;
}

export interface CreateProposalPayload {
  proposalId: string;
  opportunityId: string;
  clientId: string;
  clientName?: string;
  proposalDate: string;
  validUntil: string;
  version: string;
  title: string;
  serviceId: string;
  serviceName?: string;
  serviceBeforeTax: number;
  taxAmount: number;
  totalAmount: number;
  ownerId: string;
  ownerName?: string;
  status: ProposalStatus;
  expectedDecisionDate: string;
  description?: string;
}

export interface ProposalApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
