package com.company.project.dashboard.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CreateEmployeeApprovalRequest {

    @NotBlank(message = "Employee name is required")
    @Size(max = 255, message = "Employee name cannot exceed 255 characters")
    private String employeeName;

    @NotBlank(message = "Employee code is required")
    @Size(max = 50, message = "Employee code cannot exceed 50 characters")
    private String employeeCode;

    @NotBlank(message = "Request type is required")
    @Size(max = 100, message = "Request type cannot exceed 100 characters")
    private String requestType;

    @Size(max = 50, message = "Applied date cannot exceed 50 characters")
    private String appliedDate;

    @NotBlank(message = "From date is required")
    @Size(max = 50, message = "From date cannot exceed 50 characters")
    private String fromDate;

    @NotBlank(message = "To date is required")
    @Size(max = 50, message = "To date cannot exceed 50 characters")
    private String toDate;

    @NotBlank(message = "Duration is required")
    @Size(max = 50, message = "Duration cannot exceed 50 characters")
    private String duration;

    @Size(max = 2000, message = "Reason cannot exceed 2000 characters")
    private String reason;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status cannot exceed 50 characters")
    private String status;

    private Integer sortOrder;
}

