import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService, normalizeDashboardData } from '@/services/dashboardService';
import { apiClient } from '@/services/api/apiClient';

describe('dashboardService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('normalizeDashboardData handles nested ApiResponse.data envelope', () => {
    const apiEnvelope = {
      success: true,
      data: {
        settings: { dashboard_title: 'Custom Title' },
        kpis: [{ id: 1, title: 'Revenue', raw_value: 1000 }],
        alerts: [{ id: 1, alert_key: 'pending_approvals', alert_count: 6 }],
      },
    };

    const normalized = normalizeDashboardData(apiEnvelope);
    expect(normalized.settings.dashboard_title).toBe('Custom Title');
    expect(normalized.kpis[0].title).toBe('Revenue');
    expect(normalized.alerts[0].alert_count).toBe(6);
  });

  it('normalizeDashboardData correctly maps graph arrays from API payload', () => {
    const apiEnvelope = {
      sales_pipeline: [
        { id: 1, stage_name: 'Leads', lead_count: 120, conversion_rate: 100, color_hex: '#1d4ed8' }
      ],
      project_status: [
        { id: 1, status_name: 'In Progress', project_count: 6, percentage: 50, color_hex: '#10b981' }
      ],
      people_monthly: [
        { id: 1, month_name: 'Mar', employee_count: 48, net_payroll: 1890000, employer_payroll_cost: 2340000 }
      ]
    };

    const normalized = normalizeDashboardData(apiEnvelope);
    expect(normalized.sales_pipeline[0].lead_count).toBe(120);
    expect(normalized.sales_pipeline[0].conversion_rate).toBe(100);
    expect(normalized.project_status[0].project_count).toBe(6);
    expect(normalized.project_status[0].percentage).toBe(50);
    expect(normalized.people_monthly[0].employee_count).toBe(48);
    expect(normalized.people_monthly[0].net_payroll).toBe(1890000);
    expect(normalized.people_monthly[0].employer_payroll_cost).toBe(2340000);
  });

  it('getDashboardData calls apiClient.get without local caching', async () => {
    const mockData = {
      settings: { dashboard_title: 'Executive CEO Dashboard' },
      kpis: [],
      alerts: [],
    };

    vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      message: 'OK',
      data: mockData as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const res = await dashboardService.getDashboardData();
    expect(res.settings.dashboard_title).toBe('Executive CEO Dashboard');
    expect(localStorage.getItem('kalpanaaa_cms_dashboard_data')).toBeNull();
  });
});

