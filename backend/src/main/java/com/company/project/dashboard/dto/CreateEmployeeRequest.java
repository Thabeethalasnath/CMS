package com.company.project.dashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEmployeeRequest {

    private String employeeId;

    private String employeeCode;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String avatarInitials;

    private String avatarColor;

    private String avatarBg;

    @NotBlank(message = "Work email is required")
    private String workEmail;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation;

    private String employmentType;

    private String status;

    private String location;

    private String reportingManager;

    @NotBlank(message = "Joining date is required")
    private String joiningDate;

    private String tenureStatus;

    @NotNull(message = "Monthly CTC is required")
    private BigDecimal monthlyCtc;

    private BigDecimal annualCtc;

    private String gender;

    private Integer orderIndex;
}

