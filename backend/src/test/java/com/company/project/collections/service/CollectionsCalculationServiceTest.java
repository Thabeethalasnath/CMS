package com.company.project.collections.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class CollectionsCalculationServiceTest {

    private CollectionsCalculationService calculationService;

    @BeforeEach
    void setUp() {
        calculationService = new CollectionsCalculationService();
    }

    @Test
    @DisplayName("Should correctly calculate days overdue based on baseline date")
    void testCalculateDaysOverdue() {
        // Due date 2025-02-04 with baseline 2025-03-21 -> 45 days
        LocalDate dueDate = LocalDate.of(2025, 2, 4);
        Integer days = calculationService.calculateDaysOverdue(dueDate);
        assertNotNull(days);
        assertEquals(45, days);

        // Future due date -> null
        LocalDate futureDate = LocalDate.of(2025, 4, 15);
        Integer futureDays = calculationService.calculateDaysOverdue(futureDate);
        assertNull(futureDays);
    }

    @Test
    @DisplayName("Should correctly assign ageing buckets")
    void testCalculateAgeingBucket() {
        assertEquals("Current", calculationService.calculateAgeingBucket(null));
        assertEquals("Current", calculationService.calculateAgeingBucket(0));
        assertEquals("1–30 days", calculationService.calculateAgeingBucket(15));
        assertEquals("31–60 days", calculationService.calculateAgeingBucket(45));
        assertEquals("61–90 days", calculationService.calculateAgeingBucket(75));
        assertEquals("90+ days", calculationService.calculateAgeingBucket(105));
    }

    @Test
    @DisplayName("Should calculate status correctly based on outstanding and days overdue")
    void testCalculateStatus() {
        // Zero outstanding -> Paid
        assertEquals("Paid", calculationService.calculateStatus(LocalDate.of(2025, 2, 4), BigDecimal.ZERO, 45));

        // Overdue
        assertEquals("Overdue", calculationService.calculateStatus(LocalDate.of(2025, 2, 4), BigDecimal.valueOf(100000), 45));

        // Due soon (within 30 days of baseline 2025-03-21)
        assertEquals("Due Soon", calculationService.calculateStatus(LocalDate.of(2025, 4, 10), BigDecimal.valueOf(100000), null));

        // Open (due > 30 days from baseline)
        assertEquals("Open", calculationService.calculateStatus(LocalDate.of(2025, 5, 20), BigDecimal.valueOf(100000), null));
    }

    @Test
    @DisplayName("Should map recommended actions correctly")
    void testGetRecommendedAction() {
        assertEquals("Call + Email client", calculationService.getRecommendedAction("Overdue"));
        assertEquals("Send Reminder", calculationService.getRecommendedAction("Due Soon"));
        assertEquals("Follow up balance", calculationService.getRecommendedAction("Partially Paid"));
        assertEquals("Receipt Issued", calculationService.getRecommendedAction("Paid"));
        assertEquals("Monitor", calculationService.getRecommendedAction("Open"));
    }
}
