import React from 'react';
import { ChartTooltipProps } from './types';

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  visible,
  x,
  y,
  title,
  label,
  value,
  color,
  secondaryInfo,
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',
        marginBottom: '10px',
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        padding: '10px 14px',
        borderRadius: '12px',
        fontSize: '12px',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        border: '1px solid #E2E8F0',
        zIndex: 50,
        minWidth: '120px',
        boxSizing: 'border-box',
        transition: 'all 0.08s ease-out',
      }}
    >
      {/* Tooltip Header Title (e.g. "Oct" or "Current") */}
      {title && (
        <>
          <div
            style={{
              fontWeight: 700,
              fontSize: '12px',
              color: '#0F172A',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              height: '1px',
              backgroundColor: '#F1F5F9',
              margin: '6px 0 8px 0',
            }}
          />
        </>
      )}

      {/* Main Metric Row: [Square Color Indicator] Label: Value */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {color && (
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '3px',
              backgroundColor: color,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
        )}
        <span style={{ color: '#64748B', fontWeight: 500, fontSize: '12px' }}>
          {label ? `${label}:` : 'Expenses:'}
        </span>
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px', marginLeft: 'auto' }}>
          {value}
        </span>
      </div>

      {/* Optional Secondary Info (e.g. "12 Invoices") */}
      {secondaryInfo && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '11px',
            color: '#94A3B8',
            fontWeight: 500,
            paddingLeft: color ? '18px' : '0px',
          }}
        >
          {secondaryInfo}
        </div>
      )}
    </div>
  );
};
