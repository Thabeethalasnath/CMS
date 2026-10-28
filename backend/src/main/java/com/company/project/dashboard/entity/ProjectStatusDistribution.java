package com.company.project.dashboard.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_status_distribution")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ProjectStatusDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status_name", nullable = false)
    private String statusName;

    @Column(name = "project_count", nullable = false)
    private Integer projectCount;

    @Column(nullable = false)
    private Integer percentage;

    @Column(name = "color_hex", nullable = false)
    private String colorHex;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
