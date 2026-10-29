package com.company.project.dashboard.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.dashboard.dto.ApprovalsResponse;
import com.company.project.dashboard.dto.UpdateStatusRequest;
import com.company.project.dashboard.entity.ClientApproval;
import com.company.project.dashboard.entity.EmployeeApproval;
import com.company.project.dashboard.entity.TicketAssetApproval;
import com.company.project.dashboard.service.ApprovalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/approvals")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ApprovalController {

    private final ApprovalService approvalService;

    @GetMapping
    public ResponseEntity<ApiResponse<ApprovalsResponse>> getAllApprovals() {
        ApprovalsResponse response = approvalService.getAllApprovals();
        return ResponseEntity.ok(ApiResponse.success("Approvals fetched successfully", response));
    }

    @PutMapping("/employee/{id}/status")
    public ResponseEntity<ApiResponse<EmployeeApproval>> updateEmployeeStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        EmployeeApproval updated = approvalService.updateEmployeeStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Employee approval status updated", updated));
    }

    @PostMapping("/employee")
    public ResponseEntity<ApiResponse<EmployeeApproval>> createEmployeeApproval(
            @RequestBody EmployeeApproval request
    ) {
        EmployeeApproval created = approvalService.createEmployeeApproval(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee approval request created", created));
    }

    @PutMapping("/client/{id}/status")
    public ResponseEntity<ApiResponse<ClientApproval>> updateClientStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        ClientApproval updated = approvalService.updateClientStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Client approval status updated", updated));
    }

    @PostMapping("/client")
    public ResponseEntity<ApiResponse<ClientApproval>> createClientApproval(
            @RequestBody ClientApproval request
    ) {
        ClientApproval created = approvalService.createClientApproval(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Client approval request created", created));
    }

    @PutMapping("/ticket-asset/{id}/status")
    public ResponseEntity<ApiResponse<TicketAssetApproval>> updateTicketAssetStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        TicketAssetApproval updated = approvalService.updateTicketAssetStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Ticket/Asset approval status updated", updated));
    }

    @PostMapping("/ticket-asset")
    public ResponseEntity<ApiResponse<TicketAssetApproval>> createTicketAssetApproval(
            @RequestBody TicketAssetApproval request
    ) {
        TicketAssetApproval created = approvalService.createTicketAssetApproval(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ticket/Asset approval request created", created));
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<String>> resetSeedData() {
        approvalService.resetSeedData();
        return ResponseEntity.ok(ApiResponse.success("Approvals reset to initial state", "Reset completed"));
    }
}
