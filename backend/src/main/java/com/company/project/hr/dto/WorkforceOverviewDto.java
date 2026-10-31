package com.company.project.hr.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkforceOverviewDto {
    private Integer activeEmployees;
    private Integer onNotice;
    private String totalMonthlyCtc;
    private Integer newHiresThisMonth;
}
