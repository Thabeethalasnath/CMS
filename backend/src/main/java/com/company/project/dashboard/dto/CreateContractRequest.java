package com.company.project.dashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateContractRequest {

    private String contractId;

    @NotBlank(message = "Client ID is required")
    private String clientId;

    private String proposalId;

    @NotBlank(message = "Contract Type is required")
    private String contractType;

    @NotBlank(message = "Start Date is required")
    private String startDate;

    @NotBlank(message = "End Date is required")
    private String endDate;

    private String renewalDate;

    @NotNull(message = "Contract Value is required")
    private BigDecimal contractValue;

    private Integer noticePeriod;

    private String paymentTerms;

    private String status;

    private String notes;

    private Integer orderIndex;
}

