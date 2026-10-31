import { describe, it, expect, vi, beforeEach } from 'vitest';
import { approvalsService } from '@/services/approvalsService';
import { apiClient } from '@/services/api/apiClient';

describe('approvalsService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('fetchApprovalsData loads from API without local caching', async () => {
    const mockApprovals = {
      employees: [{ id: 1, employee_name: 'Arun', status: 'Pending' }],
      clients: [{ id: 1, client_name: 'Acme', status: 'Pending' }],
      ticketsAssets: [],
      summary: { total: 2, pending: 2, approved: 0, rejected: 0 },
    };

    vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      message: 'OK',
      data: mockApprovals as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const result = await approvalsService.fetchApprovalsData();
    expect(result.employees.length).toBe(1);
    expect(result.clients.length).toBe(1);
    expect(result.summary.total).toBe(2);
    expect(localStorage.getItem('kalpanaaa_cms_employee_approvals')).toBeNull();
  });

  it('updateEmployeeStatus sends PUT request to backend endpoint', async () => {
    const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValue({
      success: true,
      message: 'Updated',
      data: { id: 1, status: 'Approved' } as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      message: 'OK',
      data: {
        employees: [{ id: 1, employee_name: 'Arun', status: 'Approved' }],
        clients: [],
        ticketsAssets: [],
        summary: { total: 1, pending: 0, approved: 1, rejected: 0 },
      } as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const res = await approvalsService.updateEmployeeStatus(1, 'Approved');
    expect(putSpy).toHaveBeenCalledWith('/approvals/employee/1/status', { status: 'Approved' });
    expect(res.employees.find((e) => e.id === 1)?.status).toBe('Approved');
  });
});

