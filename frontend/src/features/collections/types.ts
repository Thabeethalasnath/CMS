export type CollectionStatus = 'Overdue' | 'Due Soon' | 'Open' | 'Partially Paid' | 'Paid';
export type AgeingBucket = 'Current' | '1–30 days' | '31–60 days' | '61–90 days' | '90+ days';

export interface Invoice {
  id: string;
  clientId: string;
  client: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  amountPaid: number;
  outstanding: number;
  daysOverdue: number | null; // null for non-overdue
  ageingBucket: AgeingBucket;
  status: CollectionStatus;
  recommendedAction: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  client: string;
  date: string;
  amount: number;
  method: string;
  referenceId: string;
  notes?: string;
}

export interface KpiSummary {
  totalOutstanding: {
    amount: number;
    count: number;
    trendPct: number;
  };
  overdueAmount: {
    amount: number;
    count: number;
    trendPct: number;
  };
  dueSoon: {
    count: number;
    amount: number;
    trendPct: number;
  };
  collectedThisMonth: {
    amount: number;
    paymentCount: number;
    trendPct: number;
  };
}

export interface AgeingChartItem {
  bucket: AgeingBucket;
  amount: number;
  count: number;
  color: string;
}

export interface StatusDistributionItem {
  status: CollectionStatus;
  count: number;
  percentage: number;
  color: string;
}
