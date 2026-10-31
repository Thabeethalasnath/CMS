package com.company.project.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "employee_approvals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeApprovalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_name", nullable = false, length = 100)
    private String employeeName;

    @Column(name = "employee_code", nullable = false, length = 50)
    private String employeeCode;

    @Column(name = "request_type", nullable = false, length = 50)
    private String requestType;

    @Column(name = "applied_date", nullable = false, length = 50)
    private String appliedDate;

    @Column(name = "from_date", nullable = false, length = 50)
    private String fromDate;

    @Column(name = "to_date", nullable = false, length = 50)
    private String toDate;

    @Column(name = "duration", nullable = false, length = 50)
    private String duration;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

