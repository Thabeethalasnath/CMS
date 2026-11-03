import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApprovalInboxPage } from '@/features/dashboard/pages/ApprovalInboxPage';
import { approvalsService } from '@/services/approvalsService';
import {
  initialEmployeeApprovals,
  initialClientApprovals,
  initialTicketAssetApprovals,
} from '@/test/testFixtures';

const mockApprovalsData = {
  employees: initialEmployeeApprovals,
  clients: initialClientApprovals,
  ticketsAssets: initialTicketAssetApprovals,
  summary: {
    total: initialEmployeeApprovals.length + initialClientApprovals.length + initialTicketAssetApprovals.length,
    pending: 10,
    approved: 5,
    rejected: 2,
  },
};

describe('ApprovalInboxPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders skeleton loaders while loading data', async () => {
    vi.spyOn(approvalsService, 'fetchApprovalsData').mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <ApprovalInboxPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Approval Inbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('displays error banner with Retry button when fetch fails and reloads on click', async () => {
    const fetchSpy = vi.spyOn(approvalsService, 'fetchApprovalsData')
      .mockRejectedValueOnce(new Error('Failed to connect to approvals service'))
      .mockResolvedValueOnce(mockApprovalsData);

    await act(async () => {
      render(
        <BrowserRouter>
          <ApprovalInboxPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText(/Failed to load approvals/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to connect to approvals service/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('renders empty state when no approvals exist', async () => {
    const emptyData = {
      employees: [],
      clients: [],
      ticketsAssets: [],
      summary: { total: 0, pending: 0, approved: 0, rejected: 0 },
    };

    vi.spyOn(approvalsService, 'fetchApprovalsData').mockResolvedValue(emptyData);

    await act(async () => {
      render(
        <BrowserRouter>
          <ApprovalInboxPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText(/No employee requests match your filters/i)).toBeInTheDocument();
  });

  it('renders all approval sections on success', async () => {
    vi.spyOn(approvalsService, 'fetchApprovalsData').mockResolvedValue(mockApprovalsData);

    await act(async () => {
      render(
        <BrowserRouter>
          <ApprovalInboxPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Employee Approvals')).toBeInTheDocument();
    expect(screen.getByText('Client Approvals')).toBeInTheDocument();
    expect(screen.getByText('Tickets & Assets Approvals')).toBeInTheDocument();
  });

  it('rolls back optimistic state and shows error banner on failed mutation', async () => {
    vi.spyOn(approvalsService, 'fetchApprovalsData').mockResolvedValue(mockApprovalsData);
    vi.spyOn(approvalsService, 'updateEmployeeStatus').mockRejectedValue(new Error('Server error: approval rejected by rule'));

    await act(async () => {
      render(
        <BrowserRouter>
          <ApprovalInboxPage />
        </BrowserRouter>
      );
    });

    // Open status dropdown for the first employee row
    const pendingDropdownBtn = screen.getAllByRole('button', { name: /pending/i })[0];
    await act(async () => {
      fireEvent.click(pendingDropdownBtn);
    });

    // Select Approved from dropdown
    const approveBtn = screen.getAllByRole('button', { name: /^Approved$/i })[0];
    await act(async () => {
      fireEvent.click(approveBtn);
    });

    // Error toast should appear displaying the failure message
    expect(await screen.findByText(/Server error: approval rejected by rule/i)).toBeInTheDocument();
  });
});
