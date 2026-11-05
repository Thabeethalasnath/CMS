package com.company.project.attendance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private String id;
    private String attendanceDate;
    private String employeeId;
    private String employeeName;
    private String avatarInitials;
    private String avatarColor;
    private String status;
    private String checkIn;
    private String checkOut;
    private String workHours;
    private String overtimeHours;
    private Integer workMinutes;
    private Integer overtimeMinutes;
    private String dayType;
    @JsonProperty("isLate")
    private Boolean isLate;
    @JsonProperty("hasOvertime")
    private Boolean hasOvertime;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

