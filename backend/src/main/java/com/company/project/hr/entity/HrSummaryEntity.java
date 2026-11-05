package com.company.project.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "hr_summary")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrSummaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "active_employees", nullable = false)
    private Integer activeEmployees;

    @Column(name = "on_notice", nullable = false)
    private Integer onNotice;

    @Column(name = "total_monthly_ctc", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalMonthlyCtc;

    @Column(name = "new_hires_this_month", nullable = false)
    private Integer newHiresThisMonth;

    @Column(name = "open_candidates", nullable = false)
    private Integer openCandidates;

    @Column(name = "candidates_over_30_days", nullable = false)
    private Integer candidatesOver30Days;

    @Column(name = "pending_leave_approvals", nullable = false)
    private Integer pendingLeaveApprovals;

    @Column(name = "attendance_records", nullable = false)
    private Integer attendanceRecords;

    @Column(name = "half_days", nullable = false)
    private Integer halfDays;

    @Column(name = "late_records", nullable = false)
    private Integer lateRecords;

    @Column(name = "employees_exiting", nullable = false)
    private Integer employeesExiting;

    @Column(name = "last_updated", nullable = false)
    private OffsetDateTime lastUpdated;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
