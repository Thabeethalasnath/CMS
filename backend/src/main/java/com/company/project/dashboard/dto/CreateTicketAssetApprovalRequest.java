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
public class CreateTicketAssetApprovalRequest {

    @Size(max = 50, message = "Approval ID cannot exceed 50 characters")
    private String approvalId;

    @NotBlank(message = "Record type is required")
    @Size(max = 50, message = "Record type cannot exceed 50 characters")
    private String recordType;

    @NotBlank(message = "Record code is required")
    @Size(max = 50, message = "Record code cannot exceed 50 characters")
    private String recordCode;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Client requester is required")
    @Size(max = 100, message = "Client requester cannot exceed 100 characters")
    private String clientRequester;

    @NotBlank(message = "Approval type is required")
    @Size(max = 100, message = "Approval type cannot exceed 100 characters")
    private String approvalType;

    @NotBlank(message = "Priority is required")
    @Size(max = 50, message = "Priority cannot exceed 50 characters")
    private String priority;

    @Size(max = 50, message = "Request date cannot exceed 50 characters")
    private String requestDate;

    @NotBlank(message = "Assigned approver is required")
    @Size(max = 100, message = "Assigned approver cannot exceed 100 characters")
    private String assignedApprover;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status cannot exceed 50 characters")
    private String status;

    private Integer sortOrder;
}

