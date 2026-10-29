package com.company.project.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false, unique = true, length = 50)
    private String employeeId;

    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "avatar_initials", nullable = false, length = 10)
    private String avatarInitials;

    @Column(name = "avatar_color", nullable = false, length = 50)
    private String avatarColor;

    @Column(name = "avatar_bg", nullable = false, length = 50)
    private String avatarBg;

    @Column(name = "work_email", nullable = false, length = 150)
    private String workEmail;

    @Column(nullable = false, length = 50)
    private String phone;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(name = "employment_type", nullable = false, length = 100)
    private String employmentType;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "reporting_manager", nullable = false, length = 100)
    private String reportingManager;

    @Column(name = "joining_date", nullable = false, length = 50)
    private String joiningDate;

    @Column(name = "tenure_status", nullable = false, length = 50)
    private String tenureStatus;

    @Column(name = "monthly_ctc", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyCtc;

    @Column(name = "annual_ctc", precision = 15, scale = 2)
    private BigDecimal annualCtc;

    @Column(length = 20)
    private String gender;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

