package com.company.project.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "employee_exit_records", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeExitEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exit_id", length = 50, nullable = false, unique = true)
    private String exitId;

    @Column(name = "employee_id", length = 50, nullable = false)
    private String employeeId;

    @Column(name = "employee_name", length = 255, nullable = false)
    private String employeeName;

    @Column(name = "resignation_date", nullable = false)
    private LocalDate resignationDate;

    @Column(name = "approval_date")
    private LocalDate approvalDate;

    @Column(name = "notice_period_days", nullable = false)
    @Builder.Default
    private Integer noticePeriodDays = 30;

    @Column(name = "last_working_day", nullable = false)
    private LocalDate lastWorkingDay;

    @Column(name = "exit_type", length = 50, nullable = false)
    private String exitType;

    @Column(name = "reason", length = 500, nullable = false)
    private String reason;

    @Column(name = "exit_status", length = 50, nullable = false)
    @Builder.Default
    private String exitStatus = "Pending";

    @Column(name = "assets_returned", length = 50, nullable = false)
    @Builder.Default
    private String assetsReturned = "Pending";

    @Column(name = "full_and_final_status", length = 50, nullable = false)
    @Builder.Default
    private String fullAndFinalStatus = "Pending";

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "notice_completion_date")
    private LocalDate noticeCompletionDate;

    @Column(name = "exit_readiness", length = 50, nullable = false)
    @Builder.Default
    private String exitReadiness = "Not Started";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}

