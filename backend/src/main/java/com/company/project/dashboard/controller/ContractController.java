package com.company.project.dashboard.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.dashboard.dto.ContractDto;
import com.company.project.dashboard.dto.ContractSummaryDto;
import com.company.project.dashboard.dto.CreateContractRequest;
import com.company.project.dashboard.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
@Tag(name = "Contracts", description = "Endpoints for managing client contracts")
public class ContractController {

    private final ContractService service;

    @GetMapping
    @Operation(summary = "Get all contracts with optional client, proposal, contract type, status, and search filters")
    public ResponseEntity<ApiResponse<List<ContractDto>>> getAllContracts(
            @RequestParam(required = false) String clientId,
            @RequestParam(required = false) String proposalId,
            @RequestParam(required = false) String contractType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        List<ContractDto> list = service.getAllContracts(clientId, proposalId, contractType, status, search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get summary metrics for KPI cards on Contracts page")
    public ResponseEntity<ApiResponse<ContractSummaryDto>> getSummary() {
        ContractSummaryDto summary = service.getSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single contract by ID")
    public ResponseEntity<ApiResponse<ContractDto>> getById(@PathVariable Long id) {
        ContractDto dto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new contract")
    public ResponseEntity<ApiResponse<ContractDto>> createContract(
            @Valid @RequestBody CreateContractRequest request
    ) {
        ContractDto created = service.createContract(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Contract created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing contract")
    public ResponseEntity<ApiResponse<ContractDto>> updateContract(
            @PathVariable Long id,
            @Valid @RequestBody CreateContractRequest request
    ) {
        ContractDto updated = service.updateContract(id, request);
        return ResponseEntity.ok(ApiResponse.success("Contract updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a contract")
    public ResponseEntity<ApiResponse<Void>> deleteContract(@PathVariable Long id) {
        service.deleteContract(id);
        return ResponseEntity.ok(ApiResponse.success("Contract deleted successfully", null));
    }

    @PostMapping("/reset")
    @Operation(summary = "Reset contract table to initial seed dataset")
    public ResponseEntity<ApiResponse<Void>> resetSeedData() {
        service.resetSeedData();
        return ResponseEntity.ok(ApiResponse.success("Contracts reset to seed data successfully", null));
    }
}

