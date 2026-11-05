package com.company.project.projects.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectFilterOptionsResponse {
    private List<String> clients;
    private List<String> managers;
    private List<String> statuses;
    private List<String> priorities;
}

