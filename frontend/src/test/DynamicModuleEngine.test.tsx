import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder';
import { moduleEngineService } from '@/services/moduleEngineService';

describe('Dynamic Module Engine (ModulePlaceholder)', () => {
  const sampleRecords = [
    {
      id: 'L-001',
      code: 'L-001',
      title: 'Acme Corp',
      subtitle: 'Lead Description',
      category: 'Enterprise',
      status: 'Active',
      priority: 'High',
      assignee: 'Akshit Ujjain',
      value: '₹ 10,00,000',
      date: '15 Mar 2025',
    },
    {
      id: 'L-002',
      code: 'L-002',
      title: 'Beta Industries',
      subtitle: 'Mid-Market Lead',
      category: 'Retail',
      status: 'Pending',
      priority: 'Normal',
      assignee: 'Amit Sharma',
      value: '₹ 5,00,000',
      date: '18 Mar 2025',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(moduleEngineService, 'getModuleRecords').mockResolvedValue(sampleRecords as any);
    vi.spyOn(moduleEngineService, 'getModuleSummary').mockResolvedValue({
      total: 2,
      primaryLabel: 'Total Leads',
      active: 1,
      activeLabel: 'Active Leads',
      secondary: 1,
      secondaryLabel: 'Pending Review',
      metricValFormatted: '₹ 15,00,000',
      trend: '↑ 12%',
    });
  });

  it('renders dynamic title, category eyebrow, KPI cards and table rows', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/sales/leads']}>
          <ModulePlaceholder title="Leads" category="Sales & CRM" />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: 'Leads' })).toBeDefined();
    expect(screen.getByText(/Sales & CRM/i)).toBeDefined();
    expect(screen.getByText('Total Leads')).toBeDefined();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getByText('Acme Corp')).toBeDefined();
    expect(screen.getByText('Beta Industries')).toBeDefined();
  });

  it('filters records by search query', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/sales/leads']}>
          <ModulePlaceholder title="Leads" category="Sales & CRM" />
        </MemoryRouter>
      );
    });

    const searchInput = screen.getByPlaceholderText(/Search leads by/i);
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Beta' } });
    });

    expect(screen.getByText('Beta Industries')).toBeDefined();
    expect(screen.queryByText('Acme Corp')).toBeNull();
  });

  it('opens and closes Add Record modal', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/sales/leads']}>
          <ModulePlaceholder title="Leads" category="Sales & CRM" />
        </MemoryRouter>
      );
    });

    const addBtn = screen.getByRole('button', { name: /Add Record/i });
    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(screen.getByText('Add New Record to Leads')).toBeDefined();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    expect(screen.queryByText('Add New Record to Leads')).toBeNull();
  });
});
