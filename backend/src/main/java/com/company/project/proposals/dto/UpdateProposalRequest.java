package com.company.project.proposals.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProposalRequest {

    @Size(min = 3, message = "Proposal title must be at least 3 characters long")
    private String title;

    private String validUntil;
    private String expectedDecisionDate;
    private String serviceId;
    private String serviceName;

    @DecimalMin(value = "0.01", message = "Service before tax must be greater than zero")
    private BigDecimal serviceBeforeTax;

    private BigDecimal taxAmount;
    private BigDecimal totalAmount;

    private String ownerId;
    private String ownerName;
    private String description;
}
