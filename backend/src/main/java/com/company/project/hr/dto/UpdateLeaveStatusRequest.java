package com.company.project.hr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLeaveStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(?i)(Approved|Rejected)$", message = "Status must be either 'Approved' or 'Rejected'")
    private String status;
}

