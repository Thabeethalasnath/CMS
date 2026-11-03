package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.PeopleSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeopleSummaryRepository extends JpaRepository<PeopleSummary, Long> {
}

