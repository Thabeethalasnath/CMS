package com.company.project.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "finance_targets", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceTargetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_key", length = 100, nullable = false, unique = true)
    private String metricKey;

    @Column(name = "target_value", precision = 14, scale = 2, nullable = false)
    private BigDecimal targetValue;

    @Column(name = "comparison_direction", length = 20, nullable = false)
    @Builder.Default
    private String comparisonDirection = "HIGHER_IS_BETTER";

    @Column(name = "basis", length = 30, nullable = false)
    @Builder.Default
    private String basis = "MONTHLY";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}

