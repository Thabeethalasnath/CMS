import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/services/api/apiEndpoints';
import { FinanceDashboardData, FinanceQueryParams } from '../types/finance';

export function formatRupeeAmount(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '₹ 0.00';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '₹ 0.00';
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const formatted = absNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return isNegative ? `-₹ ${formatted}` : `₹ ${formatted}`;
}

export function formatCompactRupees(val: number): string {
  if (val === 0) return '₹ 0';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  if (abs >= 10000000) {
    return `${sign}₹ ${(abs / 10000000).toFixed(1)} Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹ ${(abs / 100000).toFixed(1)} L`;
  }
  if (abs >= 1000) {
    return `${sign}₹ ${(abs / 1000).toFixed(1)} K`;
  }
  return `${sign}₹ ${abs.toFixed(1)}`;
}

export function formatPercentage(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0.00%';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0.00%';
  return `${num.toFixed(2)}%`;
}

export function formatLastUpdatedTimestamp(isoString?: string): string {
  if (!isoString) {
    const d = new Date();
    const day = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${day}, ${time}`;
  }
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${day}, ${time}`;
  } catch {
    return isoString;
  }
}

export const financeService = {
  async getDashboardData(params?: FinanceQueryParams): Promise<FinanceDashboardData> {
    const queryParams: Record<string, string | number | boolean | undefined | null> = {};
    if (params?.period) queryParams.period = params.period;
    if (params?.from) queryParams.from = params.from;
    if (params?.to) queryParams.to = params.to;
    if (params?.asOf) queryParams.asOf = params.asOf;

    const res = await apiClient.get<FinanceDashboardData>(API_ENDPOINTS.FINANCE.DASHBOARD, queryParams);
    return res.data;
  },

  exportToCsv(data: FinanceDashboardData): void {
    const headers = ['Metric', 'Value', 'Target', 'Status'];
    const rows = data.metricSummary.map((r) => {
      let formattedVal = '-';
      if (r.value !== null && r.value !== undefined) {
        if (r.valueType === 'CURRENCY') {
          formattedVal = formatRupeeAmount(r.value).replace(/₹/g, 'INR');
        } else if (r.valueType === 'PERCENT') {
          formattedVal = formatPercentage(r.value);
        } else {
          formattedVal = String(r.value);
        }
      }
      let formattedTarget = '-';
      if (r.target !== null && r.target !== undefined) {
        if (r.valueType === 'CURRENCY') {
          formattedTarget = formatRupeeAmount(r.target).replace(/₹/g, 'INR');
        } else if (r.valueType === 'PERCENT') {
          formattedTarget = formatPercentage(r.target);
        } else {
          formattedTarget = String(r.target);
        }
      }
      return [
        `"${r.metricName}"`,
        `"${formattedVal}"`,
        `"${formattedTarget}"`,
        `"${r.status}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Finance_Dashboard_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
