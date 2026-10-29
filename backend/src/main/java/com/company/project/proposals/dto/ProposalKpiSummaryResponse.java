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
    private double totalProposalsTrend;
    private long pendingDecisions;
    private double pendingDecisionsTrend;
    private long approvedProposals;
    private double approvedProposalsTrend;
    private BigDecimal totalProposalValue;
    private double totalProposalValueTrend;
}
