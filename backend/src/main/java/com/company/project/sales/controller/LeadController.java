package com.company.project.sales.controller;

import com.company.project.sales.entity.LeadEntity;
import com.company.project.sales.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leads")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<List<LeadEntity>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadEntity> getLeadById(@PathVariable String id) {
        return leadService.getLeadById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LeadEntity> createLead(@RequestBody LeadEntity lead) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadService.createLead(lead));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadEntity> updateLead(@PathVariable String id, @RequestBody LeadEntity lead) {
        return ResponseEntity.ok(leadService.updateLead(id, lead));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable String id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}
