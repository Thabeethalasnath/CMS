package com.company.project.notification.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.notification.dto.CreateNotificationRequest;
import com.company.project.notification.dto.NotificationSummaryResponse;
import com.company.project.notification.dto.PortalNotificationResponse;
import com.company.project.notification.entity.PortalNotificationEntity;
import com.company.project.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<NotificationSummaryResponse>> getNotifications(
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        NotificationSummaryResponse summary = notificationService.getSummary(limit);
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully", summary));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Boolean>> markAsRead(@PathVariable("id") Long id) {
        boolean updated = notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", updated));
    }

    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse<Integer>> markAllAsRead() {
        int count = notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", count));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PortalNotificationResponse>> createNotification(
            @Valid @RequestBody CreateNotificationRequest request
    ) {
        PortalNotificationEntity created = notificationService.createNotification(
                request.getTitle(),
                request.getDetail(),
                request.getType(),
                request.getLink()
        );

        PortalNotificationResponse response = PortalNotificationResponse.builder()
                .id(created.getId())
                .title(created.getTitle())
                .detail(created.getDetail())
                .type(created.getType())
                .link(created.getLink())
                .isRead(created.getIsRead())
                .createdAt(created.getCreatedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Notification created successfully", response));
    }
}

