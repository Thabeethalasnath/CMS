package com.company.project.collections.controller;

import com.company.project.collections.dto.*;
import com.company.project.collections.service.CollectionsService;
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
    public ResponseEntity<PageResponse<InvoiceResponse>> getInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String client,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ageing,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(collectionsService.getInvoices(
                search, client, status, ageing, sortField, sortOrder, page, size
        ));
    }

    @GetMapping("/invoices/next-id")
    @Operation(summary = "Get suggested next invoice ID")
    public ResponseEntity<NextInvoiceIdResponse> getNextInvoiceId(
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(collectionsService.getNextInvoiceId(year));
    }

    @GetMapping("/invoices/{id}")
    @Operation(summary = "Get single invoice details by ID")
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable String id) {
        return ResponseEntity.ok(collectionsService.getInvoiceById(id));
    }

    @PostMapping("/invoices")
    @Operation(summary = "Create manual invoice (Log Payment modal)")
    public ResponseEntity<InvoiceResponse> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        InvoiceResponse created = collectionsService.createInvoice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/invoices/{id}/status")
    @Operation(summary = "Update invoice status directly from table dropdown")
    public ResponseEntity<InvoiceResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        return ResponseEntity.ok(collectionsService.updateInvoiceStatus(id, request.getStatus()));
    }

    @GetMapping("/invoices/{id}/payments")
    @Operation(summary = "Get payment history for an invoice")
    public ResponseEntity<List<PaymentRecordResponse>> getPayments(@PathVariable String id) {
        return ResponseEntity.ok(collectionsService.getPaymentsForInvoice(id));
    }

    @PostMapping("/invoices/{id}/payments")
    @Operation(summary = "Record a payment against an invoice")
    public ResponseEntity<PaymentRecordResponse> recordPayment(
            @PathVariable String id,
            @Valid @RequestBody RecordPaymentRequest request
    ) {
        PaymentRecordResponse payment = collectionsService.recordPayment(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @GetMapping("/kpis")
    @Operation(summary = "Get dashboard KPI summary cards metrics")
    public ResponseEntity<KpiSummaryResponse> getKpis() {
        return ResponseEntity.ok(collectionsService.getKpiSummary());
    }

    @GetMapping("/charts/ageing")
    @Operation(summary = "Get receivables ageing bucket chart breakdown")
    public ResponseEntity<List<AgeingChartItemResponse>> getAgeingChart() {
        return ResponseEntity.ok(collectionsService.getAgeingChart());
    }

    @GetMapping("/charts/status-distribution")
    @Operation(summary = "Get invoice status distribution breakdown")
    public ResponseEntity<List<StatusDistributionItemResponse>> getStatusDistribution() {
        return ResponseEntity.ok(collectionsService.getStatusDistribution());
    }

    @GetMapping("/clients")
    @Operation(summary = "Get distinct client names for filter dropdown")
    public ResponseEntity<List<String>> getClients() {
        return ResponseEntity.ok(collectionsService.getDistinctClients());
    }
}
