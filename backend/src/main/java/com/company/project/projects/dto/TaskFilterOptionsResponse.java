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
public class TaskFilterOptionsResponse {
    private List<String> projects;
    private List<String> milestones;
    private List<String> assignees;
    private List<String> statuses;
    private List<String> priorities;
}

