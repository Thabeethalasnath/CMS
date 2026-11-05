package com.company.project.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceKpisDto {
    private FinanceKpiMetricDto invoiceValue;
    private FinanceKpiMetricDto collectedPayments;
    private FinanceKpiMetricDto outstandingReceivables;
    private FinanceKpiMetricDto currentReceivables;
    private FinanceKpiMetricDto totalExpenses;
    private FinanceKpiMetricDto projectExpenses;
    private FinanceKpiMetricDto operatingCashResult;
    private FinanceKpiMetricDto collectionRate;
}

