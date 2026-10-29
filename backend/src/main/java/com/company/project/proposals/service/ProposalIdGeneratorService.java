package com.company.project.proposals.service;

import com.company.project.proposals.repository.ProposalRepository;
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
public class ProposalIdGeneratorService {

    private static final String PREFIX = "P";
    private static final Pattern PROPOSAL_ID_PATTERN = Pattern.compile("^P-(\\d{4})-(\\d+)$");

    private final JdbcTemplate jdbcTemplate;
    private final ProposalRepository proposalRepository;

    /**
     * Read-only suggested next proposal ID.
     * Does NOT increment or commit the sequence counter row.
     */
    @Transactional(readOnly = true)
    public String suggestNextProposalId(int year) {
        Long currentVal = null;
        try {
            currentVal = jdbcTemplate.queryForObject(
                    "SELECT current_val FROM public.proposals_counters WHERE prefix = ? AND year = ?",
                    Long.class,
                    PREFIX,
                    year
            );
        } catch (Exception ignored) {
            // Row might not exist yet for this year
        }

        if (currentVal == null) {
            try {
                String sql = "SELECT COALESCE(MAX(CASE WHEN id ~ '^P-" + year + "-[0-9]+$' " +
                        "THEN substring(id from '^P-" + year + "-([0-9]+)$')::bigint ELSE 0 END), 0) " +
                        "FROM public.proposals";
                currentVal = jdbcTemplate.queryForObject(sql, Long.class);
            } catch (Exception ex) {
                log.warn("Could not query max sequence from proposals: {}", ex.getMessage());
                currentVal = 0L;
            }
        }

        long candidateSeq = (currentVal != null ? currentVal : 0L) + 1;
        String candidateId = formatProposalId(year, candidateSeq);

        // Ensure candidate ID does not collide with existing rows
        while (proposalRepository.existsById(candidateId)) {
            candidateSeq++;
            candidateId = formatProposalId(year, candidateSeq);
        }

        return candidateId;
    }

    /**
     * Atomically advances the sequence counter in proposals_counters with row-level locking.
     */
    @Transactional
    public String generateAndAllocateNextProposalId(int year) {
        String upsertSql = """
            INSERT INTO public.proposals_counters (prefix, year, current_val, created_at, updated_at)
            VALUES (?, ?, 1, NOW(), NOW())
            ON CONFLICT (prefix, year) DO UPDATE
            SET current_val = public.proposals_counters.current_val + 1,
                updated_at = NOW()
            RETURNING current_val
        """;

        Long allocatedVal = jdbcTemplate.queryForObject(upsertSql, Long.class, PREFIX, year);
        if (allocatedVal == null) {
            allocatedVal = 1L;
        }

        String candidateId = formatProposalId(year, allocatedVal);

        while (proposalRepository.existsById(candidateId)) {
            allocatedVal = jdbcTemplate.queryForObject(upsertSql, Long.class, PREFIX, year);
            if (allocatedVal == null) break;
            candidateId = formatProposalId(year, allocatedVal);
        }

        log.info("Allocated new atomic proposal ID: {}", candidateId);
        return candidateId;
    }

    /**
     * Synchronizes sequence counter if an explicit or imported ID has a higher sequence.
     */
    @Transactional
    public void syncCounterIfHigher(String proposalId) {
        if (proposalId == null) return;
        Matcher matcher = PROPOSAL_ID_PATTERN.matcher(proposalId.trim().toUpperCase());
        if (matcher.matches()) {
            try {
                int year = Integer.parseInt(matcher.group(1));
                long seq = Long.parseLong(matcher.group(2));

                String syncSql = """
                    INSERT INTO public.proposals_counters (prefix, year, current_val, created_at, updated_at)
                    VALUES (?, ?, ?, NOW(), NOW())
                    ON CONFLICT (prefix, year) DO UPDATE
                    SET current_val = GREATEST(public.proposals_counters.current_val, ?),
                        updated_at = NOW()
                """;
                jdbcTemplate.update(syncSql, PREFIX, year, seq, seq);
            } catch (Exception ex) {
                log.warn("Failed to sync sequence counter for proposal ID {}: {}", proposalId, ex.getMessage());
            }
        }
    }

    public static String formatProposalId(int year, long sequence) {
        return String.format("%s-%d-%03d", PREFIX, year, sequence);
    }
}
