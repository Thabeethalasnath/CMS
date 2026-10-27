import React, { useState } from 'react';
import { X, Save, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import { FullDashboardData, KpiCard } from '../../types/dashboard';

interface EditDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: FullDashboardData;
  onSaveData: (updated: FullDashboardData) => Promise<void>;
  selectedKpiKey?: string | null;
}

export const EditDataModal: React.FC<EditDataModalProps> = ({
  isOpen,
  onClose,
  dashboardData,
  onSaveData,
  selectedKpiKey = null
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<FullDashboardData>(JSON.parse(JSON.stringify(dashboardData)));
  const [activeTab, setActiveTab] = useState<'kpi' | 'alerts' | 'settings'>('kpi');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleKpiChange = (cardKey: string, field: keyof KpiCard, value: any) => {
    setFormData((prev) => ({
      ...prev,
      kpis: prev.kpis.map((k) => (k.card_key === cardKey ? { ...k, [field]: value } : k))
    }));
  };

  const handleAlertChange = (id: number, count: number) => {
    setFormData((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === id ? { ...a, alert_count: count } : a))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onSaveData(formData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error('Failed to save to database:', err);
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
        padding: '20px'
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
          border: '1px solid #e2e8f0'
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
            backgroundColor: '#f8fafc'
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
                justifyContent: 'center'
              }}
            >
              <Database size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                Update Dynamic Data (Live Supabase DB)
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b' }}>
                Modify any figure and click save to persist immediately to your database.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ color: '#94a3b8', padding: '4px', borderRadius: '5px' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 22px', backgroundColor: '#ffffff' }}>
          <button
            onClick={() => setActiveTab('kpi')}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: activeTab === 'kpi' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'kpi' ? '2px solid #2563eb' : '2px solid transparent'
            }}
          >
            KPI Cards (10 Metrics)
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: activeTab === 'alerts' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'alerts' ? '2px solid #2563eb' : '2px solid transparent'
            }}
          >
            Management Alerts
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: activeTab === 'settings' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'settings' ? '2px solid #2563eb' : '2px solid transparent'
            }}
          >
            Dashboard Meta
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '20px 22px', flex: 1 }}>
          {activeTab === 'kpi' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {formData.kpis.map((kpi) => (
                <div
                  key={kpi.card_key}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                    {kpi.title}
                  </label>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>Formatted Text:</span>
                      <input
                        type="text"
                        value={kpi.formatted_value}
                        onChange={(e) => handleKpiChange(kpi.card_key, 'formatted_value', e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '5px',
                          padding: '5px 8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a'
                        }}
                      />
                    </div>

                    <div style={{ width: '85px' }}>
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
                          color: kpi.change_percentage >= 0 ? '#059669' : '#dc2626'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                    {alert.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Alert Count:</span>
                    <input
                      type="number"
                      min={0}
                      value={alert.alert_count}
                      onChange={(e) => handleAlertChange(alert.id, parseInt(e.target.value, 10) || 0)}
                      style={{
                        width: '70px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '5px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#0f172a',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.settings.company_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, company_name: e.target.value }
                    }))
                  }
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    fontSize: '12.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Dashboard Subtitle
                </label>
                <input
                  type="text"
                  value={formData.settings.dashboard_subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, dashboard_subtitle: e.target.value }
                    }))
                  }
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    fontSize: '12.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Executive User Name
                </label>
                <input
                  type="text"
                  value={formData.settings.user_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      settings: { ...prev.settings, user_name: e.target.value }
                    }))
                  }
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    fontSize: '12.5px'
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div
            style={{
              marginTop: '20px',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12.5px',
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                fontWeight: 600
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '6px',
                fontSize: '12.5px',
                color: '#ffffff',
                backgroundColor: saveSuccess ? '#10b981' : '#2563eb',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Saved to Supabase!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save to Supabase DB</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
