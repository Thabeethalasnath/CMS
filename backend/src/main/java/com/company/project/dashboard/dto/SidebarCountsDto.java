package com.company.project.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SidebarCountsDto {
    private long pendingApprovals;
    private long overdueFollowUps;
}

