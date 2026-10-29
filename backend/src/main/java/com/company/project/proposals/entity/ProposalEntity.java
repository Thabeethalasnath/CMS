package com.company.project.proposals.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "proposals", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalEntity {

    @Id
    @Column(name = "id", length = 50, nullable = false)
    private String id;

    @Column(name = "opportunity_id", length = 50, nullable = false)
    private String opportunityId;

    @Column(name = "client_id", length = 50, nullable = false)
    private String clientId;

    @Column(name = "client_name", length = 255)
    private String clientName;

    @Column(name = "proposal_date", nullable = false)
    private LocalDate proposalDate;

    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @Column(name = "version", length = 50, nullable = false)
    @Builder.Default
    private String version = "V1.0";

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Column(name = "service_id", length = 50, nullable = false)
    private String serviceId;

    @Column(name = "service_name", length = 255)
    private String serviceName;

    @Column(name = "service_before_tax", precision = 14, scale = 2, nullable = false)
    private BigDecimal serviceBeforeTax;

    @Column(name = "tax_amount", precision = 14, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 14, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "owner_id", length = 50, nullable = false)
    private String ownerId;

    @Column(name = "owner_name", length = 255)
    private String ownerName;

    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @Column(name = "expected_decision_date", nullable = false)
    private LocalDate expectedDecisionDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
