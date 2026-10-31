package com.company.project.leave.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "leaves")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveEntity {

    @Id
    @Column(length = 30)
    private String id;

    @Column(name = "employee_id", nullable = false, length = 30)
    private String employeeId;

    @Column(name = "employee_name", nullable = false, length = 100)
    private String employeeName;

    @Column(name = "leave_type", nullable = false, length = 50)
    private String leaveType;

    @Column(name = "from_date", nullable = false, length = 50)
    private String fromDate;

    @Column(name = "to_date", nullable = false, length = 50)
    private String toDate;

    @Column(nullable = false)
    private Integer days;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "approval_status", nullable = false, length = 30)
    private String approvalStatus;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "calculated_days", nullable = false)
    private Integer calculatedDays;

    @Column(name = "leave_status", nullable = false, length = 30)
    private String leaveStatus;

    @Column(name = "applied_date", length = 50)
    private String appliedDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}

