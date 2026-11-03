package com.company.project.dashboard.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.dashboard.dto.CreateOpportunityRequest;
import com.company.project.dashboard.dto.OpportunityDto;
import com.company.project.dashboard.dto.OpportunitySummaryDto;
import com.company.project.dashboard.service.OpportunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/opportunities")
@RequiredArgsConstructor
@Tag(name = "Opportunities", description = "Endpoints for managing sales opportunities")
public class OpportunityController {

    private final OpportunityService service;

    @GetMapping
    @Operation(summary = "Get all opportunities with optional stage, status, owner, client, service, and search filters")
    public ResponseEntity<ApiResponse<List<OpportunityDto>>> getAllOpportunities(
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ownerId,
            @RequestParam(required = false) String clientId,
            @RequestParam(required = false) String serviceId,
            @RequestParam(required = false) String search
    ) {
        List<OpportunityDto> list = service.getAllOpportunities(stage, status, ownerId, clientId, serviceId, search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get summary metrics for KPI cards on Opportunities page")
    public ResponseEntity<ApiResponse<OpportunitySummaryDto>> getSummary() {
        OpportunitySummaryDto summary = service.getSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single opportunity by ID")
    public ResponseEntity<ApiResponse<OpportunityDto>> getById(@PathVariable Long id) {
        OpportunityDto dto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new opportunity")
    public ResponseEntity<ApiResponse<OpportunityDto>> createOpportunity(
            @Valid @RequestBody CreateOpportunityRequest request
    ) {
        OpportunityDto created = service.createOpportunity(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Opportunity created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an opportunity")
    public ResponseEntity<ApiResponse<OpportunityDto>> updateOpportunity(
            @PathVariable Long id,
            @Valid @RequestBody CreateOpportunityRequest request
    ) {
        OpportunityDto updated = service.updateOpportunity(id, request);
        return ResponseEntity.ok(ApiResponse.success("Opportunity updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an opportunity")
    public ResponseEntity<ApiResponse<Void>> deleteOpportunity(@PathVariable Long id) {
        service.deleteOpportunity(id);
        return ResponseEntity.ok(ApiResponse.success("Opportunity deleted successfully", null));
    }

    @PostMapping("/reset")
    @Operation(summary = "Reset opportunities to original seed dataset")
    public ResponseEntity<ApiResponse<Void>> resetSeedData() {
        service.resetSeedData();
        return ResponseEntity.ok(ApiResponse.success("Opportunities reset to seed data successfully", null));
    }
}
