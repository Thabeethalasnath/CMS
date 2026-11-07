package com.company.project.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceDashboardResponse {
    private FinanceKpisDto kpis;
    private List<ReceivablesAgeingBucketDto> ageingBuckets;
    private List<MetricSummaryRowDto> metricSummary;
    private boolean hasReceivablesData;
    private boolean hasExpensesData;
    private String lastUpdated;
    private LocalDate asOfDate;
    private LocalDate periodStart;
    private LocalDate periodEnd;
}

