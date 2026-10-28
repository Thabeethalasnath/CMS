package com.company.project.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionRequest {
    private String action; // e.g. "MARK_DONE", "REOPEN", "LOG_NOTE", etc.
    private String notes;
}
