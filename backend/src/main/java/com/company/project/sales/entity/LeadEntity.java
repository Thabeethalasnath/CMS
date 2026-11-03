package com.company.project.sales.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadEntity {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "lead_date", nullable = false)
    private LocalDate leadDate;

    @Column(name = "company", length = 255, nullable = false)
    private String company;

    @Column(name = "contact_name", length = 255, nullable = false)
    private String contactName;

    @Column(name = "email", length = 255, nullable = false)
    private String email;

    @Column(name = "phone", length = 64, nullable = false)
    private String phone;

    @Column(name = "source", length = 64, nullable = false)
    private String source;

    @Column(name = "service_interest", length = 128, nullable = false)
    private String serviceInterest;

    @Column(name = "country", length = 128, nullable = false)
    private String country;

    @Column(name = "city", length = 128, nullable = false)
    private String city;

    @Column(name = "owner_id", length = 128, nullable = false)
    private String ownerId;

    @Column(name = "stage", length = 64, nullable = false)
    private String stage;

    @Column(name = "status", length = 64, nullable = false)
    private String status;

    @Column(name = "next_follow_up")
    private LocalDate nextFollowUp;

    @Column(name = "estimated_value", precision = 14, scale = 2)
    private BigDecimal estimatedValue;

    @Column(name = "lead_score")
    private Integer leadScore;

    @Column(name = "expected_value", precision = 14, scale = 2)
    private BigDecimal expectedValue;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    @Column(name = "lost_reason", length = 255)
    private String lostReason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
