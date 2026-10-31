package com.company.project.hr.service;

import com.company.project.hr.repository.EmployeeExitRepository;
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
public class EmployeeExitIdGeneratorService {

    private static final String PREFIX = "EXI";
    private static final Pattern EXIT_ID_PATTERN = Pattern.compile("^EXI-(\\d+)$");

    private final JdbcTemplate jdbcTemplate;
    private final EmployeeExitRepository exitRepository;

    /**
     * Read-only suggested next exit ID.
     * Does NOT increment or commit the sequence counter row.
     */
    @Transactional(readOnly = true)
    public String suggestNextExitId() {
        Long currentVal = null;
        try {
            currentVal = jdbcTemplate.queryForObject(
                    "SELECT current_val FROM public.employee_exit_counters WHERE prefix = ?",
                    Long.class,
                    PREFIX
            );
        } catch (Exception ignored) {
            // Counter row might not exist yet
        }

        if (currentVal == null) {
            try {
                String sql = "SELECT COALESCE(MAX(CASE WHEN exit_id ~ '^EXI-[0-9]+$' " +
                        "THEN substring(exit_id from '^EXI-([0-9]+)$')::bigint ELSE 0 END), 0) " +
                        "FROM public.employee_exit_records";
                currentVal = jdbcTemplate.queryForObject(sql, Long.class);
            } catch (Exception ex) {
                log.warn("Could not query max sequence from employee_exit_records: {}", ex.getMessage());
                currentVal = 0L;
            }
        }

        long candidateSeq = (currentVal != null ? currentVal : 0L) + 1;
        String candidateId = formatExitId(candidateSeq);

        while (exitRepository.existsByExitId(candidateId)) {
            candidateSeq++;
            candidateId = formatExitId(candidateSeq);
        }

        return candidateId;
    }

    /**
     * Atomically advances the sequence counter in employee_exit_counters with row-level locking.
     */
    @Transactional
    public String generateAndAllocateNextExitId() {
        String upsertSql = """
            INSERT INTO public.employee_exit_counters (prefix, current_val, created_at, updated_at)
            VALUES (?, 1, NOW(), NOW())
            ON CONFLICT (prefix) DO UPDATE
            SET current_val = public.employee_exit_counters.current_val + 1,
                updated_at = NOW()
            RETURNING current_val
        """;

        Long allocatedVal = jdbcTemplate.queryForObject(upsertSql, Long.class, PREFIX);
        if (allocatedVal == null) {
            allocatedVal = 1L;
        }

        String candidateId = formatExitId(allocatedVal);

        while (exitRepository.existsByExitId(candidateId)) {
            allocatedVal = jdbcTemplate.queryForObject(upsertSql, Long.class, PREFIX);
            if (allocatedVal == null) break;
            candidateId = formatExitId(allocatedVal);
        }

        log.info("Allocated new atomic employee exit ID: {}", candidateId);
        return candidateId;
    }

    /**
     * Synchronizes sequence counter if an explicit or imported ID has a higher sequence.
     */
    @Transactional
    public void synchronizeSequenceCounter(String exitId) {
        if (exitId == null) return;
        Matcher matcher = EXIT_ID_PATTERN.matcher(exitId);
        if (!matcher.matches()) return;

        try {
            long importedVal = Long.parseLong(matcher.group(1));
            String syncSql = """
                INSERT INTO public.employee_exit_counters (prefix, current_val, created_at, updated_at)
                VALUES (?, ?, NOW(), NOW())
                ON CONFLICT (prefix) DO UPDATE
                SET current_val = GREATEST(public.employee_exit_counters.current_val, ?),
                    updated_at = NOW()
            """;
            jdbcTemplate.update(syncSql, PREFIX, importedVal, importedVal);
        } catch (NumberFormatException e) {
            log.warn("Could not parse sequence value from exit ID: {}", exitId);
        }
    }

    private String formatExitId(long sequence) {
        return String.format("EXI-%05d", sequence);
    }
}

