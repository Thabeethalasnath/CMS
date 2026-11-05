package com.company.project.dashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionRequest {

    @NotBlank(message = "Action is required")
    @Size(max = 50, message = "Action cannot exceed 50 characters")
    private String action; // e.g. "MARK_DONE", "REOPEN", "LOG_NOTE", etc.

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}
