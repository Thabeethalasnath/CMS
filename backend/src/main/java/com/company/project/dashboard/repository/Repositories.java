package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface Repositories {

    @Repository
    interface FinanceMonthlyRepository extends JpaRepository<FinanceMonthly, Long> {
        List<FinanceMonthly> findAllByOrderBySortOrderAsc();
    }

    @Repository
    interface ExpenseBreakdownRepository extends JpaRepository<ExpenseBreakdown, Long> {
        List<ExpenseBreakdown> findAllByOrderBySortOrderAsc();
    }

    @Repository
    interface SalesPipelineStageRepository extends JpaRepository<SalesPipelineStage, Long> {
        List<SalesPipelineStage> findAllByOrderBySortOrderAsc();
    }

    @Repository
    interface ProjectStatusDistributionRepository extends JpaRepository<ProjectStatusDistribution, Long> {
        List<ProjectStatusDistribution> findAllByOrderBySortOrderAsc();
    }

    @Repository
    interface PeopleMonthlyRepository extends JpaRepository<PeopleMonthly, Long> {
        List<PeopleMonthly> findAllByOrderBySortOrderAsc();
    }

    @Repository
    interface PeopleSummaryRepository extends JpaRepository<PeopleSummary, Long> {
    }

    @Repository
    interface ManagementAlertRepository extends JpaRepository<ManagementAlert, Long> {
        List<ManagementAlert> findAllByOrderBySortOrderAsc();
    }

    @Repository
    interface DashboardSettingsRepository extends JpaRepository<DashboardSettings, Long> {
    }
}
