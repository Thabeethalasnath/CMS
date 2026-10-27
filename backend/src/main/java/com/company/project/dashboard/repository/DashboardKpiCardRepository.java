package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.DashboardKpiCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DashboardKpiCardRepository extends JpaRepository<DashboardKpiCard, Long> {
    List<DashboardKpiCard> findAllByOrderBySortOrderAsc();
    Optional<DashboardKpiCard> findByCardKey(String cardKey);
}
