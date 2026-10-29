package com.company.project.proposals.repository;

import com.company.project.proposals.entity.ProposalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<ProposalEntity, String>, JpaSpecificationExecutor<ProposalEntity> {

    @Query("SELECT DISTINCT p.ownerId FROM ProposalEntity p WHERE p.ownerId IS NOT NULL ORDER BY p.ownerId")
    List<String> findDistinctOwnerIds();

    @Query("SELECT DISTINCT p.clientId FROM ProposalEntity p WHERE p.clientId IS NOT NULL ORDER BY p.clientId")
    List<String> findDistinctClientIds();

    @Query("SELECT DISTINCT p.opportunityId FROM ProposalEntity p WHERE p.opportunityId IS NOT NULL ORDER BY p.opportunityId")
    List<String> findDistinctOpportunityIds();

    @Query("SELECT DISTINCT p.serviceId FROM ProposalEntity p WHERE p.serviceId IS NOT NULL ORDER BY p.serviceId")
    List<String> findDistinctServiceIds();

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(p.totalAmount), 0) FROM ProposalEntity p")
    BigDecimal sumTotalAmount();
}
