package com.company.project.hr.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDto {
    private String id;
    private String name;
    private String email;
    private String role;
    private String department;
    private String status;
    private String createdDate;
    private Long daysInPipeline;
}

