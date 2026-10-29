package com.company.project.dashboard.controller;

import com.company.project.common.response.ApiResponse;
import com.company.project.dashboard.dto.ActionRequest;
import com.company.project.dashboard.dto.CreateFollowUpItemRequest;
import com.company.project.dashboard.dto.FollowUpItemDto;
import com.company.project.dashboard.dto.FollowUpSummaryDto;
import com.company.project.dashboard.service.FollowUpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/follow-up-queue")
@RequiredArgsConstructor
@Tag(name = "Follow-Up Queue", description = "Endpoints for managing pending follow-up queue items across modules")
public class FollowUpController {

    private final FollowUpService service;

    @GetMapping
    @Operation(summary = "Get all follow-up queue items with optional priority and search filters")
    public ResponseEntity<ApiResponse<List<FollowUpItemDto>>> getAllItems(
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search) {
        List<FollowUpItemDto> items = service.getAllItems(priority, search);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get priority counts and summary metrics for the Follow-Up Queue cards")
    public ResponseEntity<ApiResponse<FollowUpSummaryDto>> getSummary() {
        FollowUpSummaryDto summary = service.getSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single follow-up item by ID")
    public ResponseEntity<ApiResponse<FollowUpItemDto>> getItemById(@PathVariable Long id) {
        FollowUpItemDto item = service.getItemById(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @PostMapping
    @Operation(summary = "Create a new follow-up queue item")
    public ResponseEntity<ApiResponse<FollowUpItemDto>> createItem(
            @Valid @RequestBody CreateFollowUpItemRequest request) {
        FollowUpItemDto created = service.createItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Follow-up item created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing follow-up queue item")
    public ResponseEntity<ApiResponse<FollowUpItemDto>> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody CreateFollowUpItemRequest request) {
        FollowUpItemDto updated = service.updateItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Follow-up item updated successfully", updated));
    }

    @PutMapping("/{id}/toggle-done")
    @Operation(summary = "Toggle the completed/done state of a follow-up item")
    public ResponseEntity<ApiResponse<FollowUpItemDto>> toggleDone(@PathVariable Long id) {
        FollowUpItemDto updated = service.toggleDone(id);
        return ResponseEntity.ok(ApiResponse.success(
                Boolean.TRUE.equals(updated.getIsDone()) ? "Follow-up marked as completed" : "Follow-up reopened",
                updated
        ));
    }

    @PostMapping("/{id}/action")
    @Operation(summary = "Perform an action (e.g. log note, complete) on a follow-up item")
    public ResponseEntity<ApiResponse<FollowUpItemDto>> performAction(
            @PathVariable Long id,
            @RequestBody ActionRequest actionRequest) {
        FollowUpItemDto updated = service.performAction(id, actionRequest);
        return ResponseEntity.ok(ApiResponse.success("Action recorded successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a follow-up item by ID")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success("Follow-up item deleted successfully", null));
    }

    @PostMapping("/reset")
    @Operation(summary = "Reset follow-up queue to initial demo/seed data")
    public ResponseEntity<ApiResponse<String>> resetData() {
        service.resetSeedData();
        return ResponseEntity.ok(ApiResponse.success("Follow-up queue data reset successfully", "OK"));
    }
}
