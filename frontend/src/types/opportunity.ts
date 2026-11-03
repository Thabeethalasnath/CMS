export interface OpportunityData {
  id: number;
  opportunityId: string;
  leadId: string;
  clientId: string;
  opportunityName: string;
  ownerId: string;
  serviceId: string;
  stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost' | string;
  probability: number;
  estimatedValue: number;
  estimatedValueFormatted: string;
  expectedCloseDate: string | null;
  lastContact: string;
  nextFollowUp: string | null;
  status: 'Open' | 'In Progress' | 'Won' | 'Lost' | string;
  lostReason: string | null;
  weightedPipeline: number;
  weightedPipelineFormatted: string;
  orderIndex: number;
}

export interface OpportunitySummaryData {
  totalOpportunities: number;
  totalOpportunitiesTrend?: string | null;
  openOpportunities: number;
  openOpportunitiesTrend?: string | null;
  weightedPipeline: number;
  weightedPipelineFormatted: string;
  weightedPipelineTrend?: string | null;
  wonOpportunities: number;
  wonOpportunitiesTrend?: string | null;
}

export interface CreateOpportunityPayload {
  opportunityId?: string;
  leadId?: string;
  clientId: string;
  opportunityName: string;
  ownerId: string;
  serviceId: string;
  stage: string;
  probability: number;
  estimatedValue: number;
  expectedCloseDate?: string;
  lastContact?: string;
  nextFollowUp?: string;
  status: string;
  lostReason?: string;
}

export interface OpportunityFilters {
  stage?: string;
  status?: string;
  ownerId?: string;
  clientId?: string;
  serviceId?: string;
  search?: string;
  expectedCloseDateFrom?: string;
  expectedCloseDateTo?: string;
  nextFollowUpFrom?: string;
  nextFollowUpTo?: string;
  lastContactFrom?: string;
  lastContactTo?: string;
}
