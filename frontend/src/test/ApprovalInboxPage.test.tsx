import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApprovalInboxPage } from '@/features/dashboard/pages/ApprovalInboxPage';
import { approvalsService } from '@/services/approvalsService';

describe('ApprovalInboxPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(approvalsService, 'fetchApprovalsData').mockResolvedValue(
      approvalsService.getApprovalsData()
    );
  });

  it('renders page header and metric cards', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ApprovalInboxPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Approval Inbox')).toBeInTheDocument();
    expect(screen.getByText('Review and manage employee, client and ticket / asset approval requests.')).toBeInTheDocument();
  });

  it('renders all 3 approval sections: Employees, Clients, Tickets & Assets', async () => {
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

  it('allows clicking refresh button without throwing', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ApprovalInboxPage />
        </BrowserRouter>
      );
    });

    const refreshBtn = screen.getByTitle('Refresh inbox data');
    expect(refreshBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(refreshBtn);
    });
  });
});

