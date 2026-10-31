package com.company.project.leave.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveMetricsResponse {

    private long totalRequests;
    private String totalRequestsTrend;

    private long approvedRequests;
    private String approvedRequestsTrend;

    private long pendingRequests;
    private String pendingRequestsTrend;

    private long rejectedRequests;
    private String rejectedRequestsTrend;
}

