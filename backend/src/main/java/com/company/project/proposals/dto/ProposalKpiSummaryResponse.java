package com.company.project.proposals.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalKpiSummaryResponse {
    private long totalProposals;
    private Double totalProposalsTrend;
    private long pendingDecisions;
    private Double pendingDecisionsTrend;
    private long approvedProposals;
    private Double approvedProposalsTrend;
    private BigDecimal totalProposalValue;
    private Double totalProposalValueTrend;
}
