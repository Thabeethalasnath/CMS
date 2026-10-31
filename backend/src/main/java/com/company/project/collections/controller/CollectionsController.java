package com.company.project.collections.controller;

import com.company.project.collections.dto.*;
import com.company.project.collections.entity.CollectionCommunicationEntity;
import com.company.project.collections.service.CollectionsService;
import com.company.project.common.response.ApiResponse;
import com.company.project.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/collections")
@RequiredArgsConstructor
@Tag(name = "Collections API", description = "Endpoints for Invoices, Receivables, Payments, and Collections Analytics")
public class CollectionsController {

    private final CollectionsService collectionsService;

    @GetMapping("/invoices")
    @Operation(summary = "Get paginated, filtered, and sorted invoices")
    public ResponseEntity<ApiResponse<PageResponse<InvoiceResponse>>> getInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String client,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ageing,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<InvoiceResponse> data = collectionsService.getInvoices(
                search, client, status, ageing, sortField, sortOrder, page, size
        );
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved successfully", data));
    }

    @GetMapping("/invoices/next-id")
    @Operation(summary = "Get suggested next invoice ID")
    public ResponseEntity<ApiResponse<NextInvoiceIdResponse>> getNextInvoiceId(
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(ApiResponse.success("Next invoice ID generated successfully", collectionsService.getNextInvoiceId(year)));
    }

    @GetMapping("/invoices/{id}")
    @Operation(summary = "Get single invoice details by ID")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Invoice retrieved successfully", collectionsService.getInvoiceById(id)));
    }

    @PostMapping("/invoices")
    @Operation(summary = "Create manual invoice (Log Payment modal)")
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        InvoiceResponse created = collectionsService.createInvoice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Invoice created successfully", created));
    }

    @PatchMapping("/invoices/{id}/status")
    @Operation(summary = "Update invoice status directly from table dropdown")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Invoice status updated successfully", collectionsService.updateInvoiceStatus(id, request.getStatus())));
    }

    @GetMapping("/invoices/{id}/payments")
    @Operation(summary = "Get payment history for an invoice")
    public ResponseEntity<ApiResponse<List<PaymentRecordResponse>>> getPayments(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", collectionsService.getPaymentsForInvoice(id)));
    }

    @PostMapping("/invoices/{id}/payments")
    @Operation(summary = "Record a payment against an invoice")
    public ResponseEntity<ApiResponse<PaymentRecordResponse>> recordPayment(
            @PathVariable String id,
            @Valid @RequestBody RecordPaymentRequest request
    ) {
        PaymentRecordResponse payment = collectionsService.recordPayment(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Payment recorded successfully", payment));
    }

    @PostMapping("/invoices/{id}/reminders")
    @Operation(summary = "Send and log payment reminder for invoice")
    public ResponseEntity<ApiResponse<CollectionCommunicationEntity>> sendReminder(
            @PathVariable String id,
            @RequestBody SendReminderRequest request
    ) {
        CollectionCommunicationEntity comm = collectionsService.sendReminder(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Reminder logged and dispatched successfully", comm));
    }

    @PostMapping("/invoices/{id}/communications")
    @Operation(summary = "Log call/email follow-up communication for invoice")
    public ResponseEntity<ApiResponse<CollectionCommunicationEntity>> logCommunication(
            @PathVariable String id,
            @Valid @RequestBody LogCommunicationRequest request
    ) {
        CollectionCommunicationEntity comm = collectionsService.logCommunication(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Communication logged successfully", comm));
    }

    @GetMapping("/kpis")
    @Operation(summary = "Get dashboard KPI summary cards metrics")
    public ResponseEntity<ApiResponse<KpiSummaryResponse>> getKpis() {
        return ResponseEntity.ok(ApiResponse.success("KPIs retrieved successfully", collectionsService.getKpiSummary()));
    }

    @GetMapping("/charts/ageing")
    @Operation(summary = "Get receivables ageing bucket chart breakdown")
    public ResponseEntity<ApiResponse<List<AgeingChartItemResponse>>> getAgeingChart() {
        return ResponseEntity.ok(ApiResponse.success("Ageing chart retrieved successfully", collectionsService.getAgeingChart()));
    }

    @GetMapping("/charts/status-distribution")
    @Operation(summary = "Get invoice status distribution breakdown")
    public ResponseEntity<ApiResponse<List<StatusDistributionItemResponse>>> getStatusDistribution() {
        return ResponseEntity.ok(ApiResponse.success("Status distribution retrieved successfully", collectionsService.getStatusDistribution()));
    }

    @GetMapping("/clients")
    @Operation(summary = "Get distinct client names for filter dropdown")
    public ResponseEntity<ApiResponse<List<String>>> getClients() {
        return ResponseEntity.ok(ApiResponse.success("Clients retrieved successfully", collectionsService.getDistinctClients()));
    }
}
