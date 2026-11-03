package com.company.project.sales.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLeadRequest {

    private LocalDate leadDate;

    @Size(max = 255)
    private String company;

    @Size(max = 255)
    private String contactName;

    @Email(message = "Valid email is required")
    private String email;

    @Pattern(regexp = "^[0-9+()\\s-]{7,25}$", message = "Valid phone number is required")
    private String phone;

    private String source;
    private String serviceInterest;
    private String country;
    private String city;
    private String ownerId;
    private String stage;
    private String status;
    private LocalDate nextFollowUp;

    @DecimalMin(value = "0.0", inclusive = true, message = "Estimated value must be non-negative")
    private BigDecimal estimatedValue;

    @Min(value = 0, message = "Lead score must be at least 0")
    @Max(value = 100, message = "Lead score must be at most 100")
    private Integer leadScore;

    private BigDecimal expectedValue;
    private LocalDate expectedCloseDate;
    private String lostReason;
    private String notes;
}
