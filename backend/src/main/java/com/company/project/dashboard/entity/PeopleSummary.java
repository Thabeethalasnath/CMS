package com.company.project.dashboard.entity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Entity
@Table(name = "people_summary")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class PeopleSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "active_employees", nullable = false)
    private Integer activeEmployees;

    @Column(name = "new_joiners_ytd", nullable = false)
    private Integer newJoinersYtd;

    @Column(name = "exits_ytd", nullable = false)
    private Integer exitsYtd;

    @Column(name = "net_growth", nullable = false)
    private Integer netGrowth;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
