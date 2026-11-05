package com.company.project.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceKpiMetricDto {
    private BigDecimal rawValue;
    private BigDecimal priorPeriodValue;
    private Double trendPercentage;
    private TrendType trendType;
    private String comparisonText;
}

