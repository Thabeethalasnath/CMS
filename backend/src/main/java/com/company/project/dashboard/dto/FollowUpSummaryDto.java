package com.company.project.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowUpSummaryDto {
    private long highPriorityCount;
    private long mediumPriorityCount;
    private long lowPriorityCount;
    private long totalPendingItems;
    private long totalCompletedItems;
    private LocalDateTime lastRefreshed;
}
