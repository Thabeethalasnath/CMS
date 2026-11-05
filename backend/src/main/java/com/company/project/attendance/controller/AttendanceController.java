package com.company.project.attendance.controller;

import com.company.project.attendance.dto.AttendanceResponse;
import com.company.project.attendance.dto.CreateAttendanceRequest;
import com.company.project.attendance.dto.UpdateAttendanceRequest;
import com.company.project.attendance.service.AttendanceService;
import com.company.project.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAllAttendance() {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAllAttendance()));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getMetrics()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceById(@PathVariable String id) {
        return attendanceService.getAttendanceById(id)
                .map(entity -> ResponseEntity.ok(ApiResponse.success(entity)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CEO')")
    public ResponseEntity<ApiResponse<AttendanceResponse>> createAttendance(@Valid @RequestBody CreateAttendanceRequest record) {
        AttendanceResponse created = attendanceService.createAttendance(record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attendance record created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CEO')")
    public ResponseEntity<ApiResponse<AttendanceResponse>> updateAttendance(
            @PathVariable String id,
            @Valid @RequestBody UpdateAttendanceRequest updates) {
        try {
            AttendanceResponse updated = attendanceService.updateAttendance(id, updates);
            return ResponseEntity.ok(ApiResponse.success("Attendance record updated successfully", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAttendance(@PathVariable String id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(ApiResponse.success("Attendance record deleted successfully", null));
    }
}
