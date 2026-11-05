package com.company.project.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "hr_candidates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateEntity {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "role", nullable = false, length = 100)
    private String role;

    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}

