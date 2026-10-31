package com.company.project.clients.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientEntity {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "client_code", length = 64, nullable = false)
    private String clientCode;

    @Column(name = "client_name", length = 255, nullable = false)
    private String clientName;

    @Column(name = "company_name", length = 255, nullable = false)
    private String companyName;

    @Column(name = "industry", length = 128, nullable = false)
    private String industry;

    @Column(name = "contact_person", length = 255, nullable = false)
    private String contactPerson;

    @Column(name = "email", length = 255, nullable = false)
    private String email;

    @Column(name = "phone", length = 64, nullable = false)
    private String phone;

    @Column(name = "country", length = 128, nullable = false)
    private String country;

    @Column(name = "city", length = 128, nullable = false)
    private String city;

    @Column(name = "client_type", length = 64, nullable = false)
    private String clientType;

    @Column(name = "account_owner", length = 128, nullable = false)
    private String accountOwner;

    @Column(name = "status", length = 64, nullable = false)
    private String status;

    @Column(name = "credit_limit", length = 64)
    private String creditLimit;

    @Column(name = "onboarding_date", length = 64)
    private String onboardingDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
