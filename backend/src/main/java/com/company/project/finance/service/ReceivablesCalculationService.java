package com.company.project.finance.service;

import com.company.project.collections.entity.CollectionInvoiceEntity;
import com.company.project.collections.repository.CollectionInvoiceRepository;
import com.company.project.collections.repository.CollectionPaymentRepository;
import com.company.project.finance.dto.ReceivablesAgeingBucketDto;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReceivablesCalculationService {

    private final CollectionInvoiceRepository invoiceRepository;
    private final CollectionPaymentRepository paymentRepository;

    @Data
    @Builder
    public static class ReceivablesComputationResult {
        private BigDecimal totalOutstanding;
        private BigDecimal currentReceivables;
        private List<ReceivablesAgeingBucketDto> ageingBuckets;
        private int overpaidInvoicesCount;
        private BigDecimal totalOverpaidAmount;
        private boolean hasReceivablesData;
    }

    @Transactional(readOnly = true)
    public ReceivablesComputationResult computeReceivablesAsOf(LocalDate asOfDate) {
        if (asOfDate == null) {
            throw new IllegalArgumentException("asOfDate must not be null");
        }

        // 1. Fetch all invoices issued on or before asOfDate
        List<CollectionInvoiceEntity> invoices = invoiceRepository.findInvoicesIssuedOnOrBefore(asOfDate);

        // 2. Fetch all payment sums by invoice on or before asOfDate
        List<Object[]> paymentSums = paymentRepository.sumPaymentsByInvoiceOnOrBefore(asOfDate);
        Map<String, BigDecimal> paymentsByInvoice = new HashMap<>();
        for (Object[] row : paymentSums) {
            String invId = (String) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            paymentsByInvoice.put(invId, sum != null ? sum : BigDecimal.ZERO);
        }

        // 3. Initialize canonical buckets in strict order
        Map<String, BucketAccumulator> accumulators = new LinkedHashMap<>();
        accumulators.put("current", new BucketAccumulator("current", "Current"));
        accumulators.put("1_30", new BucketAccumulator("1_30", "1 - 30 Days"));
        accumulators.put("31_60", new BucketAccumulator("31_60", "31 - 60 Days"));
        accumulators.put("61_90", new BucketAccumulator("61_90", "61 - 90 Days"));
        accumulators.put("90_plus", new BucketAccumulator("90_plus", "90+ Days"));

        BigDecimal totalOutstanding = BigDecimal.ZERO;
        BigDecimal currentReceivables = BigDecimal.ZERO;
        int overpaidCount = 0;
        BigDecimal totalOverpaidAmount = BigDecimal.ZERO;

        for (CollectionInvoiceEntity inv : invoices) {
            String status = inv.getStatus() != null ? inv.getStatus().trim() : "";
            // Exclude cancelled and written-off invoices
            if ("Cancelled".equalsIgnoreCase(status) || "Written-off".equalsIgnoreCase(status)) {
                continue;
            }

            BigDecimal invoiceAmt = inv.getInvoiceAmount() != null ? inv.getInvoiceAmount() : BigDecimal.ZERO;
            BigDecimal paidAmt = paymentsByInvoice.getOrDefault(inv.getId(), BigDecimal.ZERO);

            // Detect overpayments explicitly
            if (paidAmt.compareTo(invoiceAmt) > 0) {
                overpaidCount++;
                BigDecimal overpayment = paidAmt.subtract(invoiceAmt);
                totalOverpaidAmount = totalOverpaidAmount.add(overpayment);
                log.warn("Invoice {} has payments ({}) exceeding invoice amount ({}). Overpayment: {}",
                        inv.getId(), paidAmt, invoiceAmt, overpayment);
                // Outstanding for debt collection is 0
                continue;
            }

            BigDecimal outstanding = invoiceAmt.subtract(paidAmt);
            if (outstanding.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            totalOutstanding = totalOutstanding.add(outstanding);

            // Compute days overdue relative to asOfDate
            LocalDate dueDate = inv.getDueDate() != null ? inv.getDueDate() : inv.getInvoiceDate();
            long daysOverdue = ChronoUnit.DAYS.between(dueDate, asOfDate);

            String bucketKey;
            if (daysOverdue <= 0) {
                bucketKey = "current";
                currentReceivables = currentReceivables.add(outstanding);
            } else if (daysOverdue <= 30) {
                bucketKey = "1_30";
            } else if (daysOverdue <= 60) {
                bucketKey = "31_60";
            } else if (daysOverdue <= 90) {
                bucketKey = "61_90";
            } else {
                bucketKey = "90_plus";
            }

            BucketAccumulator acc = accumulators.get(bucketKey);
            if (acc != null) {
                acc.amount = acc.amount.add(outstanding);
                acc.count++;
            }
        }

        // 4. Calculate integer rounded percentages (Half-Up, normalized)
        List<ReceivablesAgeingBucketDto> dtoList = new ArrayList<>();
        int runningPercentage = 0;
        int bucketIndex = 0;
        int totalBuckets = accumulators.size();

        for (BucketAccumulator acc : accumulators.values()) {
            bucketIndex++;
            int pct = 0;
            if (totalOutstanding.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal ratio = acc.amount.divide(totalOutstanding, 4, RoundingMode.HALF_UP);
                pct = ratio.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).intValue();
            }

            // Normalization check for the last non-empty bucket so sum is 100%
            if (bucketIndex == totalBuckets && totalOutstanding.compareTo(BigDecimal.ZERO) > 0) {
                pct = Math.max(0, 100 - runningPercentage);
            } else {
                runningPercentage += pct;
            }

            dtoList.add(ReceivablesAgeingBucketDto.builder()
                    .bucketKey(acc.bucketKey)
                    .label(acc.label)
                    .amount(acc.amount.setScale(2, RoundingMode.HALF_UP))
                    .percentage(pct)
                    .count(acc.count)
                    .build());
        }

        return ReceivablesComputationResult.builder()
                .totalOutstanding(totalOutstanding.setScale(2, RoundingMode.HALF_UP))
                .currentReceivables(currentReceivables.setScale(2, RoundingMode.HALF_UP))
                .ageingBuckets(dtoList)
                .overpaidInvoicesCount(overpaidCount)
                .totalOverpaidAmount(totalOverpaidAmount.setScale(2, RoundingMode.HALF_UP))
                .hasReceivablesData(totalOutstanding.compareTo(BigDecimal.ZERO) > 0)
                .build();
    }

    private static class BucketAccumulator {
        final String bucketKey;
        final String label;
        BigDecimal amount = BigDecimal.ZERO;
        long count = 0;

        BucketAccumulator(String bucketKey, String label) {
            this.bucketKey = bucketKey;
            this.label = label;
        }
    }
}

