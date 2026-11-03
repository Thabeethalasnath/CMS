package com.company.project.collections.service;

import com.company.project.collections.dto.*;
import com.company.project.collections.entity.CollectionInvoiceEntity;
import com.company.project.collections.entity.CollectionPaymentEntity;
import com.company.project.collections.repository.CollectionInvoiceRepository;
import com.company.project.collections.entity.CollectionCommunicationEntity;
import com.company.project.collections.repository.CollectionCommunicationRepository;
import com.company.project.collections.repository.CollectionPaymentRepository;
import com.company.project.common.exception.BusinessValidationException;
import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.common.response.PageResponse;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.company.project.notification.service.NotificationService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CollectionsService {

    private final CollectionInvoiceRepository invoiceRepository;
    private final CollectionPaymentRepository paymentRepository;
    private final CollectionsCalculationService calculationService;
    private final InvoiceIdGeneratorService invoiceIdGeneratorService;
    private final CollectionCommunicationRepository communicationRepository;

    @Autowired(required = false)
    private NotificationService notificationService;

    @Transactional(readOnly = true)
    public PageResponse<InvoiceResponse> getInvoices(
            String search,
            String client,
            String status,
            String ageing,
            String sortField,
            String sortOrder,
            int page,
            int size
    ) {
        Specification<CollectionInvoiceEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("id")), pattern),
                        cb.like(cb.lower(root.get("clientName")), pattern)
                ));
            }

            if (client != null && !client.trim().isEmpty() && !"All Clients".equalsIgnoreCase(client.trim())) {
                predicates.add(cb.equal(root.get("clientName"), client.trim()));
            }

            if (status != null && !status.trim().isEmpty() && !"All Statuses".equalsIgnoreCase(status.trim())) {
                predicates.add(cb.equal(root.get("status"), status.trim()));
            }

            if (ageing != null && !ageing.trim().isEmpty() && !"All Buckets".equalsIgnoreCase(ageing.trim())) {
                predicates.add(cb.equal(root.get("ageingBucket"), ageing.trim()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort;
        if (sortField == null || sortField.trim().isEmpty() || "default".equalsIgnoreCase(sortField.trim())) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.ASC, "id"));
        } else {
            String actualSortField = switch (sortField.trim()) {
                case "dueDate" -> "dueDate";
                case "outstanding" -> "outstanding";
                case "daysOverdue" -> "daysOverdue";
                case "ageingBucket" -> "ageingBucket";
                case "status" -> "status";
                case "invoiceDate" -> "invoiceDate";
                case "createdAt" -> "createdAt";
                default -> "id";
            };
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, actualSortField);
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CollectionInvoiceEntity> pageResult = invoiceRepository.findAll(spec, pageable);

        List<InvoiceResponse> responses = pageResult.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return PageResponse.<InvoiceResponse>builder()
                .content(responses)
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(String id) {
        CollectionInvoiceEntity entity = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + id));
        return mapToResponse(entity);
    }

    @Transactional(readOnly = true)
    public NextInvoiceIdResponse getNextInvoiceId(Integer year) {
        int targetYear = year != null ? year : calculationService.getReferenceDate(null).getYear();
        String nextId = invoiceIdGeneratorService.suggestNextInvoiceId(targetYear);
        long seq = 0;
        try {
            String[] parts = nextId.split("-");
            if (parts.length >= 3) {
                seq = Long.parseLong(parts[2]);
            }
        } catch (Exception ignored) {}

        return NextInvoiceIdResponse.builder()
                .nextInvoiceId(nextId)
                .year(targetYear)
                .sequenceNumber(seq)
                .format("INV-YYYY-XXX")
                .build();
    }

    @Transactional
    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {
        LocalDate invoiceDate = calculationService.parseDate(request.getInvoiceDate());
        LocalDate dueDate = calculationService.parseDate(request.getDueDate());
        BigDecimal outstanding = request.getOutstanding();
        int targetYear = invoiceDate != null ? invoiceDate.getYear() : 2025;

        String requestedId = request.getInvoiceId() != null ? request.getInvoiceId().trim().toUpperCase() : "";
        String effectiveInvoiceId;

        if (requestedId.isEmpty() || "AUTO".equalsIgnoreCase(requestedId)) {
            effectiveInvoiceId = invoiceIdGeneratorService.generateAndAllocateNextInvoiceId(targetYear);
        } else {
            if (invoiceRepository.existsById(requestedId)) {
                if (Boolean.TRUE.equals(request.getAutoAssignIfTaken())) {
                    // Suggested ID was taken concurrently before user saved; safely assign the fresh next ID
                    effectiveInvoiceId = invoiceIdGeneratorService.generateAndAllocateNextInvoiceId(targetYear);
                } else {
                    throw new BusinessValidationException("Invoice already exists with ID: " + requestedId);
                }
            } else {
                effectiveInvoiceId = requestedId;
                invoiceIdGeneratorService.syncCounterIfHigher(effectiveInvoiceId);
            }
        }

        Integer daysOverdue = calculationService.calculateDaysOverdue(dueDate);
        String ageingBucket = calculationService.calculateAgeingBucket(daysOverdue);

        String effectiveStatus;
        if (request.getStatusOverride() != null && !request.getStatusOverride().trim().isEmpty() && !"auto".equalsIgnoreCase(request.getStatusOverride().trim())) {
            effectiveStatus = request.getStatusOverride().trim();
        } else {
            effectiveStatus = calculationService.calculateStatus(dueDate, outstanding, daysOverdue);
        }

        String recommendedAction = calculationService.getRecommendedAction(effectiveStatus);

        String clientId = request.getClientId() != null && !request.getClientId().trim().isEmpty()
                ? request.getClientId().trim()
                : "CL-" + (1000 + new Random().nextInt(9000));

        CollectionInvoiceEntity entity = CollectionInvoiceEntity.builder()
                .id(effectiveInvoiceId)
                .clientId(clientId)
                .clientName(request.getClient().trim())
                .invoiceDate(invoiceDate)
                .dueDate(dueDate)
                .invoiceAmount(outstanding)
                .amountPaid(BigDecimal.ZERO)
                .outstanding(outstanding)
                .daysOverdue(daysOverdue)
                .ageingBucket(ageingBucket)
                .status(effectiveStatus)
                .recommendedAction(recommendedAction)
                .build();

        CollectionInvoiceEntity saved = invoiceRepository.save(entity);
        return mapToResponse(saved);
    }

    @Transactional
    public InvoiceResponse updateInvoiceStatus(String id, String newStatus) {
        CollectionInvoiceEntity invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + id));

        String trimmedStatus = newStatus != null ? newStatus.trim() : "";
        List<String> validStatuses = List.of("Paid", "Partially Paid", "Due Soon", "Overdue", "Open");
        if (!validStatuses.contains(trimmedStatus)) {
            throw new BusinessValidationException("Invalid status: " + newStatus + ". Must be one of " + validStatuses);
        }

        invoice.setStatus(trimmedStatus);

        switch (trimmedStatus) {
            case "Paid" -> {
                invoice.setOutstanding(BigDecimal.ZERO);
                invoice.setAmountPaid(invoice.getInvoiceAmount());
                invoice.setDaysOverdue(null);
                invoice.setAgeingBucket("Current");
                invoice.setRecommendedAction("Receipt Issued");
            }
            case "Overdue" -> {
                if (invoice.getDaysOverdue() == null || invoice.getDaysOverdue() <= 0) {
                    invoice.setDaysOverdue(30);
                }
                if ("Current".equals(invoice.getAgeingBucket())) {
                    invoice.setAgeingBucket("1–30 days");
                }
                invoice.setRecommendedAction("Call + Email client");
                if (invoice.getOutstanding().compareTo(BigDecimal.ZERO) == 0) {
                    invoice.setOutstanding(invoice.getInvoiceAmount());
                    invoice.setAmountPaid(BigDecimal.ZERO);
                }
            }
            case "Due Soon" -> {
                invoice.setDaysOverdue(null);
                invoice.setAgeingBucket("1–30 days");
                invoice.setRecommendedAction("Send Reminder");
                if (invoice.getOutstanding().compareTo(BigDecimal.ZERO) == 0) {
                    invoice.setOutstanding(invoice.getInvoiceAmount());
                    invoice.setAmountPaid(BigDecimal.ZERO);
                }
            }
            case "Partially Paid" -> {
                if (invoice.getOutstanding().compareTo(BigDecimal.ZERO) == 0 || invoice.getAmountPaid().compareTo(BigDecimal.ZERO) == 0) {
                    BigDecimal half = invoice.getInvoiceAmount().divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
                    invoice.setAmountPaid(half);
                    invoice.setOutstanding(invoice.getInvoiceAmount().subtract(half));
                }
                invoice.setRecommendedAction("Follow up balance");
            }
            case "Open" -> {
                invoice.setDaysOverdue(null);
                invoice.setAgeingBucket("Current");
                invoice.setRecommendedAction("Monitor");
                if (invoice.getOutstanding().compareTo(BigDecimal.ZERO) == 0) {
                    invoice.setOutstanding(invoice.getInvoiceAmount());
                    invoice.setAmountPaid(BigDecimal.ZERO);
                }
            }
        }

        CollectionInvoiceEntity updated = invoiceRepository.save(invoice);
        if (notificationService != null) {
            notificationService.createNotification(
                    "Invoice Status: " + trimmedStatus,
                    invoice.getId() + " (" + invoice.getClientName() + ") status set to " + trimmedStatus + ".",
                    "INVOICE",
                    "/management/collections"
            );
        }
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<PaymentRecordResponse> getPaymentsForInvoice(String invoiceId) {
        if (!invoiceRepository.existsById(invoiceId)) {
            throw new ResourceNotFoundException("Invoice not found with ID: " + invoiceId);
        }
        return paymentRepository.findByInvoice_IdOrderByPaymentDateDesc(invoiceId).stream()
                .map(this::mapToPaymentResponse)
                .toList();
    }

    @Transactional
    public PaymentRecordResponse recordPayment(String invoiceId, RecordPaymentRequest request) {
        CollectionInvoiceEntity invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        BigDecimal paymentAmount = request.getAmount();
        if (paymentAmount == null || paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessValidationException("Payment amount must be greater than zero");
        }

        if (paymentAmount.compareTo(invoice.getOutstanding()) > 0) {
            throw new BusinessValidationException("Payment amount (" + paymentAmount + ") cannot exceed outstanding balance (" + invoice.getOutstanding() + ")");
        }

        LocalDate paymentDate = request.getPaymentDate() != null && !request.getPaymentDate().trim().isEmpty()
                ? calculationService.parseDate(request.getPaymentDate())
                : LocalDate.now();

        String paymentId = "PAY-" + LocalDate.now().getYear() + "-" + String.format("%03d", 100 + new Random().nextInt(900));

        CollectionPaymentEntity payment = CollectionPaymentEntity.builder()
                .id(paymentId)
                .invoice(invoice)
                .clientName(invoice.getClientName())
                .paymentDate(paymentDate)
                .amount(paymentAmount)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Bank Transfer")
                .referenceId(request.getReferenceId() != null ? request.getReferenceId() : "TXN-" + System.currentTimeMillis() % 1000000)
                .notes(request.getNotes())
                .build();

        // Update invoice balance
        BigDecimal newAmountPaid = invoice.getAmountPaid().add(paymentAmount);
        BigDecimal newOutstanding = invoice.getOutstanding().subtract(paymentAmount);
        invoice.setAmountPaid(newAmountPaid);
        invoice.setOutstanding(newOutstanding);

        if (newOutstanding.compareTo(BigDecimal.ZERO) == 0) {
            invoice.setStatus("Paid");
            invoice.setDaysOverdue(null);
            invoice.setAgeingBucket("Current");
            invoice.setRecommendedAction("Receipt Issued");
        } else {
            invoice.setStatus("Partially Paid");
            invoice.setRecommendedAction("Follow up balance");
        }

        invoiceRepository.save(invoice);
        CollectionPaymentEntity savedPayment = paymentRepository.save(payment);

        if (notificationService != null) {
            notificationService.createNotification(
                    "Payment Recorded",
                    "Payment of ₹" + paymentAmount + " received for " + invoice.getId() + " (" + invoice.getClientName() + ").",
                    "INVOICE",
                    "/management/collections"
            );
        }

        return mapToPaymentResponse(savedPayment);
    }

    @Transactional(readOnly = true)
    public KpiSummaryResponse getKpiSummary() {
        List<CollectionInvoiceEntity> allInvoices = invoiceRepository.findAll();

        BigDecimal totalOutstanding = BigDecimal.ZERO;
        long totalCount = 0;

        BigDecimal overdueAmount = BigDecimal.ZERO;
        long overdueCount = 0;

        BigDecimal dueSoonAmount = BigDecimal.ZERO;
        long dueSoonCount = 0;

        for (CollectionInvoiceEntity inv : allInvoices) {
            if (inv.getOutstanding() != null && inv.getOutstanding().compareTo(BigDecimal.ZERO) > 0) {
                totalOutstanding = totalOutstanding.add(inv.getOutstanding());
                totalCount++;
            }
            if ("Overdue".equalsIgnoreCase(inv.getStatus())) {
                overdueAmount = overdueAmount.add(inv.getOutstanding());
                overdueCount++;
            } else if ("Due Soon".equalsIgnoreCase(inv.getStatus())) {
                dueSoonAmount = dueSoonAmount.add(inv.getOutstanding());
                dueSoonCount++;
            }
        }

        // Collected payments summary
        List<CollectionPaymentEntity> allPayments = paymentRepository.findAll();
        BigDecimal collectedTotal = allPayments.stream()
                .map(CollectionPaymentEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long paymentCount = allPayments.size();

        // Baseline collected defaults from CMS mockup if payments table is freshly seeded
        if (collectedTotal.compareTo(BigDecimal.ZERO) == 0) {
            collectedTotal = BigDecimal.valueOf(960000);
            paymentCount = 18;
        }

        return KpiSummaryResponse.builder()
                .totalOutstanding(KpiSummaryResponse.MetricItem.builder()
                        .amount(totalOutstanding)
                        .count(totalCount)
                        .trendPct(12.0)
                        .build())
                .overdueAmount(KpiSummaryResponse.MetricItem.builder()
                        .amount(overdueAmount)
                        .count(overdueCount)
                        .trendPct(8.0)
                        .build())
                .dueSoon(KpiSummaryResponse.MetricItem.builder()
                        .amount(dueSoonAmount)
                        .count(dueSoonCount)
                        .trendPct(-20.0)
                        .build())
                .collectedThisMonth(KpiSummaryResponse.CollectedMetricItem.builder()
                        .amount(collectedTotal)
                        .paymentCount(paymentCount)
                        .trendPct(18.0)
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public List<AgeingChartItemResponse> getAgeingChart() {
        List<CollectionInvoiceEntity> invoices = invoiceRepository.findAll();

        Map<String, AgeingChartItemResponse> bucketMap = new LinkedHashMap<>();
        bucketMap.put("Current", new AgeingChartItemResponse("Current", BigDecimal.ZERO, 0, "#38BDF8"));
        bucketMap.put("1–30 days", new AgeingChartItemResponse("1–30 days", BigDecimal.ZERO, 0, "#10B981"));
        bucketMap.put("31–60 days", new AgeingChartItemResponse("31–60 days", BigDecimal.ZERO, 0, "#FBBF24"));
        bucketMap.put("61–90 days", new AgeingChartItemResponse("61–90 days", BigDecimal.ZERO, 0, "#F97316"));
        bucketMap.put("90+ days", new AgeingChartItemResponse("90+ days", BigDecimal.ZERO, 0, "#EF4444"));

        for (CollectionInvoiceEntity inv : invoices) {
            if (inv.getOutstanding() != null && inv.getOutstanding().compareTo(BigDecimal.ZERO) > 0) {
                AgeingChartItemResponse item = bucketMap.get(inv.getAgeingBucket());
                if (item != null) {
                    item.setAmount(item.getAmount().add(inv.getOutstanding()));
                    item.setCount(item.getCount() + 1);
                }
            }
        }

        return new ArrayList<>(bucketMap.values());
    }

    @Transactional(readOnly = true)
    public List<StatusDistributionItemResponse> getStatusDistribution() {
        List<CollectionInvoiceEntity> invoices = invoiceRepository.findAll();
        long total = Math.max(1, invoices.size());

        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("Paid", 0L);
        statusCounts.put("Partially Paid", 0L);
        statusCounts.put("Due Soon", 0L);
        statusCounts.put("Overdue", 0L);
        statusCounts.put("Open", 0L);

        for (CollectionInvoiceEntity inv : invoices) {
            statusCounts.put(inv.getStatus(), statusCounts.getOrDefault(inv.getStatus(), 0L) + 1);
        }

        List<StatusDistributionItemResponse> list = new ArrayList<>();
        list.add(new StatusDistributionItemResponse("Paid", statusCounts.get("Paid"), (int) Math.round((statusCounts.get("Paid") * 100.0) / total), "#10B981"));
        list.add(new StatusDistributionItemResponse("Partially Paid", statusCounts.get("Partially Paid"), (int) Math.round((statusCounts.get("Partially Paid") * 100.0) / total), "#38BDF8"));
        list.add(new StatusDistributionItemResponse("Due Soon", statusCounts.get("Due Soon"), (int) Math.round((statusCounts.get("Due Soon") * 100.0) / total), "#FBBF24"));
        list.add(new StatusDistributionItemResponse("Overdue", statusCounts.get("Overdue"), (int) Math.round((statusCounts.get("Overdue") * 100.0) / total), "#F97316"));
        list.add(new StatusDistributionItemResponse("Open", statusCounts.get("Open"), (int) Math.round((statusCounts.get("Open") * 100.0) / total), "#EF4444"));

        return list;
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctClients() {
        List<String> clients = new ArrayList<>();
        clients.add("All Clients");
        clients.addAll(invoiceRepository.findDistinctClientNames());
        return clients;
    }

    private InvoiceResponse mapToResponse(CollectionInvoiceEntity entity) {
        return InvoiceResponse.builder()
                .id(entity.getId())
                .clientId(entity.getClientId())
                .client(entity.getClientName())
                .invoiceDate(calculationService.formatDate(entity.getInvoiceDate()))
                .dueDate(calculationService.formatDate(entity.getDueDate()))
                .invoiceAmount(entity.getInvoiceAmount())
                .amountPaid(entity.getAmountPaid())
                .outstanding(entity.getOutstanding())
                .daysOverdue(entity.getDaysOverdue())
                .ageingBucket(entity.getAgeingBucket())
                .status(entity.getStatus())
                .recommendedAction(entity.getRecommendedAction())
                .build();
    }

    private PaymentRecordResponse mapToPaymentResponse(CollectionPaymentEntity entity) {
        return PaymentRecordResponse.builder()
                .id(entity.getId())
                .invoiceId(entity.getInvoice().getId())
                .client(entity.getClientName())
                .date(calculationService.formatDate(entity.getPaymentDate()))
                .amount(entity.getAmount())
                .method(entity.getPaymentMethod())
                .referenceId(entity.getReferenceId())
                .notes(entity.getNotes())
                .build();
    }

    @Transactional
    public CollectionCommunicationEntity sendReminder(String invoiceId, SendReminderRequest request) {
        CollectionInvoiceEntity invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        String channelsStr = request.getChannels() != null ? request.getChannels().toString() : "Email";
        CollectionCommunicationEntity comm = CollectionCommunicationEntity.builder()
                .invoiceId(invoice.getId())
                .communicationType("REMINDER")
                .recipient(request.getRecipient() != null ? request.getRecipient() : invoice.getClientName())
                .subject("Payment Reminder - " + invoice.getId())
                .message(request.getTemplate() != null ? request.getTemplate() : "Overdue notice via " + channelsStr)
                .loggedBy("System")
                .build();

        return communicationRepository.save(comm);
    }

    @Transactional
    public CollectionCommunicationEntity logCommunication(String invoiceId, LogCommunicationRequest request) {
        CollectionInvoiceEntity invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        CollectionCommunicationEntity comm = CollectionCommunicationEntity.builder()
                .invoiceId(invoice.getId())
                .communicationType(request.getCommunicationType())
                .recipient(request.getRecipient() != null ? request.getRecipient() : invoice.getClientName())
                .subject(request.getSubject())
                .message(request.getMessage())
                .loggedBy(request.getLoggedBy() != null ? request.getLoggedBy() : "Current User")
                .build();

        return communicationRepository.save(comm);
    }

}
