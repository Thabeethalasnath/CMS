package com.company.project.collections.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogCommunicationRequest {
    @NotBlank(message = "Communication type is required")
    private String communicationType; // CALL, EMAIL, MEETING

    private String recipient;
    private String subject;
    private String message;
    private String loggedBy;
}

