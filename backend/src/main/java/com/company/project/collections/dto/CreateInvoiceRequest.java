package com.company.project.collections.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateInvoiceRequest {

    private String invoiceId;

    private String clientId;

    @NotBlank(message = "Client name is required")
    private String client;

    @NotBlank(message = "Invoice date is required")
    private String invoiceDate;

    @NotBlank(message = "Due date is required")
    private String dueDate;

    @NotNull(message = "Outstanding amount is required")
    @PositiveOrZero(message = "Outstanding amount cannot be negative")
    private BigDecimal outstanding;

    private String statusOverride;

    private Boolean autoAssignIfTaken;
}
