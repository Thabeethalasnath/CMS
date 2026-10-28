package com.company.project.common.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/v1/collections/ping")
    public ResponseEntity<Map<String, Object>> collectionsPing() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Collections Service",
                "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/api/v1/admin/ping")
    public ResponseEntity<Map<String, Object>> adminPing() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Protected Admin Service"
        ));
    }
}
