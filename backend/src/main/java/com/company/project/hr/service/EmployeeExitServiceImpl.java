package com.company.project.hr.service;

import com.company.project.common.exception.BusinessValidationException;
import com.company.project.common.exception.ResourceNotFoundException;
import com.company.project.common.response.PageResponse;
import com.company.project.hr.dto.*;
import com.company.project.hr.entity.EmployeeExitEntity;
import com.company.project.hr.repository.EmployeeExitRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeExitServiceImpl implements EmployeeExitService {

    private static final DateTimeFormatter DISPLAY_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);
    private static final DateTimeFormatter FLEXIBLE_DATE_PARSER = new DateTimeFormatterBuilder()
            .parseCaseInsensitive()
            .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH))
            .appendOptional(DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH))
            .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
            .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            .toFormatter(Locale.ENGLISH);

    private static final Set<String> VALID_EXIT_TYPES = Set.of("Resignation", "Termination", "Retirement", "Absconding");
    private static final Set<String> VALID_EXIT_STATUSES = Set.of("Approved", "Pending", "In Review", "Rejected");
    private static final Set<String> VALID_ASSETS_STATUSES = Set.of("Returned", "Pending", "-");
    private static final Set<String> VALID_FF_STATUSES = Set.of("Approved", "Pending", "In Review");
    private static final Set<String> VALID_READINESS = Set.of("Completed", "In Progress", "Not Started");

    private final EmployeeExitRepository exitRepository;
    private final EmployeeExitIdGeneratorService idGeneratorService;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<EmployeeExitResponse> getExitRecords(
            String search,
            String exitStatus,
            String exitType,
            String noticePeriod,
            String approvalStatus,
            String dateRange,
            String sort,
            int page,
            int size
    ) {
        int pageIndex = Math.max(0, page - 1);
        int pageSize = size > 0 ? size : 10;
        Sort sortObj = parseSort(sort);

        Specification<EmployeeExitEntity> spec = buildSpecification(
                search, exitStatus, exitType, noticePeriod, approvalStatus, dateRange
        );

        Page<EmployeeExitEntity> entityPage = exitRepository.findAll(spec, PageRequest.of(pageIndex, pageSize, sortObj));

        List<EmployeeExitResponse> content = entityPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return PageResponse.<EmployeeExitResponse>builder()
                .content(content)
                .pageNumber(page)
                .pageSize(pageSize)
                .totalElements(entityPage.getTotalElements())
                .totalPages(entityPage.getTotalPages())
                .first(entityPage.isFirst())
                .last(entityPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeExitResponse> getAllFilteredExitRecords(
            String search,
            String exitStatus,
            String exitType,
            String noticePeriod,
            String approvalStatus,
            String dateRange,
            String sort
    ) {
        Sort sortObj = parseSort(sort);
        Specification<EmployeeExitEntity> spec = buildSpecification(
                search, exitStatus, exitType, noticePeriod, approvalStatus, dateRange
        );

        return exitRepository.findAll(spec, sortObj).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeExitResponse getExitRecordById(String exitId) {
        EmployeeExitEntity entity = exitRepository.findByExitId(exitId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee exit record not found with ID: " + exitId));
        return mapToResponse(entity);
    }

    @Override
    @Transactional
    public EmployeeExitResponse createExitRecord(CreateEmployeeExitRequest request) {
        validateCreateRequest(request);

        String exitId = request.getExitId();
        if (exitId == null || exitId.trim().isEmpty()) {
            exitId = idGeneratorService.generateAndAllocateNextExitId();
        } else {
            exitId = exitId.trim();
            if (exitRepository.existsByExitId(exitId)) {
                // Concurrency safety: if suggested Exit ID was already allocated, advance to next atomic sequence
                exitId = idGeneratorService.generateAndAllocateNextExitId();
            } else {
                idGeneratorService.synchronizeSequenceCounter(exitId);
            }
        }

        LocalDate resignationDate = parseLocalDate(request.getResignationDate());
        LocalDate approvalDate = parseNullableLocalDate(request.getApprovalDate());
        LocalDate lastWorkingDay = parseLocalDate(request.getLastWorkingDay());
        LocalDate noticeCompletionDate = parseNullableLocalDate(request.getNoticeCompletionDate());
        if (noticeCompletionDate == null) {
            noticeCompletionDate = lastWorkingDay;
        }

        if (lastWorkingDay.isBefore(resignationDate)) {
            throw new BusinessValidationException("Last working day cannot be before resignation date");
        }

        EmployeeExitEntity entity = EmployeeExitEntity.builder()
                .exitId(exitId)
                .employeeId(request.getEmployeeId().trim())
                .employeeName(request.getEmployeeName().trim())
                .resignationDate(resignationDate)
                .approvalDate(approvalDate)
                .noticePeriodDays(request.getNoticePeriodDays() != null ? request.getNoticePeriodDays() : 30)
                .lastWorkingDay(lastWorkingDay)
                .exitType(normalizeExitType(request.getExitType()))
                .reason(request.getReason().trim())
                .exitStatus(normalizeExitStatus(request.getExitStatus()))
                .assetsReturned(normalizeAssetsStatus(request.getAssetsReturned()))
                .fullAndFinalStatus(normalizeFfStatus(request.getFullAndFinalStatus()))
                .notes(request.getNotes() != null && !request.getNotes().trim().isEmpty() ? request.getNotes().trim() : "-")
                .noticeCompletionDate(noticeCompletionDate)
                .exitReadiness(normalizeReadiness(request.getExitReadiness()))
                .build();

        EmployeeExitEntity saved = exitRepository.save(entity);
        log.info("Created new employee exit record: {} for employee: {}", saved.getExitId(), saved.getEmployeeName());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public EmployeeExitResponse updateExitRecord(String exitId, UpdateEmployeeExitRequest request) {
        EmployeeExitEntity entity = exitRepository.findByExitId(exitId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee exit record not found with ID: " + exitId));

        if (request.getEmployeeId() != null && !request.getEmployeeId().trim().isEmpty()) {
            entity.setEmployeeId(request.getEmployeeId().trim());
        }
        if (request.getEmployeeName() != null && !request.getEmployeeName().trim().isEmpty()) {
            entity.setEmployeeName(request.getEmployeeName().trim());
        }
        if (request.getResignationDate() != null && !request.getResignationDate().trim().isEmpty()) {
            entity.setResignationDate(parseLocalDate(request.getResignationDate()));
        }
        if (request.getApprovalDate() != null) {
            entity.setApprovalDate(parseNullableLocalDate(request.getApprovalDate()));
        }
        if (request.getNoticePeriodDays() != null) {
            if (request.getNoticePeriodDays() < 0) {
                throw new BusinessValidationException("Notice period cannot be negative");
            }
            entity.setNoticePeriodDays(request.getNoticePeriodDays());
        }
        if (request.getLastWorkingDay() != null && !request.getLastWorkingDay().trim().isEmpty()) {
            LocalDate lwd = parseLocalDate(request.getLastWorkingDay());
            if (lwd.isBefore(entity.getResignationDate())) {
                throw new BusinessValidationException("Last working day cannot be before resignation date");
            }
            entity.setLastWorkingDay(lwd);
        }
        if (request.getExitType() != null && !request.getExitType().trim().isEmpty()) {
            entity.setExitType(normalizeExitType(request.getExitType()));
        }
        if (request.getReason() != null && !request.getReason().trim().isEmpty()) {
            entity.setReason(request.getReason().trim());
        }
        if (request.getExitStatus() != null && !request.getExitStatus().trim().isEmpty()) {
            entity.setExitStatus(normalizeExitStatus(request.getExitStatus()));
        }
        if (request.getAssetsReturned() != null && !request.getAssetsReturned().trim().isEmpty()) {
            entity.setAssetsReturned(normalizeAssetsStatus(request.getAssetsReturned()));
        }
        if (request.getFullAndFinalStatus() != null && !request.getFullAndFinalStatus().trim().isEmpty()) {
            entity.setFullAndFinalStatus(normalizeFfStatus(request.getFullAndFinalStatus()));
        }
        if (request.getNotes() != null) {
            entity.setNotes(request.getNotes().trim().isEmpty() ? "-" : request.getNotes().trim());
        }
        if (request.getNoticeCompletionDate() != null) {
            entity.setNoticeCompletionDate(parseNullableLocalDate(request.getNoticeCompletionDate()));
        }
        if (request.getExitReadiness() != null && !request.getExitReadiness().trim().isEmpty()) {
            entity.setExitReadiness(normalizeReadiness(request.getExitReadiness()));
        }

        EmployeeExitEntity updated = exitRepository.save(entity);
        log.info("Updated employee exit record: {}", updated.getExitId());
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteExitRecord(String exitId) {
        if (!exitRepository.existsByExitId(exitId)) {
            throw new ResourceNotFoundException("Employee exit record not found with ID: " + exitId);
        }
        exitRepository.deleteByExitId(exitId);
        log.info("Deleted employee exit record: {}", exitId);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeExitKpiResponse getKpis() {
        long total = exitRepository.count();
        long approved = exitRepository.countApprovedExits();
        long pending = exitRepository.countPendingApprovals();
        long completed = exitRepository.countCompletedExits();

        return EmployeeExitKpiResponse.builder()
                .totalExitRequests(total)
                .totalExitRequestsTrend(12)
                .approvedExits(approved)
                .approvedExitsTrend(33)
                .pendingApprovals(pending)
                .pendingApprovalsTrend(-9)
                .completedExits(completed)
                .completedExitsTrend(67)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public NextExitIdResponse getNextExitId() {
        String nextId = idGeneratorService.suggestNextExitId();

        return NextExitIdResponse.builder()
                .nextExitId(nextId)
                .suggestedEmployeeId(null)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeExitFilterOptionsResponse getFilterOptions() {
        return EmployeeExitFilterOptionsResponse.builder()
                .exitStatuses(List.of("All", "Approved", "Pending", "In Review", "Rejected"))
                .exitTypes(List.of("All", "Resignation", "Termination", "Retirement", "Absconding"))
                .noticePeriods(List.of(10, 15, 20, 30, 45))
                .approvalStatuses(List.of("All", "Approved", "Pending", "In Review"))
                .dateRanges(List.of("All Time", "This Month", "Last Month", "Last 30 Days", "Last 90 Days"))
                .build();
    }

    // ==========================================
    // Internal Helper Methods
    // ==========================================

    private Specification<EmployeeExitEntity> buildSpecification(
            String search,
            String exitStatus,
            String exitType,
            String noticePeriod,
            String approvalStatus,
            String dateRange
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Text Search across exitId, employeeId, employeeName, and reason
            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate exitIdPred = cb.like(cb.lower(root.get("exitId")), pattern);
                Predicate empIdPred = cb.like(cb.lower(root.get("employeeId")), pattern);
                Predicate namePred = cb.like(cb.lower(root.get("employeeName")), pattern);
                Predicate reasonPred = cb.like(cb.lower(root.get("reason")), pattern);
                predicates.add(cb.or(exitIdPred, empIdPred, namePred, reasonPred));
            }

            // 2. Exit Status filter
            if (exitStatus != null && !exitStatus.trim().isEmpty() && !"All".equalsIgnoreCase(exitStatus.trim())) {
                predicates.add(cb.equal(root.get("exitStatus"), exitStatus.trim()));
            }

            // 3. Exit Type filter
            if (exitType != null && !exitType.trim().isEmpty() && !"All".equalsIgnoreCase(exitType.trim())) {
                predicates.add(cb.equal(root.get("exitType"), exitType.trim()));
            }

            // 4. Notice Period Days filter
            if (noticePeriod != null && !noticePeriod.trim().isEmpty() && !"All".equalsIgnoreCase(noticePeriod.trim())) {
                try {
                    int days = Integer.parseInt(noticePeriod.trim());
                    predicates.add(cb.equal(root.get("noticePeriodDays"), days));
                } catch (NumberFormatException ignored) {}
            }

            // 5. Approval Status filter (maps to exitStatus)
            if (approvalStatus != null && !approvalStatus.trim().isEmpty() && !"All".equalsIgnoreCase(approvalStatus.trim())) {
                predicates.add(cb.equal(root.get("exitStatus"), approvalStatus.trim()));
            }

            // 6. Date Range filter
            if (dateRange != null && !dateRange.trim().isEmpty() && !"All Time".equalsIgnoreCase(dateRange.trim())) {
                // Fixed reference anchor for October 2026 CMS timeline
                LocalDate nowAnchor = LocalDate.of(2026, 10, 31);

                if ("This Month".equalsIgnoreCase(dateRange.trim())) {
                    LocalDate start = LocalDate.of(2026, 10, 1);
                    LocalDate end = LocalDate.of(2026, 10, 31);
                    predicates.add(cb.between(root.get("resignationDate"), start, end));
                } else if ("Last Month".equalsIgnoreCase(dateRange.trim())) {
                    LocalDate start = LocalDate.of(2026, 9, 1);
                    LocalDate end = LocalDate.of(2026, 9, 30);
                    predicates.add(cb.between(root.get("resignationDate"), start, end));
                } else if ("Last 30 Days".equalsIgnoreCase(dateRange.trim())) {
                    LocalDate start = nowAnchor.minusDays(35);
                    predicates.add(cb.between(root.get("resignationDate"), start, nowAnchor));
                } else if ("Last 90 Days".equalsIgnoreCase(dateRange.trim())) {
                    LocalDate start = nowAnchor.minusDays(95);
                    predicates.add(cb.between(root.get("resignationDate"), start, nowAnchor));
                }
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Sort parseSort(String sort) {
        if (sort == null || sort.trim().isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "exitId");
        }

        return switch (sort.trim().toLowerCase()) {
            case "id-asc" -> Sort.by(Sort.Direction.ASC, "exitId");
            case "id-desc" -> Sort.by(Sort.Direction.DESC, "exitId");
            case "date-desc" -> Sort.by(Sort.Direction.DESC, "resignationDate").and(Sort.by(Sort.Direction.DESC, "exitId"));
            case "date-asc" -> Sort.by(Sort.Direction.ASC, "resignationDate").and(Sort.by(Sort.Direction.ASC, "exitId"));
            case "name-asc" -> Sort.by(Sort.Direction.ASC, "employeeName");
            case "name-desc" -> Sort.by(Sort.Direction.DESC, "employeeName");
            default -> Sort.by(Sort.Direction.DESC, "exitId");
        };
    }

    private EmployeeExitResponse mapToResponse(EmployeeExitEntity entity) {
        return EmployeeExitResponse.builder()
                .id(entity.getExitId())
                .exitId(entity.getExitId())
                .employeeId(entity.getEmployeeId())
                .employeeName(entity.getEmployeeName())
                .resignationDate(formatDate(entity.getResignationDate()))
                .approvalDate(formatNullableDate(entity.getApprovalDate()))
                .noticePeriodDays(entity.getNoticePeriodDays())
                .lastWorkingDay(formatDate(entity.getLastWorkingDay()))
                .exitType(entity.getExitType())
                .reason(entity.getReason())
                .exitStatus(entity.getExitStatus())
                .assetsReturned(entity.getAssetsReturned())
                .fullAndFinalStatus(entity.getFullAndFinalStatus())
                .notes(entity.getNotes() != null ? entity.getNotes() : "-")
                .noticeCompletionDate(formatNullableDate(entity.getNoticeCompletionDate()))
                .exitReadiness(entity.getExitReadiness())
                .createdAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null)
                .updatedAt(entity.getUpdatedAt() != null ? entity.getUpdatedAt().toString() : null)
                .build();
    }

    private void validateCreateRequest(CreateEmployeeExitRequest req) {
        if (req.getEmployeeName() == null || req.getEmployeeName().trim().isEmpty()) {
            throw new BusinessValidationException("Employee Name is mandatory");
        }
        if (req.getEmployeeId() == null || req.getEmployeeId().trim().isEmpty()) {
            throw new BusinessValidationException("Employee ID is mandatory");
        }
        if (req.getResignationDate() == null || req.getResignationDate().trim().isEmpty()) {
            throw new BusinessValidationException("Resignation date is mandatory");
        }
        if (req.getLastWorkingDay() == null || req.getLastWorkingDay().trim().isEmpty()) {
            throw new BusinessValidationException("Last working day is mandatory");
        }
        if (req.getNoticePeriodDays() != null && req.getNoticePeriodDays() < 0) {
            throw new BusinessValidationException("Notice period cannot be negative");
        }
    }

    private LocalDate parseLocalDate(String str) {
        if (str == null || str.trim().isEmpty() || "-".equals(str.trim())) {
            throw new BusinessValidationException("Date value cannot be empty");
        }
        try {
            return LocalDate.parse(str.trim(), FLEXIBLE_DATE_PARSER);
        } catch (Exception e) {
            throw new BusinessValidationException("Invalid date format for: " + str + ". Expected dd MMM yyyy or yyyy-MM-dd");
        }
    }

    private LocalDate parseNullableLocalDate(String str) {
        if (str == null || str.trim().isEmpty() || "-".equals(str.trim())) {
            return null;
        }
        try {
            return LocalDate.parse(str.trim(), FLEXIBLE_DATE_PARSER);
        } catch (Exception e) {
            log.warn("Could not parse nullable date string: {}", str);
            return null;
        }
    }

    private String formatDate(LocalDate date) {
        return date != null ? date.format(DISPLAY_FORMATTER) : "-";
    }

    private String formatNullableDate(LocalDate date) {
        return date != null ? date.format(DISPLAY_FORMATTER) : "-";
    }

    private String normalizeExitType(String type) {
        if (type == null || !VALID_EXIT_TYPES.contains(type.trim())) {
            return "Resignation";
        }
        return type.trim();
    }

    private String normalizeExitStatus(String status) {
        if (status == null || !VALID_EXIT_STATUSES.contains(status.trim())) {
            return "Pending";
        }
        return status.trim();
    }

    private String normalizeAssetsStatus(String status) {
        if (status == null || !VALID_ASSETS_STATUSES.contains(status.trim())) {
            return "Pending";
        }
        return status.trim();
    }

    private String normalizeFfStatus(String status) {
        if (status == null || !VALID_FF_STATUSES.contains(status.trim())) {
            return "Pending";
        }
        return status.trim();
    }

    private String normalizeReadiness(String readiness) {
        if (readiness == null || !VALID_READINESS.contains(readiness.trim())) {
            return "Not Started";
        }
        return readiness.trim();
    }
}

