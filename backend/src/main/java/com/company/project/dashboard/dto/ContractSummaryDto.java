package com.company.project.dashboard.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractSummaryDto {
    private long totalContracts;
    private String totalContractsTrend;
    private long activeContracts;
    private String activeContractsTrend;
    private long expiringContracts;
    private String expiringContractsTrend;
    private BigDecimal totalContractValue;
    private String totalContractValueFormatted;
    private String totalContractValueTrend;
}

