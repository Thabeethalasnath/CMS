import React from 'react';
import { ChartCardProps } from './types';

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  icon,
  iconBgColor = '#EEF2FF',
  headerAction,
  footer,
  children,
  className,
  style,
}) => {
  return (
    <div
      className={className}
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
        ...style,
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon && (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: iconBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}
          <div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#0F172A',
                margin: 0,
                lineHeight: '20px',
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  fontSize: '12px',
                  color: '#64748B',
                  margin: '2px 0 0 0',
                  lineHeight: '16px',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {headerAction && <div>{headerAction}</div>}
      </div>

      {/* Chart Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {children}
      </div>

      {/* Optional Footer (e.g. Insights panel) */}
      {footer && <div style={{ marginTop: '16px' }}>{footer}</div>}
    </div>
  );
};
