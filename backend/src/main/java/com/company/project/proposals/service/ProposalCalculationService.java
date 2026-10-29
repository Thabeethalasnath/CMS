package com.company.project.proposals.service;

import com.company.project.common.exception.BusinessValidationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Locale;

@Service
public class ProposalCalculationService {

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
            throw new BusinessValidationException("Date string cannot be empty");
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
                throw new BusinessValidationException("Invalid date format: " + dateStr + ". Expected formats: dd MMM yyyy or yyyy-MM-dd.");
            }
        }
    }

    public String formatDate(LocalDate date) {
        if (date == null) return "";
        return date.format(DISPLAY_FORMATTER);
    }

    /**
     * Standard GST calculation at 18% with HALF_UP rounding.
     */
    public BigDecimal calculateGst(BigDecimal amountBeforeTax) {
        if (amountBeforeTax == null || amountBeforeTax.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return amountBeforeTax.multiply(BigDecimal.valueOf(0.18)).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Validates financial amounts consistency.
     * Allows user-adjusted manual tax amounts, but validates that totalAmount == amountBeforeTax + taxAmount.
     */
    public void validateFinancialAmounts(BigDecimal beforeTax, BigDecimal taxAmount, BigDecimal totalAmount) {
        if (beforeTax == null || beforeTax.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessValidationException("Service amount before tax must be greater than zero.");
        }
        if (taxAmount == null || taxAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Tax amount cannot be negative.");
        }
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessValidationException("Total amount must be greater than zero.");
        }

        BigDecimal expectedTotal = beforeTax.add(taxAmount).setScale(2, RoundingMode.HALF_UP);
        BigDecimal difference = totalAmount.subtract(expectedTotal).abs();

        // Tolerance of 1.00 for integer rounding differences
        if (difference.compareTo(BigDecimal.valueOf(1.00)) > 0) {
            throw new BusinessValidationException(String.format(
                    "Total amount (%.2f) does not match Amount Before Tax (%.2f) + Tax Amount (%.2f) = %.2f",
                    totalAmount, beforeTax, taxAmount, expectedTotal
            ));
        }
    }

    /**
     * Validates chronological order of proposal dates.
     */
    public void validateDates(LocalDate proposalDate, LocalDate validUntil, LocalDate expectedDecisionDate) {
        if (proposalDate == null) {
            throw new BusinessValidationException("Proposal date is required.");
        }
        if (validUntil == null) {
            throw new BusinessValidationException("Valid until date is required.");
        }
        if (validUntil.isBefore(proposalDate)) {
            throw new BusinessValidationException(String.format(
                    "Valid until date (%s) cannot be earlier than Proposal date (%s).",
                    formatDate(validUntil), formatDate(proposalDate)
            ));
        }
        if (expectedDecisionDate == null) {
            throw new BusinessValidationException("Expected decision date is required.");
        }
    }
}
