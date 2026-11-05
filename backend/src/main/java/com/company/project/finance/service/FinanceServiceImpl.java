package com.company.project.finance.service;

import com.company.project.collections.repository.CollectionInvoiceRepository;
import com.company.project.collections.repository.CollectionPaymentRepository;
import com.company.project.common.exception.BusinessValidationException;
import com.company.project.finance.dto.*;
import com.company.project.finance.entity.ExpenseEntity;
import com.company.project.finance.entity.FinanceTargetEntity;
import com.company.project.finance.repository.ExpenseRepository;
import com.company.project.finance.repository.FinanceTargetRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceServiceImpl implements FinanceService {

    private static final ZoneId KOLKATA_ZONE = ZoneId.of("Asia/Kolkata");
    private static final LocalDate MIN_ALLOWED_DATE = LocalDate.of(2000, 1, 1);
    private static final long MAX_ALLOWED_CUSTOM_DAYS = 1826; // 5 years

    private final CollectionInvoiceRepository invoiceRepository;
    private final CollectionPaymentRepository paymentRepository;
    private final ExpenseRepository expenseRepository;
    private final FinanceTargetRepository financeTargetRepository;
    private final ReceivablesCalculationService receivablesCalculationService;
    private final FinanceTargetEvaluator targetEvaluator;

    public record PeriodBounds(
            LocalDate start,
            LocalDate end,
            int monthsCount
    ) {}

    public PeriodBounds resolvePeriodBounds(FinancePeriod period, LocalDate from, LocalDate to) {
        LocalDate today = LocalDate.now(KOLKATA_ZONE);
        if (period == null) {
            period = FinancePeriod.THIS_FISCAL_YEAR;
        }

        switch (period) {
            case THIS_MONTH: {
                LocalDate start = today.withDayOfMonth(1);
                LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
                return new PeriodBounds(start, end, 1);
            }
            case LAST_6_MONTHS: {
                LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
                LocalDate start = today.minusMonths(5).withDayOfMonth(1);
                return new PeriodBounds(start, end, 6);
            }
            case LAST_12_MONTHS: {
                LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
                LocalDate start = today.minusMonths(11).withDayOfMonth(1);
                return new PeriodBounds(start, end, 12);
            }
            case THIS_FISCAL_YEAR: {
                int startYear = today.getMonthValue() >= 4 ? today.getYear() : today.getYear() - 1;
                LocalDate start = LocalDate.of(startYear, 4, 1);
                LocalDate end = LocalDate.of(startYear + 1, 3, 31);
                return new PeriodBounds(start, end, 12);
            }
            case CUSTOM: {
                if (from == null || to == null) {
                    throw new BusinessValidationException("Both 'from' and 'to' dates are required for CUSTOM period");
                }
                if (from.isAfter(to)) {
                    throw new BusinessValidationException("Start date ('from') cannot be after end date ('to')");
                }
                if (from.isBefore(MIN_ALLOWED_DATE)) {
                    throw new BusinessValidationException("Start date cannot be earlier than " + MIN_ALLOWED_DATE);
                }
                long days = ChronoUnit.DAYS.between(from, to);
                if (days > MAX_ALLOWED_CUSTOM_DAYS) {
                    throw new BusinessValidationException("CUSTOM period range cannot exceed 5 years");
                }
                int months = Math.max(1, (int) Math.ceil((double) (days + 1) / 30.4375));
                return new PeriodBounds(from, to, months);
            }
            default:
                throw new BusinessValidationException("Unsupported finance period: " + period);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public FinanceDashboardResponse getDashboard(FinancePeriod period, LocalDate from, LocalDate to, LocalDate customAsOf) {
        LocalDate today = LocalDate.now(KOLKATA_ZONE);
        PeriodBounds bounds = resolvePeriodBounds(period, from, to);
        LocalDate periodStart = bounds.start();
        LocalDate periodEnd = bounds.end();
        int monthsCount = bounds.monthsCount();

        LocalDate asOfDate = customAsOf != null
                ? customAsOf
                : (periodEnd.isBefore(today) ? periodEnd : today);

        // 1. Current Period Data
        BigDecimal invoiceValue = invoiceRepository.sumInvoiceAmountInPeriod(periodStart, periodEnd);
        if (invoiceValue == null) invoiceValue = BigDecimal.ZERO;

        BigDecimal collectedPayments = paymentRepository.sumPaymentsInPeriod(periodStart, periodEnd);
        if (collectedPayments == null) collectedPayments = BigDecimal.ZERO;

        BigDecimal totalExpenses = expenseRepository.sumTotalExpensesInPeriod(periodStart, periodEnd);
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal projectExpenses = expenseRepository.sumProjectExpensesInPeriod(periodStart, periodEnd);
        if (projectExpenses == null) projectExpenses = BigDecimal.ZERO;

        ReceivablesCalculationService.ReceivablesComputationResult receivables =
                receivablesCalculationService.computeReceivablesAsOf(asOfDate);
        BigDecimal outstandingReceivables = receivables.getTotalOutstanding();
        BigDecimal currentReceivables = receivables.getCurrentReceivables();

        BigDecimal operatingCashResult = collectedPayments.subtract(totalExpenses);

        BigDecimal collectionRate = BigDecimal.ZERO;
        if (invoiceValue.compareTo(BigDecimal.ZERO) > 0) {
            collectionRate = collectedPayments.divide(invoiceValue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        // 2. Prior Period Data for Trends
        LocalDate priorStart;
        LocalDate priorEnd;
        if (period == FinancePeriod.THIS_FISCAL_YEAR) {
            int startYear = today.getMonthValue() >= 4 ? today.getYear() : today.getYear() - 1;
            priorStart = LocalDate.of(startYear - 1, 4, 1);
            priorEnd = LocalDate.of(startYear, 3, 31);
        } else {
            long days = ChronoUnit.DAYS.between(periodStart, periodEnd) + 1;
            priorEnd = periodStart.minusDays(1);
            priorStart = periodStart.minusDays(days);
        }
        LocalDate priorAsOf = priorEnd.isBefore(today) ? priorEnd : today;

        BigDecimal priorInvoiceValue = invoiceRepository.sumInvoiceAmountInPeriod(priorStart, priorEnd);
        BigDecimal priorCollected = paymentRepository.sumPaymentsInPeriod(priorStart, priorEnd);
        BigDecimal priorTotalExpenses = expenseRepository.sumTotalExpensesInPeriod(priorStart, priorEnd);
        BigDecimal priorProjExpenses = expenseRepository.sumProjectExpensesInPeriod(priorStart, priorEnd);

        ReceivablesCalculationService.ReceivablesComputationResult priorReceivables =
                receivablesCalculationService.computeReceivablesAsOf(priorAsOf);
        BigDecimal priorOutstanding = priorReceivables.getTotalOutstanding();
        BigDecimal priorCurrent = priorReceivables.getCurrentReceivables();

        BigDecimal priorOperatingCash = (priorCollected != null ? priorCollected : BigDecimal.ZERO)
                .subtract(priorTotalExpenses != null ? priorTotalExpenses : BigDecimal.ZERO);

        BigDecimal priorCollectionRate = BigDecimal.ZERO;
        if (priorInvoiceValue != null && priorInvoiceValue.compareTo(BigDecimal.ZERO) > 0 && priorCollected != null) {
            priorCollectionRate = priorCollected.divide(priorInvoiceValue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        // 3. Assemble KPIs with direction-aware trends
        FinanceKpisDto kpis = FinanceKpisDto.builder()
                .invoiceValue(buildKpiMetric(invoiceValue, priorInvoiceValue, MetricDirection.HIGHER_IS_BETTER))
                .collectedPayments(buildKpiMetric(collectedPayments, priorCollected, MetricDirection.HIGHER_IS_BETTER))
                .outstandingReceivables(buildKpiMetric(outstandingReceivables, priorOutstanding, MetricDirection.LOWER_IS_BETTER))
                .currentReceivables(buildKpiMetric(currentReceivables, priorCurrent, MetricDirection.NEUTRAL))
                .totalExpenses(buildKpiMetric(totalExpenses, priorTotalExpenses, MetricDirection.LOWER_IS_BETTER))
                .projectExpenses(buildKpiMetric(projectExpenses, priorProjExpenses, MetricDirection.LOWER_IS_BETTER))
                .operatingCashResult(buildKpiMetric(operatingCashResult, priorOperatingCash, MetricDirection.HIGHER_IS_BETTER))
                .collectionRate(buildKpiMetric(collectionRate, priorCollectionRate, MetricDirection.HIGHER_IS_BETTER))
                .build();

        // 4. Build 12 Metric Summary Rows with Live Targets
        List<MetricSummaryRowDto> summaryRows = buildMetricSummaryRows(
                invoiceValue, collectedPayments, outstandingReceivables, currentReceivables,
                receivables.getAgeingBuckets(), totalExpenses, projectExpenses,
                operatingCashResult, collectionRate, monthsCount
        );

        String lastUpdatedIso = OffsetDateTime.now(KOLKATA_ZONE).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

        return FinanceDashboardResponse.builder()
                .kpis(kpis)
                .ageingBuckets(receivables.getAgeingBuckets())
                .metricSummary(summaryRows)
                .hasReceivablesData(receivables.isHasReceivablesData())
                .hasExpensesData(totalExpenses.compareTo(BigDecimal.ZERO) > 0)
                .lastUpdated(lastUpdatedIso)
                .asOfDate(asOfDate)
                .periodStart(periodStart)
                .periodEnd(periodEnd)
                .build();
    }

    private enum MetricDirection {
        HIGHER_IS_BETTER,
        LOWER_IS_BETTER,
        NEUTRAL
    }

    private FinanceKpiMetricDto buildKpiMetric(BigDecimal currentVal, BigDecimal priorVal, MetricDirection direction) {
        BigDecimal cur = currentVal != null ? currentVal.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal pri = priorVal != null ? priorVal.setScale(2, RoundingMode.HALF_UP) : null;

        if (pri == null || pri.compareTo(BigDecimal.ZERO) == 0) {
            return FinanceKpiMetricDto.builder()
                    .rawValue(cur)
                    .priorPeriodValue(pri)
                    .trendPercentage(null)
                    .trendType(TrendType.NEUTRAL)
                    .comparisonText("No prior data")
                    .build();
        }

        BigDecimal diff = cur.subtract(pri);
        BigDecimal pct = diff.divide(pri.abs(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
        double pctVal = pct.doubleValue();

        TrendType trendType;
        if (pctVal == 0.0) {
            trendType = TrendType.NEUTRAL;
        } else if (direction == MetricDirection.LOWER_IS_BETTER) {
            trendType = pctVal > 0 ? TrendType.NEGATIVE : TrendType.POSITIVE;
        } else if (direction == MetricDirection.HIGHER_IS_BETTER) {
            trendType = pctVal > 0 ? TrendType.POSITIVE : TrendType.NEGATIVE;
        } else {
            trendType = TrendType.NEUTRAL;
        }

        String sign = pctVal > 0 ? "+" : "";
        String text = String.format("%s%.2f%% vs prior period", sign, pctVal);

        return FinanceKpiMetricDto.builder()
                .rawValue(cur)
                .priorPeriodValue(pri)
                .trendPercentage(pctVal)
                .trendType(trendType)
                .comparisonText(text)
                .build();
    }

    private List<MetricSummaryRowDto> buildMetricSummaryRows(
            BigDecimal invoiceValue, BigDecimal collectedPayments,
            BigDecimal outstandingReceivables, BigDecimal currentReceivables,
            List<ReceivablesAgeingBucketDto> buckets,
            BigDecimal totalExpenses, BigDecimal projectExpenses,
            BigDecimal operatingCashResult, BigDecimal collectionRate,
            int monthsCount
    ) {
        Map<String, FinanceTargetEntity> targetsMap = new HashMap<>();
        for (FinanceTargetEntity target : financeTargetRepository.findAll()) {
            targetsMap.put(target.getMetricKey(), target);
        }

        Map<String, BigDecimal> bucketAmounts = new HashMap<>();
        for (ReceivablesAgeingBucketDto b : buckets) {
            bucketAmounts.put(b.getBucketKey(), b.getAmount());
        }

        List<MetricSummaryRowDto> rows = new ArrayList<>();
        rows.add(createSummaryRow("invoice_value", "Invoice Value", invoiceValue, MetricValueType.CURRENCY, targetsMap.get("invoice_value"), monthsCount));
        rows.add(createSummaryRow("collected_payments", "Collected Payments", collectedPayments, MetricValueType.CURRENCY, targetsMap.get("collected_payments"), monthsCount));
        rows.add(createSummaryRow("outstanding_receivables", "Outstanding Receivables", outstandingReceivables, MetricValueType.CURRENCY, targetsMap.get("outstanding_receivables"), monthsCount));
        rows.add(createSummaryRow("current_receivables", "Current Receivables", currentReceivables, MetricValueType.CURRENCY, targetsMap.get("current_receivables"), monthsCount));

        rows.add(createSummaryRow("aging_1_30", "1 - 30 Days", bucketAmounts.getOrDefault("1_30", BigDecimal.ZERO), MetricValueType.CURRENCY, targetsMap.get("aging_1_30"), monthsCount));
        rows.add(createSummaryRow("aging_31_60", "31 - 60 Days", bucketAmounts.getOrDefault("31_60", BigDecimal.ZERO), MetricValueType.CURRENCY, targetsMap.get("aging_31_60"), monthsCount));
        rows.add(createSummaryRow("aging_61_90", "61 - 90 Days", bucketAmounts.getOrDefault("61_90", BigDecimal.ZERO), MetricValueType.CURRENCY, targetsMap.get("aging_61_90"), monthsCount));
        rows.add(createSummaryRow("aging_90_plus", "90+ Days", bucketAmounts.getOrDefault("90_plus", BigDecimal.ZERO), MetricValueType.CURRENCY, targetsMap.get("aging_90_plus"), monthsCount));

        rows.add(createSummaryRow("total_expenses", "Total Expenses", totalExpenses, MetricValueType.CURRENCY, targetsMap.get("total_expenses"), monthsCount));
        rows.add(createSummaryRow("project_expenses", "Project Expenses", projectExpenses, MetricValueType.CURRENCY, targetsMap.get("project_expenses"), monthsCount));
        rows.add(createSummaryRow("operating_cash_result", "Operating Cash Result", operatingCashResult, MetricValueType.CURRENCY, targetsMap.get("operating_cash_result"), monthsCount));
        rows.add(createSummaryRow("collection_rate", "Collection Rate", collectionRate, MetricValueType.PERCENT, targetsMap.get("collection_rate"), monthsCount));

        return rows;
    }

    private MetricSummaryRowDto createSummaryRow(
            String metricKey, String name, BigDecimal val, MetricValueType type,
            FinanceTargetEntity targetEntity, int monthsCount
    ) {
        BigDecimal actual = val != null ? val.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        FinanceTargetEvaluator.TargetEvaluation eval = targetEvaluator.evaluate(targetEntity, actual, monthsCount);

        return MetricSummaryRowDto.builder()
                .metricKey(metricKey)
                .metricName(name)
                .value(actual)
                .target(eval.effectiveTarget())
                .valueType(type)
                .status(eval.status())
                .build();
    }

    @Override
    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request, String createdBy) {
        if (request == null) {
            throw new BusinessValidationException("Create expense request cannot be null");
        }
        if (request.getExpenseDate() == null) {
            throw new BusinessValidationException("Expense date is required");
        }
        if (request.getExpenseDate().isBefore(MIN_ALLOWED_DATE)) {
            throw new BusinessValidationException("Expense date cannot be earlier than " + MIN_ALLOWED_DATE);
        }
        LocalDate maxDate = LocalDate.now(KOLKATA_ZONE).plusDays(30);
        if (request.getExpenseDate().isAfter(maxDate)) {
            throw new BusinessValidationException("Expense date cannot be more than 30 days in the future");
        }

        String normalizedCategory = request.getNormalizedCategory();
        if (normalizedCategory == null || normalizedCategory.isEmpty()) {
            throw new BusinessValidationException("Category is required");
        }

        ExpenseEntity entity = ExpenseEntity.builder()
                .expenseDate(request.getExpenseDate())
                .category(normalizedCategory)
                .amount(request.getAmount().setScale(2, RoundingMode.HALF_UP))
                .isProjectExpense(request.isProjectExpense())
                .projectLabel(request.getProjectLabel())
                .description(request.getDescription())
                .createdBy(createdBy != null ? createdBy : "system")
                .build();

        ExpenseEntity saved = expenseRepository.save(entity);

        return ExpenseResponse.builder()
                .id(saved.getId())
                .expenseDate(saved.getExpenseDate())
                .category(saved.getCategory())
                .amount(saved.getAmount())
                .isProjectExpense(saved.isProjectExpense())
                .projectLabel(saved.getProjectLabel())
                .description(saved.getDescription())
                .createdBy(saved.getCreatedBy())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public void exportCsv(FinancePeriod period, LocalDate from, LocalDate to, HttpServletResponse response) throws IOException {
        FinanceDashboardResponse data = getDashboard(period, from, to, null);

        response.setContentType("text/csv; charset=UTF-8");
        String filename = String.format("finance_dashboard_%s.csv", LocalDate.now(KOLKATA_ZONE));
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        PrintWriter writer = response.getWriter();
        writer.println("Metric,Value,Target,ValueType,Status");

        for (MetricSummaryRowDto row : data.getMetricSummary()) {
            String valStr = row.getValue() != null ? row.getValue().toPlainString() : "0.00";
            String tgtStr = row.getTarget() != null ? row.getTarget().toPlainString() : "-";
            writer.printf("\"%s\",%s,%s,%s,\"%s\"%n",
                    escapeCsv(row.getMetricName()),
                    valStr,
                    tgtStr,
                    row.getValueType(),
                    escapeCsv(row.getStatus())
            );
        }

        writer.flush();
    }

    private String escapeCsv(String str) {
        if (str == null) return "";
        return str.replace("\"", "\"\"");
    }
}

