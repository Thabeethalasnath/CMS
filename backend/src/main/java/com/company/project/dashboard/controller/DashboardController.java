package com.company.project.dashboard.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.dashboard.dto.CeoDashboardResponse;
import com.company.project.dashboard.dto.CeoDashboardUpdateRequest;
import com.company.project.dashboard.dto.SidebarCountsDto;
import com.company.project.dashboard.entity.DashboardKpiCard;
import com.company.project.dashboard.entity.ManagementAlert;
import com.company.project.dashboard.service.DashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/ceo")
    public ResponseEntity<ApiResponse<CeoDashboardResponse>> getCeoDashboard() {
        return ResponseEntity.ok(ApiResponse.success("CEO dashboard retrieved successfully", dashboardService.getCeoDashboard()));
    }

    @PutMapping("/ceo")
    public ResponseEntity<ApiResponse<CeoDashboardResponse>> updateCeoDashboard(@Valid @RequestBody CeoDashboardUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("CEO dashboard updated successfully", dashboardService.updateDashboardData(request)));
    }

    @GetMapping("/sidebar/counts")
    public ResponseEntity<ApiResponse<SidebarCountsDto>> getSidebarCounts() {
        return ResponseEntity.ok(ApiResponse.success("Sidebar counts retrieved successfully", dashboardService.getSidebarCounts()));
    }

    @PutMapping("/ceo/kpis/{id}")
    public ResponseEntity<ApiResponse<DashboardKpiCard>> updateKpi(
            @PathVariable Long id,
            @RequestBody DashboardKpiCard request
    ) {
        return ResponseEntity.ok(ApiResponse.success("KPI updated successfully", dashboardService.updateKpi(id, request)));
    }

    @PutMapping("/ceo/alerts/{id}")
    public ResponseEntity<ApiResponse<ManagementAlert>> updateAlertCount(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer delta
    ) {
        return ResponseEntity.ok(ApiResponse.success("Alert updated successfully", dashboardService.updateAlert(id, delta)));
    }
}
