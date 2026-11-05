package com.company.project.hr.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentOverviewDto {
    private Integer openCandidates;
    private Integer candidatesOver30Days;
}
