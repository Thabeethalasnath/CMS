package com.company.project.hr.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDto {
    private String id;
    private String employeeId;
    private String employeeName;
    private String attendanceDate;
    private String date;
    private String department;
    private String status;
    private String checkIn;
    private String checkOut;
    private String workHours;
    private Boolean isLate;
    private String notes;
}
