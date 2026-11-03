package com.company.project.dashboard.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractDto {
    private Long id;
    private String contractId;
    private String clientId;
    private String proposalId;
    private String contractType;
    private String startDate;
    private String endDate;
    private String renewalDate;
    private BigDecimal contractValue;
    private String contractValueFormatted;
    private Integer noticePeriod;
    private String paymentTerms;
    private String status;
    private String notes;
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

