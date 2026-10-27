package com.company.project.dashboard.dto;

import com.company.project.dashboard.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CeoDashboardResponse {
    private DashboardSettings settings;
    private List<DashboardKpiCard> kpis;
    private List<FinanceMonthly> financeMonthly;
    private List<ExpenseBreakdown> expenseBreakdown;
    private List<SalesPipelineStage> salesPipeline;
    private List<ProjectStatusDistribution> projectStatus;
    private List<PeopleMonthly> peopleMonthly;
    private PeopleSummary peopleSummary;
    private List<ManagementAlert> alerts;
}
