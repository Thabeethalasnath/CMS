package com.company.project.hr.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeExitResponse {

    private String id;
    private String exitId;
    private String employeeId;
    private String employeeName;
    private String resignationDate;
    private String approvalDate;
    private Integer noticePeriodDays;
    private String lastWorkingDay;
    private String exitType;
    private String reason;
    private String exitStatus;
    private String assetsReturned;
    private String fullAndFinalStatus;
    private String notes;
    private String noticeCompletionDate;
    private String exitReadiness;
    private String createdAt;
    private String updatedAt;
}

