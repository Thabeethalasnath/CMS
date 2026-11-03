import React from 'react';
import { X, History, CreditCard } from 'lucide-react';
import { Invoice, PaymentRecord } from '../types';
import { formatRupee } from '../utils';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  payments: PaymentRecord[];
  onClose: () => void;
  onOpenLogPayment: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  invoice,
  payments,
  onClose,
  onOpenLogPayment,
}) => {
  if (!isOpen || !invoice) return null;

  const invoicePayments = payments.filter((p) => p.invoiceId === invoice.id);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(3px)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="#4F46E5" />
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '24px',
                color: '#0F172A',
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Payment history — {invoice.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Invoice Summary */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            padding: '14px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: '18px' }}>
              {invoice.client} ({invoice.clientId})
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', lineHeight: '16px', marginTop: '2px' }}>
              Invoice total: {formatRupee(invoice.invoiceAmount)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#64748B', lineHeight: '16px' }}>
              Total paid: <strong style={{ color: '#166534', fontWeight: 600 }}>{formatRupee(invoice.amountPaid)}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', lineHeight: '16px', marginTop: '2px' }}>
              Balance due: <strong style={{ color: '#991B1B', fontWeight: 600 }}>{formatRupee(invoice.outstanding)}</strong>
            </div>
          </div>
        </div>

        {/* Payment History List */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {invoicePayments.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '36px 12px',
                color: '#64748B',
                fontSize: '12px',
                lineHeight: '16px',
              }}
            >
              <CreditCard size={36} color="#CBD5E1" style={{ marginBottom: '10px' }} />
              <div>No payments recorded yet for this invoice.</div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#94A3B8' }}>
                Use "Log Payment" to record a payment installment or full settlement.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: "'Inter', sans-serif" }}>
              {invoicePayments.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, lineHeight: '18px', color: '#0F172A' }}>
                        {formatRupee(p.amount)}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          lineHeight: '16px',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                        }}
                      >
                        {p.method}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B', marginTop: '4px' }}>
                      Txn Ref: <strong style={{ color: '#334155', fontWeight: 600 }}>{p.referenceId}</strong> • Date: {p.date}
                    </div>
                    {p.notes && (
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          lineHeight: '16px',
                          color: '#475569',
                          marginTop: '6px',
                          backgroundColor: '#F8FAFC',
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {p.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              color: '#334155',
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
            Close
          </button>

          {invoice.outstanding > 0 && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogPayment();
              }}
              style={{
                height: '38px',
                padding: '0 18px',
                borderRadius: '8px',
                backgroundColor: '#4F46E5',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '16px',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 1px 3px rgba(79, 70, 229, 0.3)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4338CA')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
            >
              + Log new payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
