package com.company.project.hr.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "hr_activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrActivityEntity {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "activity_date", nullable = false, length = 50)
    private String activityDate;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "type_color", nullable = false, length = 50)
    private String typeColor;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        if (updatedAt == null) {
            updatedAt = OffsetDateTime.now();
        }
    }
}
