/**
 * Utility functions for currency and date formatting, CSV export, and dynamic calculation helpers
 */

import {
  Invoice,
  AgeingBucket,
  CollectionStatus,
  KpiSummary,
  AgeingChartItem,
  StatusDistributionItem,
} from './types';

export const formatRupee = (amount: number): string => {
  if (isNaN(amount) || amount === 0) return '₹ 0';
  const formatted = new Intl.NumberFormat('en-IN').format(Math.round(amount));
  return `₹ ${formatted}`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const exportInvoicesToCsv = <T extends object>(filename: string, invoices: T[]): void => {
  if (!invoices.length) return;

  const sample = invoices[0] as Record<string, unknown>;
  const headers = Object.keys(sample);
  const csvRows: string[] = [headers.join(',')];

  invoices.forEach((row) => {
    const record = row as Record<string, unknown>;
    const values = headers.map((header) => {
      const val = record[header];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Date Parsing & Conversion
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const parseInvoiceDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();

  // If format is YYYY-MM-DD
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // If format is DD MMM YYYY (e.g. "04 Feb 2025")
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIdx = MONTH_NAMES.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIdx >= 0 && !isNaN(year)) {
      return new Date(year, monthIdx, day);
    }
  }

  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

export const formatDateToDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const parsed = parseInvoiceDate(dateStr);
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[parsed.getMonth()];
  const year = parsed.getFullYear();
  return `${day} ${month} ${year}`;
};

// Returns reference date for calculation (aligns with CMS simulation baseline 21 Mar 2025 for 2025 dates, or current date)
export const getReferenceDate = (targetDate: Date): Date => {
  if (targetDate.getFullYear() <= 2025) {
    return new Date(2025, 2, 21); // 21 Mar 2025
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Automatic Calculation 1: Days Overdue
export const calculateDaysOverdue = (dueDateStr: string): number => {
  if (!dueDateStr) return 0;
  const dueDate = parseInvoiceDate(dueDateStr);
  const refDate = getReferenceDate(dueDate);
  const diffTime = refDate.getTime() - dueDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Automatic Calculation 2: Ageing Bucket
export const calculateAgeingBucket = (daysOverdue: number): AgeingBucket => {
  if (daysOverdue <= 0) return 'Current';
  if (daysOverdue <= 30) return '1–30 days';
  if (daysOverdue <= 60) return '31–60 days';
  if (daysOverdue <= 90) return '61–90 days';
  return '90+ days';
};

// Automatic Calculation 3: Collection Status
export const calculateStatus = (
  dueDateStr: string,
  outstanding: number,
  daysOverdue: number
): CollectionStatus => {
  if (outstanding <= 0) {
    return 'Paid';
  }

  if (daysOverdue > 0) {
    return 'Overdue';
  }

  const dueDate = parseInvoiceDate(dueDateStr);
  const refDate = getReferenceDate(dueDate);
  const daysUntilDue = Math.floor((dueDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue <= 30) {
    return 'Due Soon';
  }

  return 'Open';
};

// Automatic Calculation 4: Recommended Action
export const getRecommendedAction = (status: CollectionStatus): string => {
  switch (status) {
    case 'Overdue':
      return 'Call + Email client';
    case 'Due Soon':
      return 'Send Reminder';
    case 'Partially Paid':
      return 'Follow up balance';
    case 'Paid':
      return 'Receipt Issued';
    case 'Open':
    default:
      return 'Monitor';
  }
};

// Dynamic KPI Calculator
export const computeDynamicKpis = (
  invoices: Invoice[],
  baseCollectedAmount = 960000,
  basePaymentCount = 18
): KpiSummary => {
  let totalOutstanding = 0;
  let outstandingCount = 0;
  let overdueAmount = 0;
  let overdueCount = 0;
  let dueSoonAmount = 0;
  let dueSoonCount = 0;

  invoices.forEach((inv) => {
    if (inv.outstanding > 0) {
      totalOutstanding += inv.outstanding;
      outstandingCount += 1;
    }
    if (inv.status === 'Overdue') {
      overdueAmount += inv.outstanding;
      overdueCount += 1;
    } else if (inv.status === 'Due Soon') {
      dueSoonAmount += inv.outstanding;
      dueSoonCount += 1;
    }
  });

  return {
    totalOutstanding: {
      amount: totalOutstanding,
      count: outstandingCount,
      trendPct: 12,
    },
    overdueAmount: {
      amount: overdueAmount,
      count: overdueCount,
      trendPct: 8,
    },
    dueSoon: {
      count: dueSoonCount,
      amount: dueSoonAmount,
      trendPct: -20,
    },
    collectedThisMonth: {
      amount: baseCollectedAmount,
      paymentCount: basePaymentCount,
      trendPct: 18,
    },
  };
};

// Dynamic Ageing Chart Calculator
export const computeDynamicAgeingChart = (invoices: Invoice[]): AgeingChartItem[] => {
  const buckets: Record<AgeingBucket, { amount: number; count: number; color: string }> = {
    Current: { amount: 0, count: 0, color: '#38BDF8' },
    '1–30 days': { amount: 0, count: 0, color: '#10B981' },
    '31–60 days': { amount: 0, count: 0, color: '#FBBF24' },
    '61–90 days': { amount: 0, count: 0, color: '#F97316' },
    '90+ days': { amount: 0, count: 0, color: '#EF4444' },
  };

  invoices.forEach((inv) => {
    if (inv.outstanding > 0 && buckets[inv.ageingBucket]) {
      buckets[inv.ageingBucket].amount += inv.outstanding;
      buckets[inv.ageingBucket].count += 1;
    }
  });

  return (Object.keys(buckets) as AgeingBucket[]).map((bucket) => ({
    bucket,
    amount: buckets[bucket].amount,
    count: buckets[bucket].count,
    color: buckets[bucket].color,
  }));
};

// Dynamic Status Distribution Calculator
export const computeDynamicStatusDistribution = (invoices: Invoice[]): StatusDistributionItem[] => {
  const counts: Record<CollectionStatus, number> = {
    Paid: 0,
    'Partially Paid': 0,
    'Due Soon': 0,
    Overdue: 0,
    Open: 0,
  };

  invoices.forEach((inv) => {
    if (counts[inv.status] !== undefined) {
      counts[inv.status] += 1;
    } else {
      counts.Open += 1;
    }
  });

  const total = Math.max(1, invoices.length);

  return [
    { status: 'Paid', count: counts.Paid, percentage: Math.round((counts.Paid / total) * 100), color: '#10B981' },
    { status: 'Partially Paid', count: counts['Partially Paid'], percentage: Math.round((counts['Partially Paid'] / total) * 100), color: '#38BDF8' },
    { status: 'Due Soon', count: counts['Due Soon'], percentage: Math.round((counts['Due Soon'] / total) * 100), color: '#FBBF24' },
    { status: 'Overdue', count: counts.Overdue, percentage: Math.round((counts.Overdue / total) * 100), color: '#F97316' },
    { status: 'Open', count: counts.Open, percentage: Math.round((counts.Open / total) * 100), color: '#EF4444' },
  ];
};

// Dynamic Insights Calculator
export const computeDynamicInsights = (invoices: Invoice[]) => {
  const overdueCount = invoices.filter((inv) => inv.status === 'Overdue').length;
  const dueSoonCount = invoices.filter((inv) => inv.status === 'Due Soon').length;
  const partiallyPaidCount = invoices.filter((inv) => inv.status === 'Partially Paid').length;

  const totalOutstanding = invoices.reduce((acc, inv) => acc + (inv.outstanding > 0 ? inv.outstanding : 0), 0);
  const outstandingInvoices = invoices.filter((inv) => inv.outstanding > 0);
  const avgOutstanding = outstandingInvoices.length > 0 ? Math.round(totalOutstanding / outstandingInvoices.length) : 0;

  const total = Math.max(1, invoices.length);
  const partiallyPaidPct = Math.round((partiallyPaidCount / total) * 100);

  return [
    {
      id: '1',
      highlight: `${overdueCount} invoices`,
      text: ' are overdue and need immediate follow-up.',
    },
    {
      id: '2',
      highlight: `${dueSoonCount} invoices`,
      text: ' are due within the next 30 days.',
    },
    {
      id: '3',
      prefix: 'Partially paid invoices account for ',
      highlight: `${partiallyPaidPct}%`,
      text: ' of total invoices.',
    },
    {
      id: '4',
      prefix: 'Average outstanding per invoice: ',
      highlight: `${formatRupee(avgOutstanding)}.`,
      text: '',
    },
  ];
};

export const exportProposalsToCsv = <T extends object>(proposals: T[], filename: string = 'proposals_export'): void => {
  exportInvoicesToCsv(filename || 'proposals_export', proposals);
};
