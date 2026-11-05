package com.company.project.collections.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendReminderRequest {

    @Size(max = 100, message = "Template name cannot exceed 100 characters")
    private String template;

    private Map<String, Boolean> channels;

    @NotBlank(message = "Recipient is required")
    @Size(max = 255, message = "Recipient cannot exceed 255 characters")
    private String recipient;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}

