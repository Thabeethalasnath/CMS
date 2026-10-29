package com.company.project.proposals.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProposalRequest {

    @NotBlank(message = "Proposal ID is required")
    private String proposalId;

    @NotBlank(message = "Opportunity ID is required")
    private String opportunityId;

    @NotBlank(message = "Client ID is required")
    private String clientId;

    private String clientName;

    @NotBlank(message = "Proposal date is required")
    private String proposalDate;

    @NotBlank(message = "Valid until date is required")
    private String validUntil;

    @NotBlank(message = "Version is required")
    private String version;

    @NotBlank(message = "Proposal title is required")
    @Size(min = 3, message = "Proposal title must be at least 3 characters long")
    private String title;

    @NotBlank(message = "Service ID is required")
    private String serviceId;

    private String serviceName;

    @NotNull(message = "Service before tax is required")
    @DecimalMin(value = "0.01", message = "Service before tax must be greater than zero")
    private BigDecimal serviceBeforeTax;

    @NotNull(message = "Tax amount is required")
    @DecimalMin(value = "0.00", message = "Tax amount must be zero or positive")
    private BigDecimal taxAmount;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than zero")
    private BigDecimal totalAmount;

    @NotBlank(message = "Owner ID is required")
    private String ownerId;

    private String ownerName;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Expected decision date is required")
    private String expectedDecisionDate;

    private String description;
}
