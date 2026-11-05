package com.company.project.hr.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDto {
    private String id;
    private String date;
    private String rawDate;
    private String type;
    private String typeColor;
    private String description;
    private String status;
    private String department;
}
