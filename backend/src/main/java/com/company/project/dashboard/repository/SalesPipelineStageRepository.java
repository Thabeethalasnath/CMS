package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.SalesPipelineStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesPipelineStageRepository extends JpaRepository<SalesPipelineStage, Long> {
    List<SalesPipelineStage> findAllByOrderBySortOrderAsc();
}
