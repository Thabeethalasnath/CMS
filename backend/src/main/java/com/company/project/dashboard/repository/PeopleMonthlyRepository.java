package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.PeopleMonthly;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PeopleMonthlyRepository extends JpaRepository<PeopleMonthly, Long> {
    List<PeopleMonthly> findAllByOrderBySortOrderAsc();
}
