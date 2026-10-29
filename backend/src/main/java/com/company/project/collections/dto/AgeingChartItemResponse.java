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
public class AgeingChartItemResponse {
    private String bucket;
    private BigDecimal amount;
    private long count;
    private String color;
}
