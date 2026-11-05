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
public class MetricSummaryRowDto {
    private String metricKey;
    private String metricName;
    private BigDecimal value;
    private BigDecimal target;
    private MetricValueType valueType;
    private String status;
}

