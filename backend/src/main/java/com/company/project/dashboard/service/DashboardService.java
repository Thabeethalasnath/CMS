package com.company.project.dashboard.service;

import com.company.project.dashboard.dto.CeoDashboardResponse;
import com.company.project.dashboard.entity.*;
import com.company.project.dashboard.repository.DashboardKpiCardRepository;
import com.company.project.dashboard.repository.Repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardKpiCardRepository kpiCardRepository;
    private final FinanceMonthlyRepository financeMonthlyRepository;
    private final ExpenseBreakdownRepository expenseBreakdownRepository;
    private final SalesPipelineStageRepository salesPipelineStageRepository;
    private final ProjectStatusDistributionRepository projectStatusDistributionRepository;
    private final PeopleMonthlyRepository peopleMonthlyRepository;
    private final PeopleSummaryRepository peopleSummaryRepository;
    private final ManagementAlertRepository managementAlertRepository;
    private final DashboardSettingsRepository dashboardSettingsRepository;

    @Transactional(readOnly = true)
    public CeoDashboardResponse getCeoDashboard() {
        DashboardSettings settings = dashboardSettingsRepository.findAll().stream().findFirst().orElse(null);
        List<DashboardKpiCard> kpis = kpiCardRepository.findAllByOrderBySortOrderAsc();
        List<FinanceMonthly> financeMonthly = financeMonthlyRepository.findAllByOrderBySortOrderAsc();
        List<ExpenseBreakdown> expenseBreakdown = expenseBreakdownRepository.findAllByOrderBySortOrderAsc();
        List<SalesPipelineStage> salesPipeline = salesPipelineStageRepository.findAllByOrderBySortOrderAsc();
        List<ProjectStatusDistribution> projectStatus = projectStatusDistributionRepository.findAllByOrderBySortOrderAsc();
        List<PeopleMonthly> peopleMonthly = peopleMonthlyRepository.findAllByOrderBySortOrderAsc();
        PeopleSummary peopleSummary = peopleSummaryRepository.findAll().stream().findFirst().orElse(null);
        List<ManagementAlert> alerts = managementAlertRepository.findAllByOrderBySortOrderAsc();

        return CeoDashboardResponse.builder()
                .settings(settings)
                .kpis(kpis)
                .financeMonthly(financeMonthly)
                .expenseBreakdown(expenseBreakdown)
                .salesPipeline(salesPipeline)
                .projectStatus(projectStatus)
                .peopleMonthly(peopleMonthly)
                .peopleSummary(peopleSummary)
                .alerts(alerts)
                .build();
    }

    @Transactional
    public DashboardKpiCard updateKpi(Long id, DashboardKpiCard updateRequest) {
        DashboardKpiCard card = kpiCardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KPI Card not found with id: " + id));

        if (updateRequest.getFormattedValue() != null) card.setFormattedValue(updateRequest.getFormattedValue());
        if (updateRequest.getRawValue() != null) card.setRawValue(updateRequest.getRawValue());
        if (updateRequest.getChangePercentage() != null) card.setChangePercentage(updateRequest.getChangePercentage());
        if (updateRequest.getChangeType() != null) card.setChangeType(updateRequest.getChangeType());

        return kpiCardRepository.save(card);
    }

    @Transactional
    public ManagementAlert updateAlert(Long id, Integer delta) {
        ManagementAlert alert = managementAlertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));

        int newCount = Math.max(0, alert.getAlertCount() + delta);
        alert.setAlertCount(newCount);
        return managementAlertRepository.save(alert);
    }
}
