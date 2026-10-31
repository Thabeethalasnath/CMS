package com.company.project.hr.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveApprovalDto {
    private Long id;
    private String employeeName;
    private String employeeCode;
    private String employeeId;
    private String department;
    private String requestType;
    private String leaveType;
    private String appliedDate;
    private String fromDate;
    private String toDate;
    private String startDate;
    private String endDate;
    private String duration;
    private Integer days;
    private String reason;
    private String status;
    private Integer sortOrder;
}
