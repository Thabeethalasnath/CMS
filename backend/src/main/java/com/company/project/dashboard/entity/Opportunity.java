package com.company.project.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "opportunity_id", nullable = false, unique = true, length = 50)
    private String opportunityId;

    @Column(name = "lead_id", nullable = false, length = 50)
    private String leadId;

    @Column(name = "client_id", nullable = false, length = 50)
    private String clientId;

    @Column(name = "opportunity_name", nullable = false, length = 200)
    private String opportunityName;

    @Column(name = "owner_id", nullable = false, length = 50)
    private String ownerId;

    @Column(name = "service_id", nullable = false, length = 50)
    private String serviceId;

    @Column(nullable = false, length = 50)
    private String stage;

    @Column(nullable = false)
    private Integer probability;

    @Column(name = "estimated_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal estimatedValue;

    @Column(name = "expected_close_date", length = 50)
    private String expectedCloseDate;

    @Column(name = "last_contact", length = 50)
    private String lastContact;

    @Column(name = "next_follow_up", length = 50)
    private String nextFollowUp;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "lost_reason", length = 200)
    private String lostReason;

    @Column(name = "weighted_pipeline", nullable = false, precision = 15, scale = 2)
    private BigDecimal weightedPipeline;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.weightedPipeline == null && this.estimatedValue != null && this.probability != null) {
            this.weightedPipeline = this.estimatedValue.multiply(BigDecimal.valueOf(this.probability)).divide(BigDecimal.valueOf(100));
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.estimatedValue != null && this.probability != null) {
            this.weightedPipeline = this.estimatedValue.multiply(BigDecimal.valueOf(this.probability)).divide(BigDecimal.valueOf(100));
        }
    }
}

