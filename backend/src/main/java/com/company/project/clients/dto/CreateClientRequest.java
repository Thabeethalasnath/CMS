package com.company.project.clients.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClientRequest {

    @Size(max = 64, message = "Client code cannot exceed 64 characters")
    private String clientCode;

    @NotBlank(message = "Client name is required")
    @Size(max = 255, message = "Client name cannot exceed 255 characters")
    private String clientName;

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name cannot exceed 255 characters")
    private String companyName;

    @NotBlank(message = "Industry is required")
    @Size(max = 128, message = "Industry cannot exceed 128 characters")
    private String industry;

    @NotBlank(message = "Contact person is required")
    @Size(max = 255, message = "Contact person cannot exceed 255 characters")
    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9+()\\s-]{7,30}$", message = "Phone number format is invalid")
    @Size(max = 64, message = "Phone number cannot exceed 64 characters")
    private String phone;

    @NotBlank(message = "Country is required")
    @Size(max = 128, message = "Country cannot exceed 128 characters")
    private String country;

    @NotBlank(message = "City is required")
    @Size(max = 128, message = "City cannot exceed 128 characters")
    private String city;

    @NotBlank(message = "Client type is required")
    @Size(max = 64, message = "Client type cannot exceed 64 characters")
    private String clientType;

    @NotBlank(message = "Account owner is required")
    @Size(max = 128, message = "Account owner cannot exceed 128 characters")
    private String accountOwner;

    @NotBlank(message = "Status is required")
    @Size(max = 64, message = "Status cannot exceed 64 characters")
    private String status;

    @PositiveOrZero(message = "Credit limit must be positive or zero")
    @Digits(integer = 12, fraction = 2, message = "Credit limit must have at most 12 integer digits and 2 decimals")
    private BigDecimal creditLimit;

    @Size(max = 64, message = "Onboarding date cannot exceed 64 characters")
    private String onboardingDate;

    @Size(max = 2000, message = "Notes cannot exceed 2000 characters")
    private String notes;
}

