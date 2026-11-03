package com.company.project.dashboard.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFollowUpItemRequest {

    @NotBlank(message = "Module name is required")
    private String moduleName;

    private String moduleCode;
    private String moduleSub;
    private String iconBg;
    private String iconColor;

    @NotNull(message = "Count is required")
    @Min(value = 0, message = "Count cannot be negative")
    private Integer count;

    private String countVariant;

    @NotBlank(message = "Key info title is required")
    private String keyInfoTitle;

    private String keyInfoSub;

    @NotBlank(message = "Priority is required (High, Medium, Low)")
    private String priority;

    @NotBlank(message = "Health is required (Overdue, Due Soon, On Track)")
    private String health;

    private String daysSinceLastFollowUp;
    private Boolean daysColorRed;
    private String primaryActionLabel;
    private String secondaryActionLabel;
    private String notes;
}
