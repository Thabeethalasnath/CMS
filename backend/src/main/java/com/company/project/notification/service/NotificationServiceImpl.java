package com.company.project.notification.service;

import com.company.project.notification.dto.NotificationSummaryResponse;
import com.company.project.notification.dto.PortalNotificationResponse;
import com.company.project.notification.entity.PortalNotificationEntity;
import com.company.project.notification.repository.PortalNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final PortalNotificationRepository repository;

    @Override
    @Transactional
    public NotificationSummaryResponse getSummary(int limit) {
        if (repository.count() == 0) {
            seedInitialNotifications();
        }

        int pageSize = limit > 0 ? Math.min(limit, 50) : 10;
        List<PortalNotificationEntity> entities = repository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, pageSize));
        long unread = repository.countByIsReadFalse();

        List<PortalNotificationResponse> dtos = entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return NotificationSummaryResponse.builder()
                .unreadCount(unread)
                .notifications(dtos)
                .build();
    }

    @Override
    @Transactional
    public PortalNotificationEntity createNotification(String title, String detail, String type, String link) {
        PortalNotificationEntity entity = PortalNotificationEntity.builder()
                .title(title)
                .detail(detail)
                .type(type != null ? type : "INFO")
                .link(link)
                .isRead(false)
                .build();
        return repository.save(entity);
    }

    @Override
    @Transactional
    public boolean markAsRead(Long id) {
        return repository.findById(id).map(notif -> {
            notif.setIsRead(true);
            repository.save(notif);
            return true;
        }).orElse(false);
    }

    @Override
    @Transactional
    public int markAllAsRead() {
        return repository.markAllAsRead();
    }

    private PortalNotificationResponse toResponse(PortalNotificationEntity entity) {
        return PortalNotificationResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .detail(entity.getDetail())
                .type(entity.getType())
                .link(entity.getLink())
                .isRead(entity.getIsRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private void seedInitialNotifications() {
        createNotification(
                "Pending Approval Request",
                "Arun S (EMP-0012) submitted sick leave request for 3 days.",
                "APPROVAL",
                "/management/approval-inbox"
        );
        createNotification(
                "Follow-Up Task Due",
                "Follow-up scheduled with Infosys BPM Limited regarding proposal review.",
                "FOLLOW_UP",
                "/management/follow-up-queue"
        );
        createNotification(
                "Invoice Overdue Notice",
                "Invoice INV-2024-001 is pending collection past payment due date.",
                "INVOICE",
                "/management/collections"
        );
    }
}

