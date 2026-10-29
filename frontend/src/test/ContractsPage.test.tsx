import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ContractsPage } from '@/features/sales/pages/ContractsPage';
import { contractService } from '@/services/contractService';

describe('ContractsPage Component', () => {
  const sampleContracts = [
    {
      id: 1,
      contractId: 'C-2025-001',
      clientId: 'C-001',
      proposalId: 'P-2025-001',
      contractType: 'Service Agreement',
      startDate: '15 Mar 2025',
      endDate: '14 Mar 2026',
      renewalDate: '14 Feb 2026',
      contractValue: 1200000,
      contractValueFormatted: '₹ 12,00,000',
      noticePeriod: 30,
      paymentTerms: 'Monthly',
      status: 'Active',
    },
    {
      id: 2,
      contractId: 'C-2025-002',
      clientId: 'C-003',
      proposalId: 'P-2025-002',
      contractType: 'Project Contract',
      startDate: '10 Mar 2025',
      endDate: '09 Mar 2026',
      renewalDate: '09 Feb 2026',
      contractValue: 850000,
      contractValueFormatted: '₹ 8,50,000',
      noticePeriod: 30,
      paymentTerms: 'Milestone',
      status: 'Active',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(contractService, 'getContracts').mockResolvedValue(sampleContracts as any);
    vi.spyOn(contractService, 'getSummary').mockResolvedValue({
      totalContracts: 72,
      totalContractsTrend: '↑ 14%',
      activeContracts: 56,
      activeContractsTrend: '↑ 8%',
      expiringContracts: 8,
      expiringContractsTrend: '↓ 20%',
      totalContractValue: 123456,
      totalContractValueFormatted: '₹ 1,23,456',
      totalContractValueTrend: '↑ 22%',
    });
  });

  it('renders page header, title, subtitle, and KPI cards', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ContractsPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Contracts' })).toBeInTheDocument();
    expect(
      screen.getByText('Manage client contracts, track contract terms and validity, and monitor renewals.')
    ).toBeInTheDocument();
    expect(screen.getByText('Total Contracts')).toBeInTheDocument();
    expect(screen.getByText('Active Contracts')).toBeInTheDocument();
    expect(screen.getByText('Expiring Contracts')).toBeInTheDocument();
    expect(screen.getByText('Total Contract Value')).toBeInTheDocument();
    expect(screen.getByText('₹ 1,23,456')).toBeInTheDocument();
  });

  it('renders contracts table with rows', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ContractsPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('C-2025-001')).toBeInTheDocument();
    expect(screen.getByText('C-2025-002')).toBeInTheDocument();
    expect(screen.getAllByText('Service Agreement').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Project Contract').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('View Details').length).toBe(2);
  });

  it('toggles filter rows when Filters button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ContractsPage />
        </BrowserRouter>
      );
    });

    const filtersBtn = screen.getByRole('button', { name: /^filters$/i });
    expect(filtersBtn).toBeInTheDocument();

    // Date range inputs are initially visible
    expect(screen.getAllByPlaceholderText(/select date range/i).length).toBe(3);

    // Click to collapse
    await act(async () => {
      fireEvent.click(filtersBtn);
    });
    expect(screen.queryByPlaceholderText(/select date range/i)).not.toBeInTheDocument();

    // Click to expand again
    await act(async () => {
      fireEvent.click(filtersBtn);
    });
    expect(screen.getAllByPlaceholderText(/select date range/i).length).toBe(3);
  });

  it('opens Create Contract modal when + Create Contract button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ContractsPage />
        </BrowserRouter>
      );
    });

    const createBtn = screen.getByRole('button', { name: /create contract/i });
    await act(async () => {
      fireEvent.click(createBtn);
    });

    expect(screen.getByRole('heading', { level: 2, name: /create new contract/i })).toBeInTheDocument();
  });

  it('filters contracts list when searching in the search box', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ContractsPage />
        </BrowserRouter>
      );
    });

    const searchInput = screen.getByPlaceholderText(/search by contract id/i);
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'C-2025-001' } });
    });

    expect(screen.getByText('C-2025-001')).toBeInTheDocument();
    expect(screen.queryByText('C-2025-002')).not.toBeInTheDocument();
  });
});
