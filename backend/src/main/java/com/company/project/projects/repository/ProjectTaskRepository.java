package com.company.project.projects.repository;

import com.company.project.projects.entity.ProjectTaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectTaskRepository extends JpaRepository<ProjectTaskEntity, String> {

    List<ProjectTaskEntity> findAllByOrderByCreatedAtDesc();

    List<ProjectTaskEntity> findAllByOrderByIdDesc();

    List<ProjectTaskEntity> findByProjectIdOrderByCreatedAtDesc(String projectId);

    long countByProjectId(String projectId);

    long countByProjectIdAndStatusIgnoreCase(String projectId, String status);

    void deleteByProjectId(String projectId);

    @Query("SELECT DISTINCT t.projectId FROM ProjectTaskEntity t WHERE t.projectId IS NOT NULL ORDER BY t.projectId")
    List<String> findDistinctProjectIds();

    @Query("SELECT DISTINCT t.milestone FROM ProjectTaskEntity t WHERE t.milestone IS NOT NULL ORDER BY t.milestone")
    List<String> findDistinctMilestones();

    @Query("SELECT DISTINCT t.assignedTo FROM ProjectTaskEntity t WHERE t.assignedTo IS NOT NULL ORDER BY t.assignedTo")
    List<String> findDistinctAssignees();

    @Query("SELECT DISTINCT t.status FROM ProjectTaskEntity t WHERE t.status IS NOT NULL ORDER BY t.status")
    List<String> findDistinctStatuses();

    @Query("SELECT DISTINCT t.priority FROM ProjectTaskEntity t WHERE t.priority IS NOT NULL ORDER BY t.priority")
    List<String> findDistinctPriorities();
}


