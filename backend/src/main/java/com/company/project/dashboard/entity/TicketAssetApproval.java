package com.company.project.dashboard.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_asset_approvals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class TicketAssetApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "approval_id", nullable = false, length = 50)
    private String approvalId;

    @Column(name = "record_type", nullable = false, length = 50)
    private String recordType;

    @Column(name = "record_code", nullable = false, length = 50)
    private String recordCode;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "client_requester", nullable = false, length = 100)
    private String clientRequester;

    @Column(name = "approval_type", nullable = false, length = 100)
    private String approvalType;

    @Column(name = "priority", nullable = false, length = 50)
    private String priority;

    @Column(name = "request_date", nullable = false, length = 50)
    private String requestDate;

    @Column(name = "assigned_approver", nullable = false, length = 100)
    private String assignedApprover;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "decided_at")
    private LocalDateTime decidedAt;

}
