package com.company.project.hr.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private String id;
    private String name;
    private String email;
    private String department;
    private String role;
    private BigDecimal monthlyCtc;
    private String joiningDate;
    private String status;
    private String noticePeriodEnd;
}

