package com.company.project.hr.repository;

import com.company.project.hr.entity.HrSummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrSummaryRepository extends JpaRepository<HrSummaryEntity, Long> {
}
