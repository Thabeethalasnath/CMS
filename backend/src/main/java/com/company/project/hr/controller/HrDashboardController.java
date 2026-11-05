package com.company.project.hr.controller;

import com.company.project.common.response.PageResponse;
import com.company.project.hr.dto.*;
import com.company.project.hr.service.HrDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hr")
@RequiredArgsConstructor
@Tag(name = "HR Dashboard & Management API", description = "Endpoints for Workforce, Recruitment, Attendance, Leave, and Activity operations")
public class HrDashboardController {

    private final HrDashboardService hrDashboardService;

    // =========================================================================
    // Dashboard Overview & Refresh
    // =========================================================================

    @GetMapping("/dashboard")
    @Operation(summary = "Get HR Dashboard metrics and recent activities with optional department and period filters")
    public ResponseEntity<HrDashboardResponse> getHrDashboard(
            @Parameter(description = "Department filter (e.g. Engineering, Sales, Product, Design, HR, Finance, All)")
            @RequestParam(value = "department", required = false) String department,
            @Parameter(description = "Period filter (e.g. This Month, Last Month, Apr 2024 - Mar 2025, Q4 FY25, All)")
            @RequestParam(value = "period", required = false) String period) {
        return ResponseEntity.ok(hrDashboardService.getHrDashboard(department, period));
    }

    @PostMapping("/dashboard/refresh")
    @Operation(summary = "Refresh HR Dashboard timestamp, recalculate metrics, and synchronize summary cache")
    public ResponseEntity<HrDashboardResponse> refreshHrDashboard() {
        return ResponseEntity.ok(hrDashboardService.refreshHrDashboard());
    }

    // =========================================================================
    // Employee Master Workflows
    // =========================================================================

    @GetMapping("/employees")
    @Operation(summary = "List paginated employees with search, department, and status filters")
    public ResponseEntity<PageResponse<EmployeeDto>> getEmployees(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(hrDashboardService.getEmployees(search, department, status, page, size));
    }

    @PostMapping("/employees")
    @Operation(summary = "Add a new employee record with uniqueness and data validation")
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        EmployeeDto created = hrDashboardService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // =========================================================================
    // Leave Management Workflows
    // =========================================================================

    @GetMapping("/leaves")
    @Operation(summary = "List leave requests with optional status filtering (Pending, Approved, Rejected, All)")
    public ResponseEntity<List<LeaveApprovalDto>> getLeaves(
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(hrDashboardService.getLeaves(status));
    }

    @PatchMapping("/leaves/{id}/status")
    @Operation(summary = "Update leave approval status (Approved or Rejected)")
    public ResponseEntity<LeaveApprovalDto> updateLeaveStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateLeaveStatusRequest request) {
        return ResponseEntity.ok(hrDashboardService.updateLeaveStatus(id, request));
    }

    // =========================================================================
    // Attendance Workflows
    // =========================================================================

    @GetMapping("/attendance")
    @Operation(summary = "List attendance records with optional date and status filters")
    public ResponseEntity<List<AttendanceDto>> getAttendance(
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(hrDashboardService.getAttendanceRecords(date, status));
    }

    @PostMapping("/attendance")
    @Operation(summary = "Record employee daily attendance with duplicate prevention")
    public ResponseEntity<AttendanceDto> logAttendance(@Valid @RequestBody LogAttendanceRequest request) {
        AttendanceDto logged = hrDashboardService.logAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(logged);
    }

    // =========================================================================
    // Recruitment Workflows
    // =========================================================================

    @GetMapping("/candidates")
    @Operation(summary = "List recruitment pipeline candidates with department and ageing filters")
    public ResponseEntity<List<CandidateDto>> getCandidates(
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "minDaysInPipeline", required = false) Integer minDaysInPipeline) {
        return ResponseEntity.ok(hrDashboardService.getCandidates(department, minDaysInPipeline));
    }

    // =========================================================================
    // Recent Activities
    // =========================================================================

    @GetMapping("/activities")
    @Operation(summary = "Get list of all recent HR activity logs")
    public ResponseEntity<List<RecentActivityDto>> getRecentActivities() {
        return ResponseEntity.ok(hrDashboardService.getRecentActivities());
    }
}
