package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.FinanceMonthly;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinanceMonthlyRepository extends JpaRepository<FinanceMonthly, Long> {
    List<FinanceMonthly> findAllByOrderBySortOrderAsc();
}

