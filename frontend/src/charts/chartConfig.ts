/**
 * Universal Chart Configurations, Tokens, and Helper Utilities
 */

export const CHART_COLORS = {
  // Brand & Accents
  primaryIndigo: '#4F46E5',
  tealAccent: '#0D9488',
  skyCyan: '#38BDF8',
  emeraldGreen: '#10B981',
  goldenYellow: '#FBBF24',
  vibrantOrange: '#F97316',
  crimsonRed: '#EF4444',
  purpleViolet: '#7C3AED',

  // Ageing Buckets Palette
  ageing: {
    current: '#38BDF8',
    days1_30: '#10B981',
    days31_60: '#FBBF24',
    days61_90: '#F97316',
    days90Plus: '#EF4444',
  },

  // Collection Status Palette
  status: {
    paid: '#10B981',
    partiallyPaid: '#38BDF8',
    dueSoon: '#FBBF24',
    overdue: '#F97316',
    open: '#EF4444',
  },

  // Surfaces & Gridlines
  gridLine: '#F1F5F9',
  baseline: '#E2E8F0',
  textMuted: '#94A3B8',
  textSecondary: '#64748B',
  textPrimary: '#0F172A',
};

export const formatRupeeValue = (amount: number): string => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

export const formatLakhs = (val: number): string => {
  if (val === 0) return '0';
  if (val >= 100000) {
    const lakhs = val / 100000;
    return `${lakhs}L`;
  }
  return String(val);
};

export const DEFAULT_AGEING_Y_AXIS_AMOUNT = [
  { label: '20L', value: 2000000 },
  { label: '15L', value: 1500000 },
  { label: '10L', value: 1000000 },
  { label: '5L', value: 500000 },
  { label: '0', value: 0 },
];

export const DEFAULT_AGEING_Y_AXIS_COUNT = [
  { label: '20', value: 20 },
  { label: '15', value: 15 },
  { label: '10', value: 10 },
  { label: '5', value: 5 },
  { label: '0', value: 0 },
];
