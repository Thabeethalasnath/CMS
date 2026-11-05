export type TrendType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type MetricValueType = 'CURRENCY' | 'PERCENT' | 'COUNT';

export interface FinanceKpiMetric {
  rawValue: number | null;
  priorPeriodValue: number | null;
  trendPercentage: number | null;
  trendType: TrendType;
  comparisonText: string | null;
}

export interface FinanceKpis {
  invoiceValue: FinanceKpiMetric;
  collectedPayments: FinanceKpiMetric;
  outstandingReceivables: FinanceKpiMetric;
  currentReceivables: FinanceKpiMetric;
  totalExpenses: FinanceKpiMetric;
  projectExpenses: FinanceKpiMetric;
  operatingCashResult: FinanceKpiMetric;
  collectionRate: FinanceKpiMetric;
}

export interface AgeingBucketItem {
  bucketKey: string;
  label: string;
  amount: number;
  percentage: number;
  count: number;
  color?: string;
}

export interface MetricSummaryRow {
  metricKey: string;
  metricName: string;
  value: number | null;
  target: number | null;
  valueType: MetricValueType;
  status: string;
}

export interface FinanceDashboardData {
  kpis: FinanceKpis;
  ageingBuckets: AgeingBucketItem[];
  metricSummary: MetricSummaryRow[];
  hasReceivablesData: boolean;
  hasExpensesData: boolean;
  lastUpdated: string;
  asOfDate: string;
  periodStart: string;
  periodEnd: string;
}

export interface FinanceQueryParams {
  period?: 'THIS_MONTH' | 'LAST_6_MONTHS' | 'LAST_12_MONTHS' | 'THIS_FISCAL_YEAR' | 'CUSTOM';
  from?: string;
  to?: string;
  asOf?: string;
}
