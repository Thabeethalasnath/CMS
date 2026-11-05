package com.company.project.hr.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeExitFilterOptionsResponse {
    private List<String> exitStatuses;
    private List<String> exitTypes;
    private List<Integer> noticePeriods;
    private List<String> approvalStatuses;
    private List<String> dateRanges;
}

