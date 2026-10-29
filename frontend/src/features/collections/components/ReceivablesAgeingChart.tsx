import React, { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { UniversalBarChart, BarDataPoint, BarSeriesConfig } from '../../../components/charts/UniversalBarChart';
import { AgeingChartItem } from '../types';

interface ReceivablesAgeingChartProps {
  data: AgeingChartItem[];
}

export const ReceivablesAgeingChart: React.FC<ReceivablesAgeingChartProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'amount' | 'count'>('amount');

  // Format category bucket label and subLabel ("days")
  const splitBucketLabel = (bucket: string): { label: string; subLabel?: string } => {
    if (bucket === 'Current') {
      return { label: 'Current' };
    }
    if (bucket.includes('days')) {
      const parts = bucket.replace('days', '').trim();
      return { label: parts, subLabel: 'days' };
    }
    return { label: bucket };
  };

  // Format Lakhs/Rupees nicely
  const formatLakhs = (val: number): string => {
    if (val >= 100000) {
      const lakhs = val / 100000;
      return `₹ ${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
    }
    return `₹ ${new Intl.NumberFormat('en-IN').format(val)}`;
  };

  // Prepare chart items for UniversalBarChart
  const barData: BarDataPoint[] = useMemo(() => {
    return data.map((item) => {
      const { label, subLabel } = splitBucketLabel(item.bucket);
      const isAmount = viewMode === 'amount';
      const fullFormatted = new Intl.NumberFormat('en-IN').format(item.amount);

      return {
        label,
        subLabel,
        value: isAmount ? item.amount : item.count,
        color: item.color,
        secondaryInfo: isAmount
          ? `${item.count} invoices (₹ ${fullFormatted})`
          : `Outstanding: ${formatLakhs(item.amount)}`,
      };
    });
  }, [data, viewMode]);

  const series: BarSeriesConfig[] = useMemo(() => [
    {
      key: 'value',
      name: viewMode === 'amount' ? 'Outstanding' : 'Invoices',
      color: '#4F46E5',
    }
  ], [viewMode]);

  // Dynamically compute maxValue and yAxisTicks with comfortable headroom
  const { maxValue, yAxisTicks } = useMemo(() => {
    if (viewMode === 'amount') {
      const maxRaw = Math.max(...data.map((d) => d.amount), 0);
      let ceiling = 2000000;
      if (maxRaw > 3000000) {
        ceiling = 4000000; // 40L
      } else if (maxRaw > 2000000) {
        ceiling = 3500000; // 35L
      } else if (maxRaw > 1500000) {
        ceiling = 2500000; // 25L
      } else {
        ceiling = 2000000; // 20L
      }

      const step = ceiling / 4;
      return {
        maxValue: ceiling,
        yAxisTicks: [0, step, step * 2, step * 3, ceiling],
      };
    } else {
      const maxCount = Math.max(...data.map((d) => d.count), 0);
      let ceiling = 20;
      if (maxCount > 30) ceiling = 40;
      else if (maxCount > 20) ceiling = 30;
      else if (maxCount > 15) ceiling = 25;
      else ceiling = 20;

      const step = ceiling / 4;
      return {
        maxValue: ceiling,
        yAxisTicks: [0, Math.round(step), Math.round(step * 2), Math.round(step * 3), ceiling],
      };
    }
  }, [data, viewMode]);

  const valueFormatter = (val: number) => {
    if (viewMode === 'amount') {
      return formatLakhs(val);
    }
    return String(val);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart3 size={18} color="#4F46E5" />
          </div>
          <div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: '20px',
                color: '#0F172A',
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Receivables ageing
            </h3>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '16px',
                color: '#64748B',
                margin: '2px 0 0 0',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Outstanding invoice amounts by ageing bucket.
            </p>
          </div>
        </div>

        {/* Amount / Invoice count toggle */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('amount')}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: viewMode === 'amount' ? '#4F46E5' : 'transparent',
              color: viewMode === 'amount' ? '#FFFFFF' : '#64748B',
              transition: 'all 0.15s ease',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Amount
          </button>
          <button
            type="button"
            onClick={() => setViewMode('count')}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: viewMode === 'count' ? '#4F46E5' : 'transparent',
              color: viewMode === 'count' ? '#FFFFFF' : '#64748B',
              transition: 'all 0.15s ease',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Invoice count
          </button>
        </div>
      </div>

      {/* CEO Dashboard UniversalBarChart Component */}
      <div style={{ flex: 1, minHeight: '240px', display: 'flex', alignItems: 'center' }}>
        <UniversalBarChart
          data={barData}
          series={series}
          height={240}
          barWidth={32}
          barRadius={[6, 6, 0, 0]}
          yAxisWidth={42}
          ticks={yAxisTicks}
          domain={[0, maxValue]}
          valueFormatter={valueFormatter}
          useEntryColors={true}
        />
      </div>
    </div>
  );
};
