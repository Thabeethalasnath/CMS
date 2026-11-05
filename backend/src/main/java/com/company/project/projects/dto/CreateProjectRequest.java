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
public class CreateProjectRequest {

    private String id;

    @NotBlank(message = "Project code is required")
    private String projectCode;

    @NotBlank(message = "Project name is required")
    private String projectName;

    @NotBlank(message = "Client ID is required")
    private String clientId;

    @NotBlank(message = "Project manager is required")
    private String projectManager;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Planned end date is required")
    private LocalDate plannedEndDate;

    private String status;
    private String priority;
    private String health;
    private BigDecimal contractValue;
    private Integer tasksCompleted;
    private Integer tasksTotal;
    private Integer progress;
}

