package com.company.project.collections.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    private String id;
    private String clientId;
    private String client;
    private String invoiceDate;
    private String dueDate;
    private BigDecimal invoiceAmount;
    private BigDecimal amountPaid;
    private BigDecimal outstanding;
    private Integer daysOverdue;
    private String ageingBucket;
    private String status;
    private String recommendedAction;
}
