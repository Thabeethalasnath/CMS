package com.company.project.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "attendance")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecordEntity {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @Column(name = "attendance_date", nullable = false, length = 50)
    private String attendanceDate;

    @Column(name = "employee_id", nullable = false, length = 30)
    private String employeeId;

    @Column(name = "employee_name", nullable = false, length = 100)
    private String employeeName;

    @Column(name = "avatar_initials", length = 10)
    private String avatarInitials;

    @Column(name = "avatar_color", length = 30)
    private String avatarColor;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "check_in", length = 30)
    private String checkIn;

    @Column(name = "check_out", length = 30)
    private String checkOut;

    @Column(name = "work_hours", length = 30)
    private String workHours;

    @Column(name = "overtime_hours", length = 30)
    private String overtimeHours;

    @Column(name = "work_minutes")
    private Integer workMinutes;

    @Column(name = "overtime_minutes")
    private Integer overtimeMinutes;

    @Column(name = "day_type", length = 30)
    private String dayType;

    @Column(name = "is_late")
    private Boolean isLate;

    @Column(name = "has_overtime")
    private Boolean hasOvertime;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}

