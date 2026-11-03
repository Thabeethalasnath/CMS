package com.company.project.proposals.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.common.response.PageResponse;
import com.company.project.proposals.dto.*;
import com.company.project.proposals.service.ProposalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/proposals")
@RequiredArgsConstructor
@Tag(name = "Proposals API", description = "Endpoints for proposals management, KPIs, filters, and status lifecycle")
public class ProposalController {

    private final ProposalService proposalService;

    @GetMapping
    @Operation(summary = "Get paginated, filtered, and sorted proposals")
    public ResponseEntity<ApiResponse<PageResponse<ProposalResponse>>> getProposals(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ownerId,
            @RequestParam(required = false) String clientId,
            @RequestParam(required = false) String opportunityId,
            @RequestParam(required = false) String serviceId,
            @RequestParam(required = false) String proposalDateRange,
            @RequestParam(required = false) String validUntilRange,
            @RequestParam(required = false) String expectedDecisionDateRange,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<ProposalResponse> pageResponse = proposalService.getProposals(
                search, status, ownerId, clientId, opportunityId, serviceId,
                proposalDateRange, validUntilRange, expectedDecisionDateRange,
                sort, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    @GetMapping("/next-id")
    @Operation(summary = "Get suggested next proposal ID")
    public ResponseEntity<ApiResponse<NextProposalIdResponse>> getNextProposalId(
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(ApiResponse.success(proposalService.getNextProposalId(year)));
    }

    @GetMapping("/filters")
    @Operation(summary = "Get distinct proposal filter options")
    public ResponseEntity<ApiResponse<ProposalFilterOptionsResponse>> getFilterOptions() {
        return ResponseEntity.ok(ApiResponse.success(proposalService.getFilterOptions()));
    }

    @GetMapping("/kpis")
    @Operation(summary = "Get dynamic KPI metrics calculated from proposals dataset")
    public ResponseEntity<ApiResponse<ProposalKpiSummaryResponse>> getKpiSummary() {
        return ResponseEntity.ok(ApiResponse.success(proposalService.getKpiSummary()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single proposal details by ID")
    public ResponseEntity<ApiResponse<ProposalResponse>> getProposalById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(proposalService.getProposalById(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new proposal with validation")
    public ResponseEntity<ApiResponse<ProposalResponse>> createProposal(@Valid @RequestBody CreateProposalRequest request) {
        ProposalResponse created = proposalService.createProposal(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Proposal created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing draft or pending proposal")
    public ResponseEntity<ApiResponse<ProposalResponse>> updateProposal(
            @PathVariable String id,
            @Valid @RequestBody UpdateProposalRequest request
    ) {
        ProposalResponse updated = proposalService.updateProposal(id, request);
        return ResponseEntity.ok(ApiResponse.success("Proposal updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a draft proposal (restricted to dev or admin)")
    public ResponseEntity<ApiResponse<Void>> deleteProposal(@PathVariable String id) {
        proposalService.deleteProposal(id);
        return ResponseEntity.ok(ApiResponse.success("Proposal deleted successfully", null));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update proposal status directly from table dropdown or details modal")
    public ResponseEntity<ApiResponse<ProposalResponse>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateProposalStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Proposal status updated successfully",
                proposalService.updateProposalStatus(id, request.getStatus())
        ));
    }
}
