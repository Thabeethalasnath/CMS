import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { collectionsApiService } from '../services/collectionsApiService';
import { Invoice } from '../types';
import { formatRupee } from '../utils';

interface SendReminderModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  invoice,
  onClose,
  onConfirm,
}) => {
  const [channels, setChannels] = useState({
    email: true,
    whatsapp: true,
    sms: false,
  });
  const [template, setTemplate] = useState('Standard Overdue Notice (Gentle)');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !invoice) return null;

  const handleSend = async () => {
    if (!invoice) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await collectionsApiService.sendReminder(invoice.id, {
        channels,
        template,
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setIsSubmitting(false);
        onConfirm();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send reminder');
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
          maxWidth: '460px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
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
            <Mail size={18} color="#4F46E5" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, lineHeight: '24px', color: '#0F172A', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Send payment reminder
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
        <div style={{ padding: '20px', fontFamily: "'Inter', sans-serif" }}>
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
                Reminder Sent Successfully!
              </div>
              <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B' }}>
                Dispatched via selected channels to {invoice.client}.
              </div>
            </div>
          ) : (
            <>
              {/* Invoice Summary Box */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: '18px', color: '#0F172A' }}>
                  {invoice.id} • {invoice.client}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B', marginTop: '2px' }}>
                  Outstanding Balance:{' '}
                  <strong style={{ color: '#EF4444', fontWeight: 600 }}>{formatRupee(invoice.outstanding)}</strong>
                  {invoice.daysOverdue && ` (${invoice.daysOverdue} days overdue)`}
                </div>
              </div>

              {/* Reminder Template */}
              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '16px',
                    color: '#334155',
                    marginBottom: '4px',
                  }}
                >
                  Reminder Tone & Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    padding: '0 10px',
                    fontSize: '12px',
                    lineHeight: '16px',
                    fontFamily: "'Inter', sans-serif",
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                  }}
                >
                  <option value="Standard Overdue Notice (Gentle)">Standard Overdue Notice (Gentle)</option>
                  <option value="Urgent Notice (Level 2 Follow-Up)">Urgent Notice (Level 2 Follow-Up)</option>
                  <option value="Pre-Due Courtesy Friendly Reminder">Pre-Due Courtesy Friendly Reminder</option>
                  <option value="Executive Management Escalation Notice">Executive Management Escalation Notice</option>
                </select>
              </div>

              {/* Communication Channels */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '16px',
                    color: '#334155',
                    marginBottom: '8px',
                  }}
                >
                  Dispatch Channels
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', lineHeight: '16px', color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={channels.email}
                      onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                    />
                    <span>Email (finance@{invoice.client.toLowerCase().replace(/[^a-z]/g, '')}.com)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', lineHeight: '16px', color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={channels.whatsapp}
                      onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                    />
                    <span>WhatsApp Notification (+91 98200 XXXXX)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', lineHeight: '16px', color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={channels.sms}
                      onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                    />
                    <span>SMS Alert</span>
                  </label>
                </div>
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
                  onClick={handleSend}
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
                  Confirm & send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
