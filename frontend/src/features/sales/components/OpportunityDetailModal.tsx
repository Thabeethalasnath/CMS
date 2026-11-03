import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  User,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { OpportunityData } from '@/types/opportunity';

interface OpportunityDetailModalProps {
  item: OpportunityData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (
    id: number,
    stage: string,
    status: string,
    lostReason?: string
  ) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLostInput, setShowLostInput] = useState(false);
  const [lostReason, setLostReason] = useState('Budget issue');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleMarkWon = async () => {
    if (!onUpdateStatus) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(item.id, 'Won', 'Won', '-');
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkLost = async () => {
    if (!onUpdateStatus) return;
    if (!showLostInput) {
      setShowLostInput(true);
      return;
    }
    setIsUpdating(true);
    try {
      await onUpdateStatus(item.id, 'Lost', 'Lost', lostReason.trim() || 'Budget issue');
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm(`Are you sure you want to delete opportunity "${item.opportunityName}" (${item.opportunityId})?`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(item.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif",
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Target size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0F172A',
                  }}
                >
                  {item.opportunityName}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #BFDBFE',
                  }}
                >
                  {item.opportunityId}
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                Lead ID: {item.leadId} • Client ID: {item.clientId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
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
            gap: '20px',
          }}
        >
          {/* Key Value Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {/* Estimated Value */}
            <div
              style={{
                padding: '14px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>
                Estimated Value
              </span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                {item.estimatedValueFormatted || `₹ ${item.estimatedValue?.toLocaleString('en-IN')}`}
              </span>
            </div>

            {/* Probability */}
            <div
              style={{
                padding: '14px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>
                Win Probability
              </span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                {item.probability}%
              </span>
            </div>

            {/* Weighted Pipeline */}
            <div
              style={{
                padding: '14px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>
                Weighted Pipeline
              </span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#4F46E5' }}>
                {item.weightedPipelineFormatted || `₹ ${item.weightedPipeline?.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '2px' }}>
                Stage
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                {item.stage}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '2px' }}>
                Status
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                {item.status}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '2px' }}>
                Owner ID
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                {item.ownerId}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '2px' }}>
                Service ID
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                {item.serviceId}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '2px' }}>
                Expected Close Date
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                {item.expectedCloseDate || '-'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '2px' }}>
                Last Contact
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                {item.lastContact || '-'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '2px' }}>
                Next Follow-Up
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: item.nextFollowUp === '-' ? '#94A3B8' : '#EF4444',
                }}
              >
                {item.nextFollowUp || '-'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '2px' }}>
                Lost Reason
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>
                {item.lostReason || '-'}
              </span>
            </div>
          </div>

          {/* Lost reason input if toggled */}
          {showLostInput && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#FFF1F2',
                border: '1px solid #FECDD3',
                borderRadius: '8px',
              }}
            >
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#BE123C' }}>
                Enter reason for marking as Lost:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  placeholder="e.g. Budget issue, Competitor selected"
                  style={{
                    flex: 1,
                    height: '32px',
                    borderRadius: '6px',
                    border: '1px solid #FECDD3',
                    padding: '0 10px',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleMarkLost}
                  disabled={isUpdating}
                  style={{
                    height: '32px',
                    padding: '0 14px',
                    backgroundColor: '#BE123C',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Confirm Lost
                </button>
              </div>
            </div>
          )}

          {/* Quick Pipeline Status Actions */}
          {onUpdateStatus && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Quick Actions:
              </span>
              {item.status !== 'Won' && (
                <button
                  onClick={handleMarkWon}
                  disabled={isUpdating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: '30px',
                    padding: '0 12px',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: '6px',
                    color: '#047857',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>Mark as Won</span>
                </button>
              )}
              {item.status !== 'Lost' && !showLostInput && (
                <button
                  onClick={handleMarkLost}
                  disabled={isUpdating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: '30px',
                    padding: '0 12px',
                    backgroundColor: '#FFF1F2',
                    border: '1px solid #FECDD3',
                    borderRadius: '6px',
                    color: '#BE123C',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                  }}
                >
                  <XCircle size={14} />
                  <span>Mark as Lost</span>
                </button>
              )}
            </div>
          )}
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
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 12px',
                backgroundColor: 'transparent',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 500,
                cursor: isDeleting ? 'not-allowed' : 'pointer',
              }}
            >
              <Trash2 size={14} />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            style={{
              height: '34px',
              padding: '0 20px',
              backgroundColor: '#4F46E5',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

