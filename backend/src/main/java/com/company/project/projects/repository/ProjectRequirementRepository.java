package com.company.project.projects.repository;

import com.company.project.projects.entity.ProjectRequirementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRequirementRepository extends JpaRepository<ProjectRequirementEntity, String>, JpaSpecificationExecutor<ProjectRequirementEntity> {

    Optional<ProjectRequirementEntity> findByRequirementId(String requirementId);

    boolean existsByRequirementId(String requirementId);

    long countByStatusIgnoreCase(String status);

    long countByScopeFreezeTrue();
}

