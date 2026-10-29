import React, { useState, useEffect } from 'react';
import { X, FileCheck, Check, Trash2, Calendar, IndianRupee, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { ContractData } from '@/types/contract';

interface ContractDetailModalProps {
  isOpen: boolean;
  contract: ContractData | null;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<ContractData>) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export const ContractDetailModal: React.FC<ContractDetailModalProps> = ({
  isOpen,
  contract,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [status, setStatus] = useState<string>('Active');
  const [contractType, setContractType] = useState<string>('Service Agreement');
  const [contractValue, setContractValue] = useState<string>('');
  const [noticePeriod, setNoticePeriod] = useState<number>(30);
  const [paymentTerms, setPaymentTerms] = useState<string>('Monthly');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [renewalDate, setRenewalDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contract) {
      setStatus(contract.status || 'Active');
      setContractType(contract.contractType || 'Service Agreement');
      setContractValue(String(contract.contractValue || ''));
      setNoticePeriod(contract.noticePeriod || 30);
      setPaymentTerms(contract.paymentTerms || 'Monthly');
      setStartDate(contract.startDate || '');
      setEndDate(contract.endDate || '');
      setRenewalDate(contract.renewalDate || '');
      setNotes(contract.notes || '');
    }
  }, [contract]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !contract) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const val = parseFloat(contractValue.replace(/[^0-9.]/g, ''));
      await onUpdate(contract.id, {
        status,
        contractType,
        contractValue: isNaN(val) ? contract.contractValue : val,
        noticePeriod: Number(noticePeriod) || 30,
        paymentTerms,
        startDate,
        endDate,
        renewalDate,
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update contract');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete contract ${contract.contractId}?`)) return;
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(contract.id);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to delete contract');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E2E8F0',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
              }}
            >
              <FileCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0,
                    lineHeight: '24px',
                  }}
                >
                  {contract.contractId}
                </h2>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor:
                      status === 'Active'
                        ? '#ECFDF5'
                        : status === 'Expiring'
                        ? '#FFFBEB'
                        : status === 'Terminated' || status === 'Expired'
                        ? '#FFF1F2'
                        : '#F0F9FF',
                    color:
                      status === 'Active'
                        ? '#047857'
                        : status === 'Expiring'
                        ? '#B45309'
                        : status === 'Terminated' || status === 'Expired'
                        ? '#BE123C'
                        : '#0369A1',
                    border: `1px solid ${
                      status === 'Active'
                        ? '#A7F3D0'
                        : status === 'Expiring'
                        ? '#FDE68A'
                        : status === 'Terminated' || status === 'Expired'
                        ? '#FECDD3'
                        : '#BAE6FD'
                    }`,
                  }}
                >
                  {status}
                </span>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: '#64748B',
                  margin: 0,
                  marginTop: '2px',
                }}
              >
                Client: {contract.clientId} • Proposal: {contract.proposalId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#FFF1F2',
                border: '1px solid #FECDD3',
                color: '#BE123C',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                Contract Type
              </label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#1E293B',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Service Agreement">Service Agreement</option>
                <option value="Project Contract">Project Contract</option>
                <option value="Support & Maintenance">Support & Maintenance</option>
                <option value="Software License">Software License</option>
                <option value="Consulting Agreement">Consulting Agreement</option>
                <option value="Implementation Contract">Implementation Contract</option>
                <option value="Annual Maintenance">Annual Maintenance</option>
                <option value="Managed Services">Managed Services</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#1E293B',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Active">Active</option>
                <option value="Expiring">Expiring</option>
                <option value="Pending">Pending</option>
                <option value="Terminated">Terminated</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                Contract Value (₹)
              </label>
              <input
                type="text"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#1E293B',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                Payment Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#1E293B',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Milestone">Milestone</option>
                <option value="Annual">Annual</option>
                <option value="Net 30">Net 30</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                Start Date
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#1E293B',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                End Date
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#1E293B',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                Renewal Date
              </label>
              <input
                type="text"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#1E293B',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                Notice Period (Days)
              </label>
              <input
                type="number"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(parseInt(e.target.value, 10) || 0)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#1E293B',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                Client ID
              </label>
              <input
                type="text"
                disabled
                value={contract.clientId}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#64748B',
                  backgroundColor: '#F8FAFC',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Notes / Terms
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '13px',
                color: '#1E293B',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {onDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                height: '36px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1px solid #FECDD3',
                backgroundColor: '#FFF1F2',
                color: '#BE123C',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Trash2 size={15} />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          ) : <div />}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                height: '36px',
                padding: '0 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
                boxShadow: '0 1px 2px rgba(79, 70, 229, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={16} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

