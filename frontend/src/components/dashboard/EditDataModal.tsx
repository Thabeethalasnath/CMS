import React, { useState } from 'react';
import { X, Save, Database, Lock, AlertCircle } from 'lucide-react';
import { FullDashboardData, KpiCard } from '../../types/dashboard';

interface EditDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: FullDashboardData;
  onSaveData: (updated: FullDashboardData) => Promise<void>;
  selectedKpiKey?: string | null;
}

const COMPUTED_KPI_KEYS = new Set([
  'revenue_invoice_value',
  'outstanding_receivables',
  'collected_payments',
  'weighted_sales_pipeline',
  'active_employees',
  'active_projects',
  'total_expenses',
  'net_payroll',
  'employer_payroll_cost',
]);

const COMPUTED_ALERT_KEYS = new Set([
  'pending_approvals',
  'overdue_invoices',
  'overdue_followups',
  'candidate_followups',
]);

export const EditDataModal: React.FC<EditDataModalProps> = ({
  isOpen,
  onClose,
  dashboardData,
  onSaveData,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<FullDashboardData>(JSON.parse(JSON.stringify(dashboardData)));
  const [activeTab, setActiveTab] = useState<'kpi' | 'alerts' | 'settings'>('kpi');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleKpiChange = (cardKey: string, field: keyof KpiCard, value: any) => {
    setFormData((prev) => ({
      ...prev,
      kpis: prev.kpis.map((k) => (k.card_key === cardKey ? { ...k, [field]: value } : k)),
    }));
  };

  const handleSettingsChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      await onSaveData(formData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to persist dashboard settings to database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Edit Dashboard Configuration
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                Only editable parameters are shown. Computed metrics are locked and sourced live from tables.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            style={{ color: '#94a3b8', padding: '4px', borderRadius: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 22px', backgroundColor: '#ffffff' }}>
          <button
            type="button"
            onClick={() => setActiveTab('kpi')}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: activeTab === 'kpi' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'kpi' ? '2px solid #2563eb' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
            }}
          >
            KPI Card Trends
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: activeTab === 'settings' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'settings' ? '2px solid #2563eb' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
            }}
          >
            Dashboard Settings
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div style={{ margin: '14px 22px 0', padding: '10px 14px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '6px', color: '#DC2626', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '20px 22px', flex: 1 }}>
          {activeTab === 'kpi' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {formData.kpis.map((kpi) => {
                const isComputed = COMPUTED_KPI_KEYS.has(kpi.card_key);
                return (
                  <div
                    key={kpi.card_key}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                        {kpi.title}
                      </label>
                      {isComputed && (
                        <span style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                          <Lock size={10} /> Live Computed
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>Live Value (Read Only):</span>
                        <div
                          style={{
                            width: '100%',
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            borderRadius: '5px',
                            padding: '6px 8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#475569',
                            boxSizing: 'border-box',
                          }}
                        >
                          {kpi.formatted_value || '—'}
                        </div>
                      </div>

                      <div style={{ width: '90px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>Trend (%):</span>
                        <input
                          type="number"
                          value={kpi.change_percentage}
                          onChange={(e) => handleKpiChange(kpi.card_key, 'change_percentage', parseFloat(e.target.value) || 0)}
                          style={{
                            width: '100%',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '5px',
                            padding: '5px 8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: kpi.change_percentage >= 0 ? '#059669' : '#dc2626',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>Comparison Text:</span>
                      <input
                        type="text"
                        value={kpi.comparison_text || ''}
                        onChange={(e) => handleKpiChange(kpi.card_key, 'comparison_text', e.target.value)}
                        placeholder="e.g. vs last month"
                        style={{
                          width: '100%',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '5px',
                          padding: '5px 8px',
                          fontSize: '11px',
                          color: '#334155',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.settings.company_name}
                  onChange={(e) => handleSettingsChange('company_name', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Dashboard Title
                </label>
                <input
                  type="text"
                  value={formData.settings.dashboard_title}
                  onChange={(e) => handleSettingsChange('dashboard_title', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Dashboard Subtitle
                </label>
                <input
                  type="text"
                  value={formData.settings.dashboard_subtitle}
                  onChange={(e) => handleSettingsChange('dashboard_subtitle', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Active Date Range
                </label>
                <input
                  type="text"
                  value={formData.settings.active_date_range}
                  onChange={(e) => handleSettingsChange('active_date_range', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: saveSuccess ? '#059669' : '#2563eb',
                fontSize: '12px',
                fontWeight: 600,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
            >
              <Save size={14} />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to DB!' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
