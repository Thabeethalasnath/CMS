package com.company.project.leave.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLeaveRequest {

    private String employeeId;
    private String employeeName;
    private String leaveType;
    private String fromDate;
    private String toDate;
    private Integer days;
    private String reason;
    private String approvalStatus;
    private String approvedBy;
    private Integer calculatedDays;
    private String leaveStatus;
}

