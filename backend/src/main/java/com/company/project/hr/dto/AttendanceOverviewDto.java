package com.company.project.hr.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceOverviewDto {
    private Integer records;
    private Integer halfDays;
    private Integer lateRecords;
    private String effectiveDate;
}
