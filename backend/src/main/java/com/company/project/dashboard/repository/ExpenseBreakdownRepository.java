package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.ExpenseBreakdown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseBreakdownRepository extends JpaRepository<ExpenseBreakdown, Long> {
    List<ExpenseBreakdown> findAllByOrderBySortOrderAsc();
}

