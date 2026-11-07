package com.company.project.leave.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLeaveRequest {

    @Size(max = 30, message = "Employee ID cannot exceed 30 characters")
    private String employeeId;

    @Size(max = 100, message = "Employee name cannot exceed 100 characters")
    private String employeeName;

    @Size(max = 50, message = "Leave type cannot exceed 50 characters")
    private String leaveType;

    @Size(max = 50, message = "From date cannot exceed 50 characters")
    private String fromDate;

    @Size(max = 50, message = "To date cannot exceed 50 characters")
    private String toDate;

    @Min(value = 1, message = "Days must be at least 1")
    private Integer days;

    @Size(max = 2000, message = "Reason cannot exceed 2000 characters")
    private String reason;

    @Size(max = 50, message = "Approval status cannot exceed 50 characters")
    private String approvalStatus;

    @Size(max = 100, message = "Approved by cannot exceed 100 characters")
    private String approvedBy;

    private Integer calculatedDays;

    @Size(max = 50, message = "Leave status cannot exceed 50 characters")
    private String leaveStatus;
}

