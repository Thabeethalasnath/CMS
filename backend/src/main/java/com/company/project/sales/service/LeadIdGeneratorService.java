package com.company.project.sales.service;

import com.company.project.sales.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeadIdGeneratorService {

    private static final String PREFIX = "L";

    private final JdbcTemplate jdbcTemplate;
    private final LeadRepository leadRepository;

    @Transactional(readOnly = true)
    public String suggestNextLeadId(int year) {
        List<Long> result = jdbcTemplate.query(
                "SELECT current_val FROM public.lead_counters WHERE prefix = ? AND year = ?",
                (rs, rowNum) -> rs.getLong("current_val"),
                PREFIX,
                year
        );

        long currentVal = result.isEmpty() ? 0L : result.get(0);
        if (currentVal == 0L) {
            Long maxId = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(NULLIF(regexp_replace(id, '^L-' || ? || '-', ''), ''))::BIGINT, 0) " +
                    "FROM public.leads WHERE id ~ ('^L-' || ? || '-\\d+$')",
                    Long.class,
                    year,
                    year
            );
            currentVal = maxId != null ? maxId : 0L;
        }

        long candidateSeq = currentVal + 1;
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
            VALUES (?, ?, (
                SELECT COALESCE(MAX(NULLIF(regexp_replace(id, '^L-' || ? || '-', ''), ''))::BIGINT, 0) + 1
                FROM public.leads
                WHERE id ~ ('^L-' || ? || '-\\d+$')
            ), NOW(), NOW())
            ON CONFLICT (prefix, year) DO UPDATE
            SET current_val = public.lead_counters.current_val + 1,
                updated_at = NOW()
            RETURNING current_val
        """;

        Long allocatedVal = jdbcTemplate.queryForObject(upsertSql, Long.class, PREFIX, year, year, year);
        if (allocatedVal == null) {
            allocatedVal = 1L;
        }

        String candidateId = formatLeadId(year, allocatedVal);

        while (leadRepository.existsById(candidateId)) {
            allocatedVal = jdbcTemplate.queryForObject("""
                UPDATE public.lead_counters
                SET current_val = public.lead_counters.current_val + 1,
                    updated_at = NOW()
                WHERE prefix = ? AND year = ?
                RETURNING current_val
            """, Long.class, PREFIX, year);
            if (allocatedVal == null) {
                break;
            }
            candidateId = formatLeadId(year, allocatedVal);
        }

        return candidateId;
    }

    public static String formatLeadId(int year, long sequence) {
        return String.format("L-%04d-%03d", year, sequence);
    }
}
