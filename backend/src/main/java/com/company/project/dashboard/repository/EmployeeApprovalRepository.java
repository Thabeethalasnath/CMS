package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.EmployeeApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeApprovalRepository extends JpaRepository<EmployeeApproval, Long> {
    List<EmployeeApproval> findAllByOrderBySortOrderAscIdAsc();
    long countByStatusIgnoreCase(String status);
}

