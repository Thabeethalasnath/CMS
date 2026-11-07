package com.company.project.attendance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAttendanceRequest {

    @NotBlank(message = "Attendance date is required")
    @Size(max = 50, message = "Attendance date cannot exceed 50 characters")
    private String attendanceDate;

    @NotBlank(message = "Employee ID is required")
    @Size(max = 30, message = "Employee ID cannot exceed 30 characters")
    private String employeeId;

    @NotBlank(message = "Employee name is required")
    @Size(max = 100, message = "Employee name cannot exceed 100 characters")
    private String employeeName;

    @Size(max = 10, message = "Avatar initials cannot exceed 10 characters")
    private String avatarInitials;

    @Size(max = 30, message = "Avatar color cannot exceed 30 characters")
    private String avatarColor;

    @NotBlank(message = "Status is required")
    @Size(max = 30, message = "Status cannot exceed 30 characters")
    private String status;

    @Size(max = 30, message = "Check in time cannot exceed 30 characters")
    private String checkIn;

    @Size(max = 30, message = "Check out time cannot exceed 30 characters")
    private String checkOut;

    @Size(max = 30, message = "Work hours cannot exceed 30 characters")
    private String workHours;

    @Size(max = 30, message = "Overtime hours cannot exceed 30 characters")
    private String overtimeHours;

    @PositiveOrZero(message = "Work minutes must be positive or zero")
    private Integer workMinutes;

    @PositiveOrZero(message = "Overtime minutes must be positive or zero")
    private Integer overtimeMinutes;

    @Size(max = 30, message = "Day type cannot exceed 30 characters")
    private String dayType;

    @JsonProperty("isLate")
    private Boolean isLate;

    @JsonProperty("hasOvertime")
    private Boolean hasOvertime;

    @Size(max = 2000, message = "Notes cannot exceed 2000 characters")
    private String notes;
}

