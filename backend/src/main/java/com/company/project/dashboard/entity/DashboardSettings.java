package com.company.project.dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dashboard_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "dashboard_title")
    private String dashboardTitle;

    @Column(name = "dashboard_subtitle")
    private String dashboardSubtitle;

    @Column(name = "active_date_range")
    private String activeDateRange;

    @Column(name = "last_updated")
    private String lastUpdated;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_role")
    private String userRole;
}
