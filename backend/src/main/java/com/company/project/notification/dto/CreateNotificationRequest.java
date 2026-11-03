package com.company.project.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Detail is required")
    private String detail;

    private String type;
    private String link;
}

