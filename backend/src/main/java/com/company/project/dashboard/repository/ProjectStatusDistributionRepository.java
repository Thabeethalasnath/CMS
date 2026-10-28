package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.ProjectStatusDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectStatusDistributionRepository extends JpaRepository<ProjectStatusDistribution, Long> {
    List<ProjectStatusDistribution> findAllByOrderBySortOrderAsc();
}
