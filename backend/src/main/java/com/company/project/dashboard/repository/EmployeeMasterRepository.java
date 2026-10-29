package com.company.project.dashboard.repository;

import com.company.project.dashboard.entity.EmployeeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeMasterRepository extends JpaRepository<EmployeeMaster, Long> {

    List<EmployeeMaster> findAllByOrderByOrderIndexAscIdAsc();

    Optional<EmployeeMaster> findByEmployeeId(String employeeId);

    boolean existsByEmployeeId(String employeeId);

    long countByStatusIgnoreCase(String status);

    @Query("SELECT COALESCE(SUM(e.monthlyCtc), 0) FROM EmployeeMaster e")
    BigDecimal sumTotalMonthlyCtc();
}

