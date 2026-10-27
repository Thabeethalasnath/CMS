package com.company.project.dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sales_pipeline_stages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesPipelineStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stage_name", nullable = false)
    private String stageName;

    @Column(name = "lead_count", nullable = false)
    private Integer leadCount;

    @Column(name = "conversion_rate", nullable = false)
    private Integer conversionRate;

    @Column(name = "color_hex", nullable = false)
    private String colorHex;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
