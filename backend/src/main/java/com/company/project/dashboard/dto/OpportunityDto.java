package com.company.project.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpportunityDto {
    private Long id;
    private String opportunityId;
    private String leadId;
    private String clientId;
    private String opportunityName;
    private String ownerId;
    private String serviceId;
    private String stage;
    private Integer probability;
    private BigDecimal estimatedValue;
    private String estimatedValueFormatted;
    private String expectedCloseDate;
    private String lastContact;
    private String nextFollowUp;
    private String status;
    private String lostReason;
    private BigDecimal weightedPipeline;
    private String weightedPipelineFormatted;
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

