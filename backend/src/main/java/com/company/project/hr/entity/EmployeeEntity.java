package com.company.project.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "employee_id", nullable = false, length = 50)
    private String employeeId;

    @Column(name = "employee_code", length = 50)
    private String employeeCode;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "avatar_initials", length = 10)
    private String avatarInitials;

    @Column(name = "avatar_color", length = 50)
    private String avatarColor;

    @Column(name = "avatar_bg", length = 50)
    private String avatarBg;

    @Column(name = "work_email", nullable = false, length = 150)
    private String workEmail;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @Column(name = "designation", nullable = false, length = 100)
    private String designation;

    @Column(name = "employment_type", length = 100)
    private String employmentType;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "reporting_manager", length = 100)
    private String reportingManager;

    @Column(name = "joining_date", nullable = false, length = 50)
    private String joiningDate;

    @Column(name = "tenure_status", length = 50)
    private String tenureStatus;

    @Column(name = "monthly_ctc", nullable = false, precision = 14, scale = 2)
    private BigDecimal monthlyCtc;

    @Column(name = "annual_ctc", precision = 14, scale = 2)
    private BigDecimal annualCtc;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
