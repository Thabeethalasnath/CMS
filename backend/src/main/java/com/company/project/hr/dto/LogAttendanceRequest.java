package com.company.project.hr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogAttendanceRequest {

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Employee name is required")
    private String employeeName;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(?i)(Present|Half Day|Late|Leave|Absent)$", message = "Status must be Present, Half Day, Late, Leave, or Absent")
    private String status;

    private String attendanceDate;

    private String checkIn;

    private String checkOut;

    private String notes;
}

