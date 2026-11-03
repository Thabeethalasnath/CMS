package com.company.project.hr.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrDashboardResponse {
    private String lastUpdated;
    private WorkforceOverviewDto workforce;
    private RecruitmentOverviewDto recruitment;
    private LeaveOverviewDto leave;
    private AttendanceOverviewDto attendance;
    private LifecycleOverviewDto lifecycle;
    private List<RecentActivityDto> recentActivities;
}
