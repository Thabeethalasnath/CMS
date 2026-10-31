import React, { useState } from 'react';
import { X, Phone, CheckCircle2, Copy, Check, AlertCircle } from 'lucide-react';
import { collectionsApiService } from '../services/collectionsApiService';
import { Invoice } from '../types';
import { formatRupee } from '../utils';

interface CallEmailModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
}

export const CallEmailModal: React.FC<CallEmailModalProps> = ({
  isOpen,
  invoice,
  onClose,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (invoice) {
      setEmailSubject(`Payment Follow-Up: Invoice ${invoice.id} — KALPANAAA Software Solutions`);
      setEmailBody(
        `Dear ${invoice.client} Team,\n\nWe would like to follow up regarding the outstanding balance of ${formatRupee(
          invoice.outstanding
        )} for invoice ${invoice.id}, which was due on ${
          invoice.dueDate
        }.\n\nPlease arrange for the payment or let us know if you need any clarification.\n\nWarm regards,\nFinance & Accounts Team\nKALPANAAA Software Solutions`
      );
      setErrorMessage(null);
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const phone = '+91 98201 44520';
  const email = `accounts@${invoice.client.toLowerCase().replace(/[^a-z]/g, '')}.com`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!invoice) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await collectionsApiService.logCommunication(invoice.id, {
        communicationType: 'EMAIL', subject: emailSubject, message: emailBody, recipient: email,
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send email and log communication');
      setIsSubmitting(false);
    }
  };

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
          maxWidth: '520px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
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
            <Phone size={18} color="#4F46E5" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, lineHeight: '24px', color: '#0F172A', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Call + email client
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

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', fontFamily: "'Inter', sans-serif" }}>
          {sentSuccess ? (
            <div
              style={{
                textAlign: 'center',
                padding: '24px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <CheckCircle2 size={42} color="#16A34A" />
              <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: '24px', color: '#0F172A' }}>
                Email Sent & Call Logged!
              </div>
              <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B' }}>
                Follow-up activity recorded in client timeline.
              </div>
            </div>
          ) : (
            <>
              {/* Client Contact Details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {/* Phone Box */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>FINANCE PHONE</span>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedPhone ? '#16A34A' : '#4F46E5',
                        cursor: 'pointer',
                        fontSize: '11px',
                        lineHeight: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {copiedPhone ? <Check size={12} /> : <Copy size={12} />}
                      {copiedPhone ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: '18px', color: '#0F172A', marginTop: '4px' }}>
                    {phone}
                  </div>
                </div>

                {/* Email Box */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>BILLING EMAIL</span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedEmail ? '#16A34A' : '#4F46E5',
                        cursor: 'pointer',
                        fontSize: '11px',
                        lineHeight: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {copiedEmail ? <Check size={12} /> : <Copy size={12} />}
                      {copiedEmail ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      lineHeight: '18px',
                      color: '#0F172A',
                      marginTop: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {email}
                  </div>
                </div>
              </div>

              {/* Email Form */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, lineHeight: '16px', color: '#334155', marginBottom: '4px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    padding: '0 10px',
                    fontSize: '12px',
                    lineHeight: '16px',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, lineHeight: '16px', color: '#334155', marginBottom: '4px' }}>
                  Email message
                </label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    padding: '10px',
                    fontSize: '12px',
                    lineHeight: '16px',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Actions */}
              {errorMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '12px', marginBottom: '12px', padding: '8px 12px', backgroundColor: '#FEF2F2', borderRadius: '6px' }}>
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSendEmail}
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
                  }}
                >
                  Send email & log
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
