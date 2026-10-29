package com.company.project.attendance.controller;

import com.company.project.attendance.entity.AttendanceEntity;
import com.company.project.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceEntity>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(attendanceService.getMetrics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceEntity> getAttendanceById(@PathVariable String id) {
        return attendanceService.getAttendanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AttendanceEntity> createAttendance(@RequestBody AttendanceEntity record) {
        AttendanceEntity created = attendanceService.createAttendance(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceEntity> updateAttendance(
            @PathVariable String id,
            @RequestBody AttendanceEntity updates) {
        try {
            AttendanceEntity updated = attendanceService.updateAttendance(id, updates);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable String id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
