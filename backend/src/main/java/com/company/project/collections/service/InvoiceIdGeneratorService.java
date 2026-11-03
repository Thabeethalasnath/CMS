package com.company.project.collections.service;

import com.company.project.collections.repository.CollectionInvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceIdGeneratorService {

    private static final String PREFIX = "INV";
    private static final Pattern INVOICE_ID_PATTERN = Pattern.compile("^INV-(\\d{4})-(\\d+)$");

    private final JdbcTemplate jdbcTemplate;
    private final CollectionInvoiceRepository invoiceRepository;

    /**
     * Read-only suggested next invoice ID.
     * Does NOT consume the sequence or insert any record.
     */
    @Transactional(readOnly = true)
    public String suggestNextInvoiceId(int year) {
        Long currentVal = null;
        try {
            currentVal = jdbcTemplate.queryForObject(
                    "SELECT current_val FROM public.collections_invoice_counters WHERE prefix = ? AND year = ?",
                    Long.class,
                    PREFIX,
                    year
            );
        } catch (Exception ignored) {
            // No counter row yet for this year
        }

        if (currentVal == null) {
            // Fallback to inspect current max from collections_invoices
            try {
                String sql = "SELECT COALESCE(MAX(CASE WHEN id ~ '^INV-" + year + "-[0-9]+$' " +
                        "THEN substring(id from '^INV-" + year + "-([0-9]+)$')::bigint ELSE 0 END), 0) " +
                        "FROM public.collections_invoices";
                currentVal = jdbcTemplate.queryForObject(sql, Long.class);
            } catch (Exception ex) {
                log.warn("Could not query max sequence from collections_invoices: {}", ex.getMessage());
                currentVal = 0L;
            }
        }

        long candidateSeq = (currentVal != null ? currentVal : 0L) + 1;
        String candidateId = formatInvoiceId(year, candidateSeq);

        // Ensure candidate ID is not already occupied in collections_invoices
        while (invoiceRepository.existsById(candidateId)) {
            candidateSeq++;
            candidateId = formatInvoiceId(year, candidateSeq);
        }

        return candidateId;
    }

    /**
     * Atomically advances the database counter and allocates the next unique ID.
     * Protected by PostgreSQL row-level lock on collections_invoice_counters.
     */
    @Transactional
    public String generateAndAllocateNextInvoiceId(int year) {
        String upsertSql = """
            INSERT INTO public.collections_invoice_counters (prefix, year, current_val, created_at, updated_at)
            VALUES (?, ?, 1, NOW(), NOW())
            ON CONFLICT (prefix, year) DO UPDATE
            SET current_val = public.collections_invoice_counters.current_val + 1,
                updated_at = NOW()
            RETURNING current_val
        """;

        Long allocatedVal = jdbcTemplate.queryForObject(upsertSql, Long.class, PREFIX, year);
        if (allocatedVal == null) {
            allocatedVal = 1L;
        }

        String candidateId = formatInvoiceId(year, allocatedVal);

        // In the rare event candidate was previously inserted out-of-band, advance until truly free
        while (invoiceRepository.existsById(candidateId)) {
            allocatedVal = jdbcTemplate.queryForObject(upsertSql, Long.class, PREFIX, year);
            if (allocatedVal == null) break;
            candidateId = formatInvoiceId(year, allocatedVal);
        }

        log.info("Allocated new atomic invoice ID: {}", candidateId);
        return candidateId;
    }

    /**
     * Synchronizes the sequence counter if a manual or external ID has a higher sequence number.
     */
    @Transactional
    public void syncCounterIfHigher(String invoiceId) {
        if (invoiceId == null) return;
        Matcher matcher = INVOICE_ID_PATTERN.matcher(invoiceId.trim().toUpperCase());
        if (matcher.matches()) {
            try {
                int year = Integer.parseInt(matcher.group(1));
                long seq = Long.parseLong(matcher.group(2));

                String syncSql = """
                    INSERT INTO public.collections_invoice_counters (prefix, year, current_val, created_at, updated_at)
                    VALUES (?, ?, ?, NOW(), NOW())
                    ON CONFLICT (prefix, year) DO UPDATE
                    SET current_val = GREATEST(public.collections_invoice_counters.current_val, ?),
                        updated_at = NOW()
                """;
                jdbcTemplate.update(syncSql, PREFIX, year, seq, seq);
            } catch (Exception ex) {
                log.warn("Failed to sync sequence counter for invoice ID {}: {}", invoiceId, ex.getMessage());
            }
        }
    }

    public static String formatInvoiceId(int year, long sequence) {
        return String.format("%s-%d-%03d", PREFIX, year, sequence);
    }
}
