package com.company.project.projects.repository;

import com.company.project.projects.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, String> {

    List<ProjectEntity> findAllByOrderByCreatedAtDesc();

    List<ProjectEntity> findAllByOrderByIdDesc();

    @Query("SELECT COUNT(p) FROM ProjectEntity p")
    long countTotalProjects();

    @Query("SELECT COUNT(p) FROM ProjectEntity p WHERE LOWER(p.status) = 'in progress'")
    long countActiveProjects();

    @Query("SELECT COUNT(p) FROM ProjectEntity p WHERE LOWER(p.health) = 'at risk'")
    long countProjectsAtRisk();

    @Query("SELECT COALESCE(SUM(p.contractValue), 0) FROM ProjectEntity p")
    BigDecimal sumTotalContractValue();

    @Query("SELECT DISTINCT p.clientId FROM ProjectEntity p WHERE p.clientId IS NOT NULL ORDER BY p.clientId")
    List<String> findDistinctClients();

    @Query("SELECT DISTINCT p.projectManager FROM ProjectEntity p WHERE p.projectManager IS NOT NULL ORDER BY p.projectManager")
    List<String> findDistinctProjectManagers();

    @Query("SELECT DISTINCT p.status FROM ProjectEntity p WHERE p.status IS NOT NULL ORDER BY p.status")
    List<String> findDistinctStatuses();

    @Query("SELECT DISTINCT p.priority FROM ProjectEntity p WHERE p.priority IS NOT NULL ORDER BY p.priority")
    List<String> findDistinctPriorities();
}

