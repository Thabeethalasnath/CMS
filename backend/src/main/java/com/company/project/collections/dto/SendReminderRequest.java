package com.company.project.collections.dto;

import jakarta.validation.constraints.NotBlank;
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
    private String template;
    private Map<String, Boolean> channels;
    private String recipient;
    private String notes;
}

