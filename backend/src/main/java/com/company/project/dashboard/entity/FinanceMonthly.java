package com.company.project.dashboard.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "finance_monthly")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class FinanceMonthly {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "month_name", nullable = false)
    private String monthName;

    @Column(name = "invoice_value", nullable = false)
    private BigDecimal invoiceValue;

    @Column(name = "collected_payments", nullable = false)
    private BigDecimal collectedPayments;

    @Column(name = "outstanding_receivables", nullable = false)
    private BigDecimal outstandingReceivables;

    @Column(name = "expenses", nullable = false)
    private BigDecimal expenses;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
