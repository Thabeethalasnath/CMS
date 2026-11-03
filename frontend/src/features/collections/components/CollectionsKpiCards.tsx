import React from 'react';
import { Wallet, FileText, Clock, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { KpiSummary } from '../types';
import { formatRupee, formatNumber } from '../utils';

interface CollectionsKpiCardsProps {
  kpis: KpiSummary;
}

export const CollectionsKpiCards: React.FC<CollectionsKpiCardsProps> = ({ kpis }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Card 1: Total outstanding */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                letterSpacing: '-0.01em',
                color: '#64748B',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Total outstanding
            </span>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 800,
                lineHeight: '32px',
                letterSpacing: '-0.6px',
                color: '#0F172A',
                marginTop: '4px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {formatRupee(kpis.totalOutstanding.amount)}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                lineHeight: '16px',
                color: '#64748B',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {kpis.totalOutstanding.count} invoices
            </span>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Wallet size={18} color="#16A34A" />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '14px',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: '16px',
            color: '#166534',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <ArrowUpRight size={14} />
          <span>{kpis.totalOutstanding.trendPct}% vs last month</span>
        </div>
      </div>

      {/* Card 2: Overdue amount */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                letterSpacing: '-0.01em',
                color: '#64748B',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Overdue amount
            </span>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 800,
                lineHeight: '32px',
                letterSpacing: '-0.6px',
                color: '#0F172A',
                marginTop: '4px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {formatRupee(kpis.overdueAmount.amount)}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                lineHeight: '16px',
                color: '#64748B',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {kpis.overdueAmount.count} invoices
            </span>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={18} color="#EF4444" />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '14px',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: '16px',
            color: '#991B1B',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <ArrowUpRight size={14} />
          <span>{kpis.overdueAmount.trendPct}% vs last month</span>
        </div>
      </div>

      {/* Card 3: Due soon invoices */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span
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
            </span>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 800,
                lineHeight: '32px',
                letterSpacing: '-0.6px',
                color: '#0F172A',
                marginTop: '4px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {formatNumber(kpis.dueSoon.count)}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                lineHeight: '16px',
                color: '#64748B',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {formatRupee(kpis.dueSoon.amount)}
            </span>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={18} color="#F59E0B" />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '14px',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: '16px',
            color: '#166534',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <ArrowDownRight size={14} />
          <span>{Math.abs(kpis.dueSoon.trendPct)}% vs last month</span>
        </div>
      </div>

      {/* Card 4: Collected this month */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                letterSpacing: '-0.01em',
                color: '#64748B',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Collected this month
            </span>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 800,
                lineHeight: '32px',
                letterSpacing: '-0.6px',
                color: '#0F172A',
                marginTop: '4px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {formatRupee(kpis.collectedThisMonth.amount)}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                lineHeight: '16px',
                color: '#64748B',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {kpis.collectedThisMonth.paymentCount} payments
            </span>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#E0F2FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CreditCard size={18} color="#0284C7" />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '14px',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: '16px',
            color: '#166534',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <ArrowUpRight size={14} />
          <span>{kpis.collectedThisMonth.trendPct}% vs last month</span>
        </div>
      </div>
    </div>
  );
};
