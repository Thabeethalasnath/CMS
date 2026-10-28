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
public class ProposalResponse {
    private String proposalId;
    private String opportunityId;
    private String clientId;
    private String clientName;
    private String proposalDate;
    private String validUntil;
    private String version;
    private String title;
    private String serviceId;
    private String serviceName;
    private BigDecimal serviceBeforeTax;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String ownerId;
    private String ownerName;
    private String status;
    private String expectedDecisionDate;
    private String description;
    private String createdAt;
    private String updatedAt;
}
