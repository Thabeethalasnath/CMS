import React from 'react';
import {
  FileText,
  Eye,
  User,
  Plus,
  Phone,
  Mail,
  History,
} from 'lucide-react';
import { Invoice } from '../types';
import { formatRupee } from '../utils';
import { SemanticStatusBadge } from '../../../components/ui/SemanticStatusBadge';

interface InvoiceDetailsCardProps {
  invoice: Invoice | null;
  onLogPayment: (invoice: Invoice) => void;
  onCallEmail: (invoice: Invoice) => void;
  onSendReminder: (invoice: Invoice) => void;
  onViewHistory: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const InvoiceDetailsCard: React.FC<InvoiceDetailsCardProps> = ({
  invoice,
  onLogPayment,
  onCallEmail,
  onSendReminder,
  onViewHistory,
  onViewInvoice,
}) => {
  if (!invoice) {
    return (
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px dashed #CBD5E1',
        padding: '32px 20px',
        marginBottom: '24px',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '13px',
        fontFamily: "'Inter', sans-serif"
      }}>
        No invoice selected. Select an invoice from the list below to view its details and record actions.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '20px',
        marginBottom: '24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
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
          <FileText size={18} color="#4F46E5" />
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
            Invoice details
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
            View invoice information, payment history and take collection actions.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr minmax(210px, 240px)',
          gap: '24px',
        }}
      >
        {/* Left Side: Invoice Info & Details */}
        <div>
          {/* Invoice ID + Status + View Invoice Action */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '24px',
                color: '#0F172A',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {invoice.id}
            </span>

            {/* Semantic Status Badge */}
            <SemanticStatusBadge status={invoice.status} />

            {/* View invoice button */}
            <button
              type="button"
              onClick={() => onViewInvoice(invoice)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#4F46E5',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                marginLeft: 'auto',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <Eye size={14} />
              <span>View invoice</span>
            </button>
          </div>

          {/* Client Card Banner */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '18px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#E0E7FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={18} color="#4F46E5" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: '18px', color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
                {invoice.client}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                {invoice.clientId}
              </div>
            </div>
          </div>

          {/* Metadata Grid Row 1 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '14px',
              marginBottom: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Invoice Date
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
                {invoice.invoiceDate}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Due Date
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
                {invoice.dueDate}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Invoice Amount
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
                {formatRupee(invoice.invoiceAmount)}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Amount Paid
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
                {formatRupee(invoice.amountPaid)}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Outstanding
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#DC2626', fontFamily: "'Inter', sans-serif" }}>
                {formatRupee(invoice.outstanding)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '14px 0' }} />

          {/* Metadata Grid Row 2 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '14px',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Days Overdue
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#DC2626', fontFamily: "'Inter', sans-serif" }}>
                {invoice.daysOverdue ? `${invoice.daysOverdue} days` : '0 days'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Ageing Bucket
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
                {invoice.ageingBucket}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Collection Status
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#DC2626', fontFamily: "'Inter', sans-serif" }}>
                {invoice.status}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B', display: 'block', fontFamily: "'Inter', sans-serif" }}>
                Recommended Action
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: '#4F46E5', fontFamily: "'Inter', sans-serif" }}>
                {invoice.recommendedAction}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions Stack */}
        <div
          style={{
            borderLeft: '1px solid #F1F5F9',
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              color: '#0F172A',
              marginBottom: '10px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Actions
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Log payment */}
            <button
              type="button"
              onClick={() => onLogPayment(invoice)}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4338CA')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
            >
              <Plus size={16} />
              <span>Log payment</span>
            </button>

            {/* Call + email client */}
            <button
              type="button"
              onClick={() => onCallEmail(invoice)}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <Phone size={15} color="#4F46E5" />
              <span>Call + email client</span>
            </button>

            {/* Send reminder */}
            <button
              type="button"
              onClick={() => onSendReminder(invoice)}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <Mail size={15} color="#4F46E5" />
              <span>Send reminder</span>
            </button>

            {/* View payment history */}
            <button
              type="button"
              onClick={() => onViewHistory(invoice)}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <History size={15} color="#64748B" />
              <span>View payment history</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
