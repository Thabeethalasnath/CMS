package com.company.project.leave.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.leave.dto.CreateLeaveRequest;
import com.company.project.leave.dto.LeaveMetricsResponse;
import com.company.project.leave.dto.UpdateLeaveRequest;
import com.company.project.leave.entity.LeaveEntity;
import com.company.project.leave.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveEntity>>> getAllLeaves() {
        List<LeaveEntity> leaves = leaveService.getAllLeaves();
        return ResponseEntity.ok(ApiResponse.success(leaves));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<LeaveMetricsResponse>> getMetrics() {
        LeaveMetricsResponse metrics = leaveService.getMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaveEntity>> getLeaveById(@PathVariable String id) {
        LeaveEntity leave = leaveService.getLeaveById(id);
        return ResponseEntity.ok(ApiResponse.success(leave));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LeaveEntity>> createLeave(@Valid @RequestBody CreateLeaveRequest request) {
        LeaveEntity created = leaveService.createLeave(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Leave request created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaveEntity>> updateLeave(
            @PathVariable String id,
            @RequestBody UpdateLeaveRequest request) {
        LeaveEntity updated = leaveService.updateLeave(id, request);
        return ResponseEntity.ok(ApiResponse.success("Leave request updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLeave(@PathVariable String id) {
        leaveService.deleteLeave(id);
        return ResponseEntity.ok(ApiResponse.success("Leave request deleted successfully", null));
    }
}

