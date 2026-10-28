package com.company.project.collections.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NextInvoiceIdResponse {
    private String nextInvoiceId;
    private Integer year;
    private Long sequenceNumber;
    private String format;
}
