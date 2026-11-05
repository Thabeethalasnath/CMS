package com.company.project.clients.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {

    private String id;
    private String clientCode;
    private String clientName;
    private String companyName;
    private String industry;
    private String contactPerson;
    private String email;
    private String phone;
    private String country;
    private String city;
    private String clientType;
    private String accountOwner;
    private String status;
    private BigDecimal creditLimit;
    private String onboardingDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ClientResponse fromEntity(com.company.project.clients.entity.ClientEntity entity) {
        if (entity == null) return null;
        BigDecimal credit = null;
        if (entity.getCreditLimit() != null && !entity.getCreditLimit().isBlank()) {
            try {
                String cleaned = entity.getCreditLimit().replaceAll("[^0-9.]", "");
                credit = cleaned.isEmpty() ? null : new BigDecimal(cleaned);
            } catch (Exception ignored) {}
        }
        return ClientResponse.builder()
                .id(entity.getId())
                .clientCode(entity.getClientCode())
                .clientName(entity.getClientName())
                .companyName(entity.getCompanyName())
                .industry(entity.getIndustry())
                .contactPerson(entity.getContactPerson())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .country(entity.getCountry())
                .city(entity.getCity())
                .clientType(entity.getClientType())
                .accountOwner(entity.getAccountOwner())
                .status(entity.getStatus())
                .creditLimit(credit)
                .onboardingDate(entity.getOnboardingDate())
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

