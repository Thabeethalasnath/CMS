package com.company.project.hr.controller;

import com.company.project.common.response.PageResponse;
import com.company.project.hr.dto.*;
import com.company.project.hr.service.EmployeeExitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hr/employee-exits")
@RequiredArgsConstructor
@Tag(name = "Employee Exit API", description = "Endpoints for employee exit requests, offboarding process, and KPIs")
public class EmployeeExitController {

    private final EmployeeExitService exitService;

    @GetMapping
    @Operation(summary = "Get paginated, filtered, and sorted employee exit records")
    public ResponseEntity<PageResponse<EmployeeExitResponse>> getExitRecords(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String exitStatus,
            @RequestParam(required = false) String exitType,
            @RequestParam(required = false) String noticePeriod,
            @RequestParam(required = false) String approvalStatus,
            @RequestParam(required = false) String dateRange,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(exitService.getExitRecords(
                search, exitStatus, exitType, noticePeriod, approvalStatus, dateRange, sort, page, size
        ));
    }

    @GetMapping("/export")
    @Operation(summary = "Get all filtered employee exit records for export")
    public ResponseEntity<List<EmployeeExitResponse>> getExportRecords(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String exitStatus,
            @RequestParam(required = false) String exitType,
            @RequestParam(required = false) String noticePeriod,
            @RequestParam(required = false) String approvalStatus,
            @RequestParam(required = false) String dateRange,
            @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(exitService.getAllFilteredExitRecords(
                search, exitStatus, exitType, noticePeriod, approvalStatus, dateRange, sort
        ));
    }

    @GetMapping("/kpis")
    @Operation(summary = "Get dynamic KPI metrics calculated from employee exits dataset")
    public ResponseEntity<EmployeeExitKpiResponse> getKpis() {
        return ResponseEntity.ok(exitService.getKpis());
    }

    @GetMapping("/next-id")
    @Operation(summary = "Get suggested next Exit ID and Employee ID")
    public ResponseEntity<NextExitIdResponse> getNextExitId() {
        return ResponseEntity.ok(exitService.getNextExitId());
    }

    @GetMapping("/filters")
    @Operation(summary = "Get available employee exit filter options")
    public ResponseEntity<EmployeeExitFilterOptionsResponse> getFilterOptions() {
        return ResponseEntity.ok(exitService.getFilterOptions());
    }

    @GetMapping("/{exitId}")
    @Operation(summary = "Get single employee exit details by Exit ID")
    public ResponseEntity<EmployeeExitResponse> getExitRecordById(@PathVariable String exitId) {
        return ResponseEntity.ok(exitService.getExitRecordById(exitId));
    }

    @PostMapping
    @Operation(summary = "Create a new employee exit record")
    public ResponseEntity<EmployeeExitResponse> createExitRecord(@Valid @RequestBody CreateEmployeeExitRequest request) {
        EmployeeExitResponse created = exitService.createExitRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{exitId}")
    @Operation(summary = "Update an existing employee exit record")
    public ResponseEntity<EmployeeExitResponse> updateExitRecord(
            @PathVariable String exitId,
            @Valid @RequestBody UpdateEmployeeExitRequest request
    ) {
        return ResponseEntity.ok(exitService.updateExitRecord(exitId, request));
    }

    @DeleteMapping("/{exitId}")
    @Operation(summary = "Delete an employee exit record")
    public ResponseEntity<Void> deleteExitRecord(@PathVariable String exitId) {
        exitService.deleteExitRecord(exitId);
        return ResponseEntity.noContent().build();
    }
}

