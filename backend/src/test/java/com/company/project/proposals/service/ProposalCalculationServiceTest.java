package com.company.project.proposals.service;

import com.company.project.common.exception.BusinessValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class ProposalCalculationServiceTest {

    private ProposalCalculationService calculationService;

    @BeforeEach
    void setUp() {
        calculationService = new ProposalCalculationService();
    }

    @Test
    @DisplayName("Should parse multiple date formats correctly")
    void testParseDateFormats() {
        LocalDate d1 = calculationService.parseDate("15 Mar 2025");
        assertEquals(LocalDate.of(2025, 3, 15), d1);

        LocalDate d2 = calculationService.parseDate("2025-03-15");
        assertEquals(LocalDate.of(2025, 3, 15), d2);

        LocalDate d3 = calculationService.parseDate("15/03/2025");
        assertEquals(LocalDate.of(2025, 3, 15), d3);
    }

    @Test
    @DisplayName("Should format LocalDate to standard display string")
    void testFormatDate() {
        String formatted = calculationService.formatDate(LocalDate.of(2025, 3, 15));
        assertEquals("15 Mar 2025", formatted);
    }

    @Test
    @DisplayName("Should calculate 18% GST accurately with half-up rounding")
    void testCalculateGst() {
        BigDecimal base = new BigDecimal("100000.00");
        BigDecimal gst = calculationService.calculateGst(base);
        assertEquals(new BigDecimal("18000.00"), gst);

        // Fractional calculation rounding test
        BigDecimal base2 = new BigDecimal("333.33");
        BigDecimal gst2 = calculationService.calculateGst(base2);
        // 333.33 * 0.18 = 59.9994 -> 60.00
        assertEquals(new BigDecimal("60.00"), gst2);
    }

    @Test
    @DisplayName("Should accept consistent financial amounts")
    void testValidateFinancialAmountsValid() {
        assertDoesNotThrow(() -> calculationService.validateFinancialAmounts(
                new BigDecimal("100000.00"),
                new BigDecimal("18000.00"),
                new BigDecimal("118000.00")
        ));
    }

    @Test
    @DisplayName("Should reject mismatched total amounts")
    void testValidateFinancialAmountsMismatched() {
        BusinessValidationException ex = assertThrows(BusinessValidationException.class, () ->
                calculationService.validateFinancialAmounts(
                        new BigDecimal("100000.00"),
                        new BigDecimal("18000.00"),
                        new BigDecimal("125000.00")
                )
        );
        assertTrue(ex.getMessage().contains("Total amount"));
    }

    @Test
    @DisplayName("Should reject zero or negative service amount before tax")
    void testValidateFinancialAmountsZeroBeforeTax() {
        assertThrows(BusinessValidationException.class, () ->
                calculationService.validateFinancialAmounts(
                        BigDecimal.ZERO,
                        BigDecimal.ZERO,
                        BigDecimal.ZERO
                )
        );
    }

    @Test
    @DisplayName("Should accept valid chronological dates")
    void testValidateDatesValid() {
        LocalDate pDate = LocalDate.of(2025, 3, 15);
        LocalDate vDate = LocalDate.of(2025, 4, 30);
        LocalDate decDate = LocalDate.of(2025, 4, 28);

        assertDoesNotThrow(() -> calculationService.validateDates(pDate, vDate, decDate));
    }

    @Test
    @DisplayName("Should reject validUntil earlier than proposalDate")
    void testValidateDatesInvalidChronology() {
        LocalDate pDate = LocalDate.of(2025, 3, 15);
        LocalDate vDate = LocalDate.of(2025, 3, 10);
        LocalDate decDate = LocalDate.of(2025, 4, 28);

        BusinessValidationException ex = assertThrows(BusinessValidationException.class, () ->
                calculationService.validateDates(pDate, vDate, decDate)
        );
        assertTrue(ex.getMessage().contains("cannot be earlier than Proposal date"));
    }
}
