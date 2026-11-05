package com.company.project.projects.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProjectTaskRequest {
    private String projectId;
    private String milestone;
    private String taskName;
    private String assignedTo;
    private String priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private BigDecimal estimatedHours;
    private BigDecimal actualHours;
    private String status;
    private Integer progress;
    private String dependencies;
    private Integer subtasksCompleted;
    private Integer subtasksTotal;
    private String health;
}

