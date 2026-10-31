package com.company.project.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortalNotificationResponse {
    private Long id;
    private String title;
    private String detail;
    private String type;
    private String link;
    private Boolean isRead;
    private OffsetDateTime createdAt;
}

