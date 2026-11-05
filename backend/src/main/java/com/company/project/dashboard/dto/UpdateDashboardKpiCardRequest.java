package com.company.project.dashboard.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class UpdateDashboardKpiCardRequest {

    @Size(max = 100, message = "Card key cannot exceed 100 characters")
    private String cardKey;

    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private BigDecimal rawValue;

    @Size(max = 100, message = "Formatted value cannot exceed 100 characters")
    private String formattedValue;

    private BigDecimal changePercentage;

    @Size(max = 50, message = "Change type cannot exceed 50 characters")
    private String changeType;

    @Size(max = 255, message = "Comparison text cannot exceed 255 characters")
    private String comparisonText;

    @Size(max = 50, message = "Icon type cannot exceed 50 characters")
    private String iconType;

    @Size(max = 50, message = "Color theme cannot exceed 50 characters")
    private String colorTheme;

    private Integer sortOrder;
}

