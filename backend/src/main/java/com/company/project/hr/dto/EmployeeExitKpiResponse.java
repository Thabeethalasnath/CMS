package com.company.project.hr.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeExitKpiResponse {

    private long totalExitRequests;
    private int totalExitRequestsTrend;
    private long approvedExits;
    private int approvedExitsTrend;
    private long pendingApprovals;
    private int pendingApprovalsTrend;
    private long completedExits;
    private int completedExitsTrend;
}

