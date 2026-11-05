package com.company.project.dashboard.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CreateClientApprovalRequest {

    @Size(max = 50, message = "Approval ID cannot exceed 50 characters")
    private String approvalId;

    @NotBlank(message = "Client name is required")
    @Size(max = 255, message = "Client name cannot exceed 255 characters")
    private String clientName;

    @NotBlank(message = "Request type is required")
    @Size(max = 100, message = "Request type cannot exceed 100 characters")
    private String requestType;

    @NotBlank(message = "Reference ID is required")
    @Size(max = 50, message = "Reference ID cannot exceed 50 characters")
    private String referenceId;

    @NotBlank(message = "Requester is required")
    @Size(max = 100, message = "Requester cannot exceed 100 characters")
    private String requester;

    @Size(max = 50, message = "Request date cannot exceed 50 characters")
    private String requestDate;

    @NotBlank(message = "Due date is required")
    @Size(max = 50, message = "Due date cannot exceed 50 characters")
    private String dueDate;

    @NotBlank(message = "Amount is required")
    @Size(max = 50, message = "Amount cannot exceed 50 characters")
    private String amount;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status cannot exceed 50 characters")
    private String status;

    private Integer sortOrder;
}

