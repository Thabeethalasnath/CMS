package com.company.project.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private LocalDate expenseDate;
    private String category;
    private BigDecimal amount;
    private boolean isProjectExpense;
    private String projectLabel;
    private String description;
    private String createdBy;
    private OffsetDateTime createdAt;
}

