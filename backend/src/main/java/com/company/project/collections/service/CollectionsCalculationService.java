package com.company.project.collections.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

@Service
public class CollectionsCalculationService {

    public static final LocalDate SIMULATION_BASELINE_DATE = LocalDate.of(2025, 3, 21);

    private static final DateTimeFormatter DISPLAY_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    private static final DateTimeFormatter FLEXIBLE_FORMATTER = new DateTimeFormatterBuilder()
            .parseCaseInsensitive()
            .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
            .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            .appendOptional(DateTimeFormatter.ofPattern("d/M/yyyy"))
            .appendOptional(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
            .appendOptional(DateTimeFormatter.ofPattern("d-M-yyyy"))
            .appendOptional(DateTimeFormatter.ofPattern("yyyy/MM/dd"))
            .appendOptional(DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH))
            .appendOptional(DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH))
            .toFormatter(Locale.ENGLISH);

    public LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return LocalDate.now();
        }
        String clean = dateStr.trim();
        if (clean.contains("T")) {
            clean = clean.substring(0, clean.indexOf("T"));
        }
        try {
            return LocalDate.parse(clean, FLEXIBLE_FORMATTER);
        } catch (Exception ex) {
            try {
                return LocalDate.parse(clean);
            } catch (Exception e2) {
                return LocalDate.now();
            }
        }
    }

    public String formatDate(LocalDate date) {
        if (date == null) return "";
        return date.format(DISPLAY_FORMATTER);
    }

    public LocalDate getReferenceDate(LocalDate targetDate) {
        if (targetDate != null && targetDate.getYear() <= 2025) {
            return SIMULATION_BASELINE_DATE;
        }
        return LocalDate.now();
    }

    public Integer calculateDaysOverdue(LocalDate dueDate) {
        if (dueDate == null) return null;
        LocalDate refDate = getReferenceDate(dueDate);
        long days = ChronoUnit.DAYS.between(dueDate, refDate);
        return days > 0 ? (int) days : null;
    }

    public String calculateAgeingBucket(Integer daysOverdue) {
        if (daysOverdue == null || daysOverdue <= 0) return "Current";
        if (daysOverdue <= 30) return "1–30 days";
        if (daysOverdue <= 60) return "31–60 days";
        if (daysOverdue <= 90) return "61–90 days";
        return "90+ days";
    }

    public String calculateStatus(LocalDate dueDate, BigDecimal outstanding, Integer daysOverdue) {
        if (outstanding == null || outstanding.compareTo(BigDecimal.ZERO) <= 0) {
            return "Paid";
        }
        if (daysOverdue != null && daysOverdue > 0) {
            return "Overdue";
        }
        if (dueDate != null) {
            LocalDate refDate = getReferenceDate(dueDate);
            long daysUntilDue = ChronoUnit.DAYS.between(refDate, dueDate);
            if (daysUntilDue <= 30) {
                return "Due Soon";
            }
        }
        return "Open";
    }

    public String getRecommendedAction(String status) {
        if (status == null) return "Monitor";
        return switch (status) {
            case "Overdue" -> "Call + Email client";
            case "Due Soon" -> "Send Reminder";
            case "Partially Paid" -> "Follow up balance";
            case "Paid" -> "Receipt Issued";
            default -> "Monitor";
        };
    }
}
