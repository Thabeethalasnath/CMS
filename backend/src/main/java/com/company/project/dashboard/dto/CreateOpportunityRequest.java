package com.company.project.dashboard.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOpportunityRequest {

    private String opportunityId;

    private String leadId;

    @NotBlank(message = "Client ID is required")
    private String clientId;

    @NotBlank(message = "Opportunity name is required")
    private String opportunityName;

    @NotBlank(message = "Owner ID is required")
    private String ownerId;

    @NotBlank(message = "Service ID is required")
    private String serviceId;

    @NotBlank(message = "Stage is required")
    private String stage;

    @NotNull(message = "Probability is required")
    @Min(value = 0, message = "Probability cannot be negative")
    @Max(value = 100, message = "Probability cannot exceed 100")
    private Integer probability;

    @NotNull(message = "Estimated value is required")
    @PositiveOrZero(message = "Estimated value must be positive or zero")
    private BigDecimal estimatedValue;

    private String expectedCloseDate;

    private String lastContact;

    private String nextFollowUp;

    @NotBlank(message = "Status is required")
    private String status;

    private String lostReason;
}
