import React, { useMemo } from 'react';
import { ShieldCheck, Lightbulb } from 'lucide-react';
import { UniversalDonutChart, DonutDataItem } from '../../../components/charts/UniversalDonutChart';
import { StatusDistributionItem } from '../types';

interface InsightItem {
  id: string;
  prefix?: string;
  highlight?: string;
  text?: string;
}

interface CollectionStatusChartProps {
  distribution: StatusDistributionItem[];
  insights: InsightItem[];
  totalCount?: number;
}

export const CollectionStatusChart: React.FC<CollectionStatusChartProps> = ({
  distribution,
  insights,
  totalCount = 36,
}) => {
  // Map domain distribution data to CEO Dashboard UniversalDonutChart interface
  const donutData: DonutDataItem[] = useMemo(() => {
    return distribution.map((item) => {
      const label = item.status === 'Open' ? 'Open / Current' : item.status;
      return {
        label,
        value: item.count,
        percentage: item.percentage,
        color: item.color,
        secondaryInfo: `${item.count}`,
      };
    });
  }, [distribution]);

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={18} color="#10B981" />
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
            Collection status
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
            Distribution of invoices by collection status.
          </p>
        </div>
      </div>

      {/* CEO Dashboard UniversalDonutChart Component */}
      <div style={{ padding: '4px 0 12px 0' }}>
        <UniversalDonutChart
          data={donutData}
          size={135}
          centerPrimaryText={String(totalCount)}
          centerSecondaryText="Total Invoices"
          showLegend={true}
          valueFormatter={(val) => `${val}`}
        />
      </div>


      {/* Insights Panel */}
      <div
        style={{
          marginTop: 'auto',
          backgroundColor: '#F0F7FF',
          borderRadius: '10px',
          border: '1px solid #DBEAFE',
          padding: '12px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}
        >
          <Lightbulb size={16} color="#2563EB" />
          <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '16px', color: '#2563EB', fontFamily: "'Inter', sans-serif" }}>Insights</span>
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 400,
            color: '#334155',
            lineHeight: '16px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {insights.map((insight) => (
            <li key={insight.id}>
              {insight.prefix && <span>{insight.prefix}</span>}
              {insight.highlight && (
                <strong style={{ fontWeight: 600, color: '#0F172A' }}>
                  {insight.highlight}
                </strong>
              )}
              {insight.text && <span>{insight.text}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
