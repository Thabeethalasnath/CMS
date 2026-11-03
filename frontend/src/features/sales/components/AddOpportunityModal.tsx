import React, { useState, useEffect } from 'react';
import { X, Plus, Target, DollarSign, Calendar, User, Briefcase } from 'lucide-react';
import { CreateOpportunityPayload } from '@/types/opportunity';
import { masterDataService } from '@/services/masterDataService';

interface AddOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateOpportunityPayload) => Promise<void>;
  onAdd?: (data: CreateOpportunityPayload) => Promise<void>;
}

export const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onAdd,
}) => {
  const [opportunityName, setOpportunityName] = useState('');
  const [clientId, setClientId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [stage, setStage] = useState('New');
  const [probability, setProbability] = useState<number>(20);
  const [estimatedValue, setEstimatedValue] = useState<string>('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [lastContact, setLastContact] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [status, setStatus] = useState('Open');
  const [lostReason, setLostReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientOptions, setClientOptions] = useState<{ id: string; label: string }[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<{ id: string; label: string }[]>([]);
  const [serviceOptions, setServiceOptions] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      masterDataService.getClients().then(cls => setClientOptions(cls.map(c => ({ id: c.id, label: `${c.id} - ${c.companyName || c.clientName || c.name || c.id}` })))).catch(() => {});
      masterDataService.getEmployees().then(emps => setEmployeeOptions(emps.map(e => ({ id: e.employeeId, label: `${e.employeeId} - ${e.fullName}` })))).catch(() => {});
      masterDataService.getServices().then(srvs => setServiceOptions(srvs.map(s => ({ id: s, label: s })))).catch(() => {});
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
    switch (newStage) {
      case 'New':
        setProbability(20);
        setStatus('Open');
        break;
      case 'Qualified':
        setProbability(50);
        setStatus('Open');
        break;
      case 'Proposal':
        setProbability(70);
        setStatus('In Progress');
        break;
      case 'Negotiation':
        setProbability(80);
        setStatus('In Progress');
        break;
      case 'Won':
        setProbability(100);
        setStatus('Won');
        break;
      case 'Lost':
        setProbability(0);
        setStatus('Lost');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunityName.trim()) {
      setError('Opportunity Name is required.');
      return;
    }
    if (!clientId.trim()) {
      setError('Client ID is required.');
      return;
    }
    if (!ownerId.trim()) {
      setError('Owner ID is required.');
      return;
    }
    if (!serviceId.trim()) {
      setError('Service ID is required.');
      return;
    }

    const numValue = parseFloat(estimatedValue.replace(/[^0-9.]/g, '')) || 0;
    if (numValue <= 0) {
      setError('Estimated Value must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const submitFn = onAdd || onSubmit;
    if (!submitFn) {
      setIsSubmitting(false);
      return;
    }

    try {
      await submitFn({
        clientId: clientId.trim(),
        opportunityName: opportunityName.trim(),
        ownerId: ownerId.trim(),
        serviceId: serviceId.trim(),
        stage,
        probability: Number(probability),
        estimatedValue: numValue,
        expectedCloseDate: stage === 'Lost' ? '-' : (expectedCloseDate.trim() || '-'),
        lastContact: lastContact.trim() || '-',
        nextFollowUp: stage === 'Lost' ? '-' : (nextFollowUp.trim() || '-'),
        status,
        lostReason: stage === 'Lost' ? (lostReason.trim() || 'Budget issue') : '-',
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create opportunity.');
      }
    } finally {
      setIsSubmitting(false);
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
          maxWidth: '640px',
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
            padding: '16px 24px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                Add New Opportunity
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>
                Fill in the details below to add a deal to the sales pipeline.
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
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '20px 24px',
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
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                color: '#DC2626',
                fontSize: '12px',
              }}
            >
              {error}
            </div>
          )}

          {/* Opportunity Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Target size={14} color="#4F46E5" /> Opportunity Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Website Redesign Project"
              value={opportunityName}
              onChange={(e) => setOpportunityName(e.target.value)}
              style={{
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                padding: '0 12px',
                fontSize: '13px',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          {/* Row: Client ID, Owner ID, Service ID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Briefcase size={14} color="#64748B" /> Client ID
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 10px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="">Select Client</option>
                {clientOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <User size={14} color="#64748B" /> Owner ID
              </label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 10px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="">Select Owner</option>
                {employeeOptions.map((e) => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Briefcase size={14} color="#64748B" /> Service ID
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 10px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="">Select Service</option>
                {serviceOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Stage, Status, Probability */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Stage</label>
              <select
                value={stage}
                onChange={(e) => handleStageChange(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 10px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 10px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row: Estimated Value & Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <DollarSign size={14} color="#10B981" /> Estimated Value (₹)
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                placeholder="500000"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Calendar size={14} color="#64748B" /> Expected Close Date
              </label>
              <input
                type="text"
                placeholder="e.g. 20 Apr 2025"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row: Last Contact & Next Follow-Up */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Calendar size={14} color="#64748B" /> Last Contact
              </label>
              <input
                type="date"
                placeholder="YYYY-MM-DD"
                value={lastContact}
                onChange={(e) => setLastContact(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Calendar size={14} color="#EF4444" /> Next Follow-up
              </label>
              <input
                type="date"
                placeholder="YYYY-MM-DD"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {stage === 'Lost' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#BE123C' }}>
                Lost Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Budget issue, Competitor selected"
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #FECDD3',
                  padding: '0 12px',
                  fontSize: '13px',
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* Footer Action Buttons */}
          <div
            style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              type="submit"
              disabled={isSubmitting}
              style={{
                height: '36px',
                padding: '0 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              }}
            >
              {isSubmitting ? 'Saving...' : 'Add Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

