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
public class FollowUpItemDto {
    private Long id;
    private String moduleCode;
    private String moduleName;
    private String moduleSub;
    private String iconBg;
    private String iconColor;
    private Integer count;
    private String countVariant;
    private String keyInfoTitle;
    private String keyInfoSub;
    private String priority;
    private String health;
    private String daysSinceLastFollowUp;
    private Boolean daysColorRed;
    private String primaryActionLabel;
    private String secondaryActionLabel;
    private Boolean isDone;
    private String notes;
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
