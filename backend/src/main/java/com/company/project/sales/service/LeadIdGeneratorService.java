package com.company.project.sales.service;

import com.company.project.sales.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeadIdGeneratorService {

    private static final String PREFIX = "L";
    private static final Pattern LEAD_ID_PATTERN = Pattern.compile("^L-(\\d{4})-(\\d+)$");

    private final JdbcTemplate jdbcTemplate;
    private final LeadRepository leadRepository;

    @Transactional(readOnly = true)
    public String suggestNextLeadId(int year) {
        Long currentVal = null;
        try {
            currentVal = jdbcTemplate.queryForObject(
                    "SELECT current_val FROM public.lead_counters WHERE prefix = ? AND year = ?",
                    Long.class,
                    PREFIX,
                    year
            );
        } catch (Exception ignored) {
            // Row might not exist yet
        }

        if (currentVal == null) {
            try {
                String sql = "SELECT COALESCE(MAX(CASE WHEN id ~ '^L-" + year + "-[0-9]+$' " +
                        "THEN substring(id from '^L-" + year + "-([0-9]+)$')::bigint ELSE 0 END), 0) " +
                        "FROM public.leads";
                currentVal = jdbcTemplate.queryForObject(sql, Long.class);
            } catch (Exception ex) {
                log.warn("Could not query max sequence from leads: {}", ex.getMessage());
                currentVal = 0L;
            }
        }

        long candidateSeq = (currentVal != null ? currentVal : 0L) + 1;
        String candidateId = formatLeadId(year, candidateSeq);

        while (leadRepository.existsById(candidateId)) {
            candidateSeq++;
            candidateId = formatLeadId(year, candidateSeq);
        }

        return candidateId;
    }

    @Transactional
    public String generateAndAllocateNextLeadId(int year) {
        String upsertSql = """
            INSERT INTO public.lead_counters (prefix, year, current_val, created_at, updated_at)
            VALUES (?, ?, 1, NOW(), NOW())
            ON CONFLICT (prefix, year) DO UPDATE
            SET current_val = public.lead_counters.current_val + 1,
                updated_at = NOW()
            RETURNING current_val
        """;

        Long allocatedVal = null;
        try {
            allocatedVal = jdbcTemplate.queryForObject(upsertSql, Long.class, PREFIX, year);
        } catch (Exception ex) {
            log.warn("Could not allocate counter from lead_counters table: {}", ex.getMessage());
        }

        if (allocatedVal == null) {
            // Fallback: calculate from max ID in leads table
            try {
                String maxSql = "SELECT COALESCE(MAX(CASE WHEN id ~ '^L-" + year + "-[0-9]+$' " +
                        "THEN substring(id from '^L-" + year + "-([0-9]+)$')::bigint ELSE 0 END), 0) " +
                        "FROM public.leads";
                Long maxId = jdbcTemplate.queryForObject(maxSql, Long.class);
                allocatedVal = (maxId != null ? maxId : 0L) + 1;
            } catch (Exception e) {
                allocatedVal = 1L;
            }
        }

        String candidateId = formatLeadId(year, allocatedVal);

        // Advance if candidate already exists in table
        while (leadRepository.existsById(candidateId)) {
            allocatedVal++;
            candidateId = formatLeadId(year, allocatedVal);
            try {
                jdbcTemplate.update(
                        "UPDATE public.lead_counters SET current_val = ?, updated_at = NOW() WHERE prefix = ? AND year = ?",
                        allocatedVal, PREFIX, year
                );
            } catch (Exception ignored) {}
        }

        return candidateId;
    }

    public static String formatLeadId(int year, long sequence) {
        return String.format("L-%04d-%03d", year, sequence);
    }
}
