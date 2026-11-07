package com.company.project.projects.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateProjectTaskRequest {

    private String id;

    @NotBlank(message = "Project ID is required")
    private String projectId;

    @NotBlank(message = "Milestone is required")
    private String milestone;

    @NotBlank(message = "Task name is required")
    private String taskName;

    @NotBlank(message = "Assigned To is required")
    private String assignedTo;

    private String priority;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Due date is required")
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

