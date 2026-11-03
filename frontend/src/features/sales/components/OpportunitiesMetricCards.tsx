import React from 'react';
import { BarChart2, Package, Target } from 'lucide-react';
import { OpportunitySummaryData } from '@/types/opportunity';

interface OpportunitiesMetricCardsProps {
  summary: OpportunitySummaryData | null;
  isLoading: boolean;
}

export const OpportunitiesMetricCards: React.FC<OpportunitiesMetricCardsProps> = ({
  summary,
  isLoading,
}) => {
  const cards = [
    {
      title: 'Total Opportunities',
      value: summary?.totalOpportunities !== undefined ? summary.totalOpportunities : '—',
      trend: summary?.totalOpportunitiesTrend ?? null,
      icon: <BarChart2 style={{ width: '24px', height: '24px', color: '#4F46E5', strokeWidth: 2 }} />,
      iconBg: '#EFF6FF',
    },
    {
      title: 'Open Opportunities',
      value: summary?.openOpportunities !== undefined ? summary.openOpportunities : '—',
      trend: summary?.openOpportunitiesTrend ?? null,
      icon: <Package style={{ width: '24px', height: '24px', color: '#059669', strokeWidth: 2 }} />,
      iconBg: '#ECFDF5',
    },
    {
      title: 'Weighted Pipeline',
      value: summary?.weightedPipelineFormatted ?? (summary?.weightedPipeline !== undefined ? `₹ ${summary.weightedPipeline.toLocaleString('en-IN')}` : '—'),
      trend: summary?.weightedPipelineTrend ?? null,
      icon: (
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '28px',
            color: '#F43F5E',
          }}
        >
          ₹
        </span>
      ),
      iconBg: '#FFF1F2',
    },
    {
      title: 'Won Opportunities',
      value: summary?.wonOpportunities !== undefined ? summary.wonOpportunities : '—',
      trend: summary?.wonOpportunitiesTrend ?? null,
      icon: <Target style={{ width: '24px', height: '24px', color: '#059669', strokeWidth: 2 }} />,
      iconBg: '#ECFDF5',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '16px',
        width: '100%',
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '26px 16px',
            gap: '16px',
            height: '116px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
          }}
        >
          {isLoading ? (
            <div className="w-full flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-2 bg-slate-100 rounded w-1/3" />
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  backgroundColor: card.iconBg,
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#64748B',
                  }}
                >
                  {card.title}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '32px',
                    color: '#0F172A',
                  }}
                >
                  {card.value}
                </span>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                  {card.trend ? (
                    <>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: '11px',
                          lineHeight: '16px',
                          color: card.trend.includes('↓') || card.trend.includes('-') ? '#EF4444' : '#10B981',
                        }}
                      >
                        {card.trend}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                          fontSize: '11px',
                          lineHeight: '16px',
                          color: '#94A3B8',
                        }}
                      >
                        vs last month
                      </span>
                    </>
                  ) : (
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '11px',
                        lineHeight: '16px',
                        color: '#94A3B8',
                      }}
                    >
                      —
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

