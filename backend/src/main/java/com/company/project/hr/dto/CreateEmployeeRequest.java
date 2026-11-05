package com.company.project.hr.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEmployeeRequest {

    @NotBlank(message = "Employee name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email address is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;

    @NotBlank(message = "Role is required")
    @Size(max = 100, message = "Role must not exceed 100 characters")
    private String role;

    @NotNull(message = "Monthly CTC is required")
    @DecimalMin(value = "0.01", message = "Monthly CTC must be greater than zero")
    private BigDecimal monthlyCtc;

    @NotBlank(message = "Joining date is required")
    private String joiningDate;

    private String status;

    private String noticePeriodEnd;
}

