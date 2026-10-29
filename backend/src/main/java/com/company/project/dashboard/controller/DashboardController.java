package com.company.project.dashboard.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.dashboard.dto.CeoDashboardResponse;
import com.company.project.dashboard.entity.DashboardKpiCard;
import com.company.project.dashboard.entity.ManagementAlert;
import com.company.project.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/ceo")
    public ResponseEntity<ApiResponse<CeoDashboardResponse>> getCeoDashboard() {
        return ResponseEntity.ok(ApiResponse.success("CEO dashboard retrieved successfully", dashboardService.getCeoDashboard()));
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
