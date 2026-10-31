package com.company.project.common.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class TrendCalculationUtil {

    private TrendCalculationUtil() {}

    /**
     * Calculates the month-over-month (MoM) percentage change.
     * Returns null if previous period has 0 or no baseline.
     */
    public static Double calculateMoMPercentage(long current, long previous) {
        if (previous <= 0) {
            return null;
        }
        double change = ((double) (current - previous) / (double) previous) * 100.0;
        return Math.round(change * 10.0) / 10.0;
    }

    /**
     * Calculates the month-over-month (MoM) percentage change for BigDecimal amounts.
     * Returns null if previous period has 0 or no baseline.
     */
    public static Double calculateMoMPercentage(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }
        BigDecimal curr = current != null ? current : BigDecimal.ZERO;
        BigDecimal diff = curr.subtract(previous);
        BigDecimal pct = diff.divide(previous, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        return pct.setScale(1, RoundingMode.HALF_UP).doubleValue();
    }

    /**
     * Formats the percentage into a human-readable trend string, e.g. "↑ 12% vs last month"
     * Returns null when percentage is null (no previous baseline).
     */
    public static String formatTrendString(Double percentage) {
        if (percentage == null) {
            return null;
        }
        String arrow = percentage >= 0 ? "↑" : "↓";
        double absVal = Math.abs(percentage);
        if (absVal == Math.floor(absVal)) {
            return String.format("%s %.0f%% vs last month", arrow, absVal);
        } else {
            return String.format("%s %.1f%% vs last month", arrow, absVal);
        }
    }
}
