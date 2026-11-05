package com.company.project.finance.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateExpenseRequest {

    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Digits(integer = 12, fraction = 2, message = "Amount must have at most 12 integer digits and 2 decimal places")
    private BigDecimal amount;

    private boolean isProjectExpense;

    @Size(max = 255, message = "Project label must not exceed 255 characters")
    private String projectLabel;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    public String getNormalizedCategory() {
        if (category == null) return null;
        String trimmed = category.trim();
        if (trimmed.isEmpty()) return trimmed;
        return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1);
    }
}

