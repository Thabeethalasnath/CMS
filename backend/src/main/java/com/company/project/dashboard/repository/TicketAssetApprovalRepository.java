package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.TicketAssetApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketAssetApprovalRepository extends JpaRepository<TicketAssetApproval, Long> {
    List<TicketAssetApproval> findAllByOrderBySortOrderAscIdAsc();
    long countByStatusIgnoreCase(String status);
}

