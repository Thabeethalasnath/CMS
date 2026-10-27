package com.company.project.dashboard.controller;

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
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/ceo")
    public ResponseEntity<CeoDashboardResponse> getCeoDashboard() {
        return ResponseEntity.ok(dashboardService.getCeoDashboard());
    }

    @PutMapping("/ceo/kpis/{id}")
    public ResponseEntity<DashboardKpiCard> updateKpi(
            @PathVariable Long id,
            @RequestBody DashboardKpiCard request
    ) {
        return ResponseEntity.ok(dashboardService.updateKpi(id, request));
    }

    @PutMapping("/ceo/alerts/{id}")
    public ResponseEntity<ManagementAlert> updateAlertCount(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer delta
    ) {
        return ResponseEntity.ok(dashboardService.updateAlert(id, delta));
    }
}
