import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CeoDashboardPage } from '@/features/dashboard/pages/CeoDashboardPage';
import { dashboardService } from '@/services/dashboardService';
import { initialDashboardData } from '@/constants/initialDashboardData';

describe('CeoDashboardPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and displays live CEO dashboard data from service', async () => {
    const mockData = {
      ...initialDashboardData,
      settings: {
        ...initialDashboardData.settings,
        dashboard_title: 'Executive CEO Dashboard Live',
      },
      kpis: [
        {
          id: 1,
          card_key: 'revenue_invoice_value',
          title: 'Revenue | Invoice Value',
          raw_value: 12450000,
          formatted_value: '₹ 1,24,50,000',
          change_percentage: 12,
          change_type: 'positive' as const,
          comparison_text: 'vs last period',
          icon_type: 'receipt',
          color_theme: 'emerald',
          sort_order: 1,
        },
      ],
    };

    vi.spyOn(dashboardService, 'getDashboardData').mockResolvedValue(mockData);

    await act(async () => {
      render(
        <BrowserRouter>
          <CeoDashboardPage
            dateRange="Apr 2024 - Mar 2025"
            isEditModalOpen={false}
            onCloseEditModal={() => {}}
          />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Executive CEO Dashboard Live')).toBeInTheDocument();
    expect(screen.getByText('Finance Overview')).toBeInTheDocument();
    expect(screen.getByText('Sales & Delivery Overview')).toBeInTheDocument();
    expect(screen.getByText('People Overview')).toBeInTheDocument();
    expect(screen.getByText('Management Alerts')).toBeInTheDocument();
  });
});

