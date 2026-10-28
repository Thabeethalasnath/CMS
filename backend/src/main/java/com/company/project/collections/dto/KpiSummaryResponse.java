package com.company.project.collections.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiSummaryResponse {
    private MetricItem totalOutstanding;
    private MetricItem overdueAmount;
    private MetricItem dueSoon;
    private CollectedMetricItem collectedThisMonth;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricItem {
        private BigDecimal amount;
        private long count;
        private double trendPct;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CollectedMetricItem {
        private BigDecimal amount;
        private long paymentCount;
        private double trendPct;
    }
}
