package com.company.project.dashboard.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeMasterSummaryDto {
    private long totalEmployees;
    private String totalEmployeesTrend;
    private long activeEmployees;
    private String activeEmployeesTrend;
    private long onNoticeEmployees;
    private String onNoticeEmployeesTrend;
    private BigDecimal totalMonthlyCtc;
    private String totalMonthlyCtcFormatted;
    private String totalMonthlyCtcTrend;
}

