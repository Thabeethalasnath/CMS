package com.company.project.dashboard.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "people_monthly")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class PeopleMonthly {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "month_name", nullable = false)
    private String monthName;

    @Column(name = "employee_count", nullable = false)
    private Integer employeeCount;

    @Column(name = "net_payroll", nullable = false)
    private BigDecimal netPayroll;

    @Column(name = "employer_payroll_cost", nullable = false)
    private BigDecimal employerPayrollCost;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
