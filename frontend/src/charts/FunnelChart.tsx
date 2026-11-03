import React from 'react';
import { FunnelChartProps } from './types';

export const FunnelChart: React.FC<FunnelChartProps> = ({
  steps,
  height = 240,
  className,
  style,
}) => {
  const maxVal = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        height: `${height}px`,
        ...style,
      }}
    >
      {steps.map((step) => {
        const widthPct = Math.max(15, (step.value / maxVal) * 100);
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Label */}
            <span
              style={{
                width: '90px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#475569',
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {step.label}
            </span>

            {/* Funnel Bar */}
            <div style={{ flex: 1, backgroundColor: '#F1F5F9', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${widthPct}%`,
                  height: '100%',
                  backgroundColor: step.color,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '8px',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  transition: 'width 0.4s ease',
                }}
              >
                {step.value}
              </div>
            </div>

            {/* Percentage / subLabel */}
            <span style={{ width: '40px', fontSize: '11px', color: '#64748B', textAlign: 'right' }}>
              {step.percentage ? `${step.percentage}%` : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
};
