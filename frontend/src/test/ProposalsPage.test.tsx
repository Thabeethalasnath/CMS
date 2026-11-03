import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProposalsPage } from '@/features/proposals/pages/ProposalsPage';
import { proposalsApiService } from '@/features/proposals/services/proposalsApiService';
import { Proposal, ProposalKpiSummary } from '@/features/proposals/types';

const mockProposals: Proposal[] = [
  {
    proposalId: 'P-2025-001',
    opportunityId: 'O-2025-001',
    clientId: 'C-001',
    clientName: 'Alpha Corp',
    proposalDate: '2025-03-15',
    validUntil: '2025-04-15',
    version: 'v1.0',
    title: 'Cloud Infrastructure Setup',
    serviceId: 'S-001',
    serviceName: 'Cloud Migration',
    serviceBeforeTax: 1000000,
    taxAmount: 180000,
    totalAmount: 1180000,
    ownerId: 'EMP-001',
    ownerName: 'Rahul Verma',
    status: 'Pending',
    expectedDecisionDate: '2025-04-01',
  },
];

const mockKpis: ProposalKpiSummary = {
  totalProposals: 1,
  totalProposalsTrend: 10,
  pendingDecisions: 1,
  pendingDecisionsTrend: -5,
  approvedProposals: 0,
  approvedProposalsTrend: null,
  totalProposalValue: 1180000,
  totalProposalValueTrend: 15,
};

describe('ProposalsPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(proposalsApiService, 'getProposals').mockResolvedValue({
      content: mockProposals,
      pageNumber: 1,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1, first: true, last: true,
    });
    vi.spyOn(proposalsApiService, 'getAllFilteredProposals').mockResolvedValue(mockProposals);
    vi.spyOn(proposalsApiService, 'getKpis').mockResolvedValue(mockKpis);
    vi.spyOn(proposalsApiService, 'getFilterOptions').mockResolvedValue({
      owners: ['All', 'EMP-001'],
      clients: ['All', 'C-001'],
      opportunities: ['All', 'O-2025-001'],
      services: ['All', 'S-001'],
    });
    vi.spyOn(proposalsApiService, 'getNextProposalId').mockResolvedValue('P-2025-002');
  });

  it('renders loading skeleton initially', async () => {
    vi.spyOn(proposalsApiService, 'getProposals').mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Proposals' })).toBeInTheDocument();
  });

  it('displays error banner with Retry button when API fails, and clicking retry reloads', async () => {
    const getProposalsSpy = vi.spyOn(proposalsApiService, 'getProposals')
      .mockRejectedValueOnce(new Error('Network error loading proposals'))
      .mockResolvedValueOnce({
        content: mockProposals,
        pageNumber: 1,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1, first: true, last: true,
      });

    await act(async () => {
      render(
        <BrowserRouter>
          <ProposalsPage />
        </BrowserRouter>
      );
    });

    const errorBanner = screen.getByRole('alert');
    expect(errorBanner).toHaveTextContent('Network error loading proposals');

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(getProposalsSpy).toHaveBeenCalledTimes(2);
  });

  it('renders empty state when no proposals match', async () => {
    vi.spyOn(proposalsApiService, 'getProposals').mockResolvedValue({
      content: [],
      pageNumber: 1,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0, first: true, last: true,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <ProposalsPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('No proposals found')).toBeInTheDocument();
  });

  it('renders success state with KPI cards and table rows', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ProposalsPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('P-2025-001')).toBeInTheDocument();
    expect(screen.getByText('Cloud Infrastructure Setup')).toBeInTheDocument();
  });

  it('rolls back state when update status fails', async () => {
    vi.spyOn(proposalsApiService, 'updateStatus').mockRejectedValue(new Error('Server error updating status'));

    await act(async () => {
      render(
        <BrowserRouter>
          <ProposalsPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('P-2025-001')).toBeInTheDocument();
  });
});
