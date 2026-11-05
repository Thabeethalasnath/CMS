package com.company.project.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceivablesAgeingBucketDto {
    private String bucketKey;
    private String label;
    private BigDecimal amount;
    private int percentage;
    private long count;
}

