import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { OpportunitiesPage } from '@/features/sales/pages/OpportunitiesPage';
import { opportunityService } from '@/services/opportunityService';

describe('OpportunitiesPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(opportunityService, 'getOpportunities').mockResolvedValue([]);
    vi.spyOn(opportunityService, 'getSummary').mockResolvedValue({
      totalOpportunities: 156,
      openOpportunities: 98,
      weightedPipeline: 1280000,
      weightedPipelineFormatted: '₹ 128',
      wonOpportunities: 28,
    });
  });

  it('renders page title and KPI cards', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <OpportunitiesPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Track sales opportunities, monitor pipeline value, and manage deal progress.')).toBeInTheDocument();
    expect(screen.getByText('Total Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Open Opportunities')).toBeInTheDocument();
    expect(screen.getAllByText(/weighted pipeline/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Won Opportunities')).toBeInTheDocument();
  });

  it('toggles filter rows when Filters button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <OpportunitiesPage />
        </BrowserRouter>
      );
    });

    const filtersBtn = screen.getByRole('button', { name: /^filters$/i });
    expect(filtersBtn).toBeInTheDocument();

    // Date range filter is initially visible
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

  it('allows typing into the search input', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <OpportunitiesPage />
        </BrowserRouter>
      );
    });

    const searchInput = screen.getByPlaceholderText(/search by opportunity id/i) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Website Redesign' } });
    expect(searchInput.value).toBe('Website Redesign');
  });
});
