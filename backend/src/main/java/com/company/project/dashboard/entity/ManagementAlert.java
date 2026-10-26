package com.company.project.dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Entity
@Table(name = "management_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManagementAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alert_key", unique = true, nullable = false)
    private String alertKey;

    @Column(nullable = false)
    private String title;

    @Column(name = "alert_count", nullable = false)
    private Integer alertCount;

    @Column(name = "icon_type", nullable = false)
    private String iconType;

    @Column(name = "icon_color", nullable = false)
    private String iconColor;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
