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
public class PaymentRecordResponse {
    private String id;
    private String invoiceId;
    private String client;
    private String date;
    private BigDecimal amount;
    private String method;
    private String referenceId;
    private String notes;
}
