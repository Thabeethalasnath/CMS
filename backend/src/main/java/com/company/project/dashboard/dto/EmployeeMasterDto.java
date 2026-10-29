package com.company.project.dashboard.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeMasterDto {
    private Long id;
    private String employeeId;
    private String employeeCode;
    private String fullName;
    private String avatarInitials;
    private String avatarColor;
    private String avatarBg;
    private String workEmail;
    private String phone;
    private String department;
    private String designation;
    private String employmentType;
    private String status;
    private String location;
    private String reportingManager;
    private String joiningDate;
    private String tenureStatus;
    private BigDecimal monthlyCtc;
    private String monthlyCtcFormatted;
    private BigDecimal annualCtc;
    private String annualCtcFormatted;
    private String gender;
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

