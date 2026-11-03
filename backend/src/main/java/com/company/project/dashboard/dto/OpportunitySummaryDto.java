package com.company.project.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpportunitySummaryDto {
    private long totalOpportunities;
    private long openOpportunities;
    private BigDecimal weightedPipeline;
    private String weightedPipelineFormatted;
    private long wonOpportunities;
    private String totalTrend;
    private String openTrend;
    private String weightedTrend;
    private String wonTrend;
}

