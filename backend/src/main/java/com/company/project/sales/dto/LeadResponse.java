package com.company.project.sales.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadResponse {
    private String id;
    private LocalDate leadDate;
    private String company;
    private String contactName;
    private String email;
    private String phone;
    private String source;
    private String serviceInterest;
    private String country;
    private String city;
    private String ownerId;
    private String stage;
    private String status;
    private LocalDate nextFollowUp;
    private BigDecimal estimatedValue;
    private Integer leadScore;
    private BigDecimal expectedValue;
    private LocalDate expectedCloseDate;
    private String lostReason;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
