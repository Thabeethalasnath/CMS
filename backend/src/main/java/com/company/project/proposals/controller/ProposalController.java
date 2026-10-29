package com.company.project.proposals.controller;

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
    public ResponseEntity<PageResponse<ProposalResponse>> getProposals(
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
        return ResponseEntity.ok(proposalService.getProposals(
                search, status, ownerId, clientId, opportunityId, serviceId,
                proposalDateRange, validUntilRange, expectedDecisionDateRange,
                sort, page, size
        ));
    }

    @GetMapping("/next-id")
    @Operation(summary = "Get suggested next proposal ID")
    public ResponseEntity<NextProposalIdResponse> getNextProposalId(
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(proposalService.getNextProposalId(year));
    }

    @GetMapping("/filters")
    @Operation(summary = "Get distinct proposal filter options")
    public ResponseEntity<ProposalFilterOptionsResponse> getFilterOptions() {
        return ResponseEntity.ok(proposalService.getFilterOptions());
    }

    @GetMapping("/kpis")
    @Operation(summary = "Get dynamic KPI metrics calculated from proposals dataset")
    public ResponseEntity<ProposalKpiSummaryResponse> getKpiSummary() {
        return ResponseEntity.ok(proposalService.getKpiSummary());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single proposal details by ID")
    public ResponseEntity<ProposalResponse> getProposalById(@PathVariable String id) {
        return ResponseEntity.ok(proposalService.getProposalById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new proposal with validation")
    public ResponseEntity<ProposalResponse> createProposal(@Valid @RequestBody CreateProposalRequest request) {
        ProposalResponse created = proposalService.createProposal(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update proposal status directly from table dropdown or details modal")
    public ResponseEntity<ProposalResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateProposalStatusRequest request
    ) {
        return ResponseEntity.ok(proposalService.updateProposalStatus(id, request.getStatus()));
    }
}
