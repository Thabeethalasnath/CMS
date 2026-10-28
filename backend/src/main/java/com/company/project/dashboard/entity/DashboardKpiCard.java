package com.company.project.dashboard.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "dashboard_kpi_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DashboardKpiCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "card_key", unique = true, nullable = false)
    private String cardKey;

    @Column(nullable = false)
    private String title;

    @Column(name = "raw_value", nullable = false)
    private BigDecimal rawValue;

    @Column(name = "formatted_value", nullable = false)
    private String formattedValue;

    @Column(name = "change_percentage", nullable = false)
    private BigDecimal changePercentage;

    @Column(name = "change_type", nullable = false)
    private String changeType;

    @Column(name = "comparison_text")
    private String comparisonText;

    @Column(name = "icon_type", nullable = false)
    private String iconType;

    @Column(name = "color_theme", nullable = false)
    private String colorTheme;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
