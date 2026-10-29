package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findAllByOrderByOrderIndexAscIdAsc();

    Optional<Contract> findByContractId(String contractId);

    boolean existsByContractId(String contractId);

    long countByStatusIgnoreCase(String status);

    @Query("SELECT COALESCE(SUM(c.contractValue), 0) FROM Contract c")
    BigDecimal sumTotalContractValue();
}

