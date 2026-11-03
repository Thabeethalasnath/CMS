package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.ClientApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientApprovalRepository extends JpaRepository<ClientApproval, Long> {
    List<ClientApproval> findAllByOrderBySortOrderAscIdAsc();
    long countByStatusIgnoreCase(String status);
}

