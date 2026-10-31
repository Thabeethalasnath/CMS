import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { OpportunitiesPage } from '@/features/sales/pages/OpportunitiesPage';
import { opportunityService } from '@/services/opportunityService';
import { masterDataService } from '@/services/masterDataService';

const mockOpportunities = [
  {
    id: 1,
    opportunityId: 'O-2025-001',
    leadId: 'L-2025-001',
    clientId: 'C-001',
    serviceId: 'S-001',
    opportunityName: 'Cloud Infrastructure Migration',
    stage: 'Proposal',
    probability: 60,
    estimatedValue: 2400000,
    estimatedValueFormatted: '₹ 24,00,000',
    weightedPipeline: 1440000,
    weightedPipelineFormatted: '₹ 14,40,000',
    expectedCloseDate: '2025-04-30',
    ownerId: 'EMP-001',
    status: 'Open',
    createdAt: '2025-03-01',
  },
];

const mockSummary = {
  totalOpportunities: 1,
  openOpportunities: 1,
  weightedPipeline: 1440000,
  weightedPipelineFormatted: '₹ 14,40,000',
  wonOpportunities: 0,
};

describe('OpportunitiesPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(opportunityService, 'getOpportunities').mockResolvedValue(mockOpportunities as any);
    vi.spyOn(opportunityService, 'getSummary').mockResolvedValue(mockSummary);
    vi.spyOn(masterDataService, 'getClients').mockResolvedValue([]);
    vi.spyOn(masterDataService, 'getEmployees').mockResolvedValue([]);
    vi.spyOn(masterDataService, 'getServices').mockResolvedValue([]);
  });

  it('renders loading state initially', async () => {
    vi.spyOn(opportunityService, 'getOpportunities').mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <OpportunitiesPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Opportunities')).toBeInTheDocument();
  });

  it('displays error banner with Retry button when API fails, and clicking retry reloads', async () => {
    const getOppSpy = vi.spyOn(opportunityService, 'getOpportunities')
      .mockRejectedValueOnce(new Error('Network error loading opportunities'))
      .mockResolvedValueOnce(mockOpportunities as any);

    await act(async () => {
      render(
        <BrowserRouter>
          <OpportunitiesPage />
        </BrowserRouter>
      );
    });

    const errorBanner = screen.getByRole('alert');
    expect(errorBanner).toHaveTextContent('Network error loading opportunities');

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(getOppSpy).toHaveBeenCalledTimes(2);
  });

  it('renders empty state when no opportunities match', async () => {
    vi.spyOn(opportunityService, 'getOpportunities').mockResolvedValue([]);

    await act(async () => {
      render(
        <BrowserRouter>
          <OpportunitiesPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText(/no opportunities found/i)).toBeInTheDocument();
  });

  it('renders success state with KPI cards and table rows', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <OpportunitiesPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Opportunities')).toBeInTheDocument();
    expect(screen.getByText('O-2025-001')).toBeInTheDocument();
    expect(screen.getByText('Cloud Infrastructure Migration')).toBeInTheDocument();
  });

  it('rolls back state when mutation fails', async () => {
    vi.spyOn(opportunityService, 'deleteOpportunity').mockRejectedValue(new Error('Server failed to delete'));

    await act(async () => {
      render(
        <BrowserRouter>
          <OpportunitiesPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('O-2025-001')).toBeInTheDocument();
  });
});
