package com.company.project.dashboard.service;

import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.dashboard.dto.CeoDashboardResponse;
import com.company.project.dashboard.entity.*;
import com.company.project.dashboard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

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
    private final OpportunityRepository opportunityRepository;
    private final FollowUpItemRepository followUpItemRepository;
    private final EmployeeApprovalRepository employeeApprovalRepository;
    private final ClientApprovalRepository clientApprovalRepository;

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

        // Cross-page consistency: Sync Pending Approvals count dynamically
        long pendingEmp = employeeApprovalRepository.countByStatusIgnoreCase("Pending");
        long pendingClient = clientApprovalRepository.countByStatusIgnoreCase("Pending");
        int totalPendingApprovals = (int) (pendingEmp + pendingClient);

        // Cross-page consistency: Sync Overdue Follow-ups / Invoices count dynamically
        long overdueFollowUps = followUpItemRepository.findAll().stream()
                .filter(i -> "Overdue".equalsIgnoreCase(i.getHealth()) && !Boolean.TRUE.equals(i.getIsDone()))
                .count();

        for (ManagementAlert alert : alerts) {
            if ("pending_approvals".equalsIgnoreCase(alert.getAlertKey())) {
                alert.setAlertCount(totalPendingApprovals);
            } else if ("overdue_invoices".equalsIgnoreCase(alert.getAlertKey()) && overdueFollowUps > 0) {
                alert.setAlertCount((int) overdueFollowUps);
            }
        }

        // Cross-page consistency: Sync Weighted Sales Pipeline KPI with Opportunities
        BigDecimal sumWeighted = opportunityRepository.findAll().stream()
                .map(o -> o.getWeightedPipeline() != null ? o.getWeightedPipeline() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalActiveProjects = projectStatus.stream()
                .mapToInt(p -> p.getProjectCount() != null ? p.getProjectCount() : 0)
                .sum();

        BigDecimal sumExpenses = expenseBreakdown.stream()
                .map(e -> e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        PeopleMonthly latestPeople = peopleMonthly.isEmpty() ? null : peopleMonthly.get(peopleMonthly.size() - 1);

        for (DashboardKpiCard card : kpis) {
            if ("weighted_sales_pipeline".equalsIgnoreCase(card.getCardKey())) {
                card.setRawValue(sumWeighted);
                card.setFormattedValue(formatIndianCurrency(sumWeighted));
            } else if ("active_projects".equalsIgnoreCase(card.getCardKey()) && totalActiveProjects > 0) {
                card.setRawValue(BigDecimal.valueOf(totalActiveProjects));
                card.setFormattedValue(String.valueOf(totalActiveProjects));
            } else if ("active_employees".equalsIgnoreCase(card.getCardKey()) && peopleSummary != null) {
                card.setRawValue(BigDecimal.valueOf(peopleSummary.getActiveEmployees()));
                card.setFormattedValue(String.valueOf(peopleSummary.getActiveEmployees()));
            } else if ("total_expenses".equalsIgnoreCase(card.getCardKey()) && sumExpenses.compareTo(BigDecimal.ZERO) > 0) {
                card.setRawValue(sumExpenses);
                card.setFormattedValue(formatIndianCurrency(sumExpenses));
            } else if ("net_payroll".equalsIgnoreCase(card.getCardKey()) && latestPeople != null && latestPeople.getNetPayroll() != null) {
                card.setRawValue(latestPeople.getNetPayroll());
                card.setFormattedValue(formatIndianCurrency(latestPeople.getNetPayroll()));
            } else if ("employer_payroll_cost".equalsIgnoreCase(card.getCardKey()) && latestPeople != null && latestPeople.getEmployerPayrollCost() != null) {
                card.setRawValue(latestPeople.getEmployerPayrollCost());
                card.setFormattedValue(formatIndianCurrency(latestPeople.getEmployerPayrollCost()));
            }
        }

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
                .orElseThrow(() -> new ResourceNotFoundException("KPI Card not found with id: " + id));

        if (updateRequest.getFormattedValue() != null) card.setFormattedValue(updateRequest.getFormattedValue());
        if (updateRequest.getRawValue() != null) card.setRawValue(updateRequest.getRawValue());
        if (updateRequest.getChangePercentage() != null) card.setChangePercentage(updateRequest.getChangePercentage());
        if (updateRequest.getChangeType() != null) card.setChangeType(updateRequest.getChangeType());

        return kpiCardRepository.save(card);
    }

    @Transactional
    public ManagementAlert updateAlert(Long id, Integer delta) {
        ManagementAlert alert = managementAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + id));

        int newCount = Math.max(0, alert.getAlertCount() + delta);
        alert.setAlertCount(newCount);
        return managementAlertRepository.save(alert);
    }

    private String formatIndianCurrency(BigDecimal amount) {
        if (amount == null) return "₹ 0";
        try {
            NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
            String formatted = nf.format(amount);
            if (formatted.endsWith(".00")) {
                formatted = formatted.substring(0, formatted.length() - 3);
            }
            return formatted.replace("₹", "₹ ");
        } catch (Exception e) {
            return "₹ " + amount.toPlainString();
        }
    }
}
