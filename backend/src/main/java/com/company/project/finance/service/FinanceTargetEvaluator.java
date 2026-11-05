package com.company.project.finance.service;

import com.company.project.finance.entity.FinanceTargetEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class FinanceTargetEvaluator {

    public record TargetEvaluation(
            BigDecimal effectiveTarget,
            String status
    ) {}

    public TargetEvaluation evaluate(FinanceTargetEntity targetEntity, BigDecimal actualValue, int periodMonths) {
        if (targetEntity == null || targetEntity.getTargetValue() == null) {
            return new TargetEvaluation(null, "-");
        }

        BigDecimal baseTarget = targetEntity.getTargetValue();
        String basis = targetEntity.getBasis() != null ? targetEntity.getBasis().toUpperCase() : "MONTHLY";
        String direction = targetEntity.getComparisonDirection() != null ? targetEntity.getComparisonDirection().toUpperCase() : "HIGHER_IS_BETTER";

        // Scale by months for monthly flow metrics
        BigDecimal effectiveTarget;
        if ("MONTHLY".equals(basis)) {
            int months = Math.max(1, periodMonths);
            effectiveTarget = baseTarget.multiply(BigDecimal.valueOf(months)).setScale(2, RoundingMode.HALF_UP);
        } else {
            effectiveTarget = baseTarget.setScale(2, RoundingMode.HALF_UP);
        }

        if (actualValue == null) {
            return new TargetEvaluation(effectiveTarget, "-");
        }

        if (effectiveTarget.compareTo(BigDecimal.ZERO) <= 0) {
            return new TargetEvaluation(effectiveTarget, "-");
        }

        BigDecimal ratio = actualValue.divide(effectiveTarget, 4, RoundingMode.HALF_UP);

        String status;
        switch (direction) {
            case "HIGHER_IS_BETTER":
                // On Track: >= 100%, Attention: 80% to 99.9%, At Risk: < 80%
                if (ratio.compareTo(BigDecimal.valueOf(1.00)) >= 0) {
                    status = "On Track";
                } else if (ratio.compareTo(BigDecimal.valueOf(0.80)) >= 0) {
                    status = "Attention";
                } else {
                    status = "At Risk";
                }
                break;

            case "LOWER_IS_BETTER":
                // On Track: <= 100%, Attention: 100.1% to 115%, At Risk: > 115%
                if (ratio.compareTo(BigDecimal.valueOf(1.00)) <= 0) {
                    status = "On Track";
                } else if (ratio.compareTo(BigDecimal.valueOf(1.15)) <= 0) {
                    status = "Attention";
                } else {
                    status = "At Risk";
                }
                break;

            case "NEUTRAL":
            default:
                // Operating corridor: On Track between 80% and 120%, Attention between 60%-80% or 120%-140%, At Risk otherwise
                if (ratio.compareTo(BigDecimal.valueOf(0.80)) >= 0 && ratio.compareTo(BigDecimal.valueOf(1.20)) <= 0) {
                    status = "On Track";
                } else if ((ratio.compareTo(BigDecimal.valueOf(0.60)) >= 0 && ratio.compareTo(BigDecimal.valueOf(0.80)) < 0) ||
                        (ratio.compareTo(BigDecimal.valueOf(1.20)) > 0 && ratio.compareTo(BigDecimal.valueOf(1.40)) <= 0)) {
                    status = "Attention";
                } else {
                    status = "At Risk";
                }
                break;
        }

        return new TargetEvaluation(effectiveTarget, status);
    }
}

