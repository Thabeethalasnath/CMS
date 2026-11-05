package com.company.project.projects.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectKpiResponse {
    private long totalProjects;
    private String totalProjectsTrend;
    private long activeProjects;
    private String activeProjectsTrend;
    private long projectsAtRisk;
    private String projectsAtRiskTrend;
    private BigDecimal totalContractValue;
    private String totalContractValueFormatted;
    private String totalContractValueTrend;
}

