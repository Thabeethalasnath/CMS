import React from 'react';
import { Zap, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { CollectionStatus } from '../types';

interface LiveManagementChecksProps {
  overdueCount: number;
  dueSoonCount: number;
  onSelectCategory: (status: CollectionStatus) => void;
}

export const LiveManagementChecks: React.FC<LiveManagementChecksProps> = ({
  overdueCount,
  dueSoonCount,
  onSelectCategory,
}) => {
  return (
    <div style={{ marginBottom: '24px', fontFamily: "'Inter', sans-serif" }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <Zap size={18} color="#3B82F6" />
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 700,
            lineHeight: '20px',
            color: '#0F172A',
            margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Live management checks
        </h2>
      </div>
      <p
        style={{
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '16px',
          color: '#64748B',
          margin: '0 0 14px 0',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Quick view of key collection items that need attention.
      </p>

      {/* Two Wide Alert Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Overdue Invoices Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectCategory('Overdue')}
          onKeyDown={(e) => e.key === 'Enter' && onSelectCategory('Overdue')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #FEE2E2',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FCA5A5';
            e.currentTarget.style.backgroundColor = '#FEF2F2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#FEE2E2';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={18} color="#DC2626" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: '16px',
                  letterSpacing: '-0.01em',
                  color: '#64748B',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Overdue invoices
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  lineHeight: '32px',
                  letterSpacing: '-0.6px',
                  color: '#991B1B',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {overdueCount}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  lineHeight: '16px',
                  color: '#64748B',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Require immediate follow-up
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="#F87171" />
        </div>

        {/* Due Soon Invoices Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectCategory('Due Soon')}
          onKeyDown={(e) => e.key === 'Enter' && onSelectCategory('Due Soon')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #FEF3C7',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FDE68A';
            e.currentTarget.style.backgroundColor = '#FFFBEB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#FEF3C7';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Clock size={18} color="#D97706" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: '16px',
                  letterSpacing: '-0.01em',
                  color: '#64748B',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Due soon invoices
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  lineHeight: '32px',
                  letterSpacing: '-0.6px',
                  color: '#92400E',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {dueSoonCount}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  lineHeight: '16px',
                  color: '#64748B',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Due within next 30 days
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="#FBBF24" />
        </div>
      </div>
    </div>
  );
};
