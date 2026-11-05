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
public class UpdateProjectRequest {
    private String projectCode;
    private String projectName;
    private String clientId;
    private String projectManager;
    private LocalDate startDate;
    private LocalDate plannedEndDate;
    private String status;
    private String priority;
    private String health;
    private BigDecimal contractValue;
    private Integer tasksCompleted;
    private Integer tasksTotal;
    private Integer progress;
}

