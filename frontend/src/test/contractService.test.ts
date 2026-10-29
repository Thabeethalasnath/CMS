import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contractService } from '@/services/contractService';
import { apiClient } from '@/services/api/apiClient';

describe('contractService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getContracts calls apiClient.get with proper query filters', async () => {
    const mockData = [{ id: 1, contractId: 'C-2025-001', clientId: 'C-001', contractType: 'Service Agreement' }];
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      message: 'OK',
      data: mockData as any,
      timestamp: '2026-10-28T10:00:00Z',
    });

    const result = await contractService.getContracts({
      clientId: 'C-001',
      contractType: 'Service Agreement',
      search: 'Service',
    });

    expect(getSpy).toHaveBeenCalledWith(
      '/contracts',
      expect.objectContaining({
        clientId: 'C-001',
        contractType: 'Service Agreement',
        search: 'Service',
      })
    );
    expect(result).toEqual(mockData);
  });

  it('getSummary returns contract metrics', async () => {
    const mockSummary = {
      totalContracts: 72,
      totalContractsTrend: '↑ 14%',
      activeContracts: 56,
      activeContractsTrend: '↑ 8%',
      expiringContracts: 8,
      expiringContractsTrend: '↓ 20%',
      totalContractValue: 123456,
      totalContractValueFormatted: '₹ 1,23,456',
      totalContractValueTrend: '↑ 22%',
    };

    vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      message: 'OK',
      data: mockSummary,
      timestamp: '2026-10-28T10:00:00Z',
    });

    const summary = await contractService.getSummary();
    expect(summary.totalContracts).toBe(72);
    expect(summary.totalContractValueFormatted).toBe('₹ 1,23,456');
  });

  it('createContract sends POST request with payload', async () => {
    const payload = {
      clientId: 'C-002',
      contractType: 'Support & Maintenance',
      startDate: '01 Mar 2025',
      endDate: '28 Feb 2026',
      contractValue: 600000,
    };
    const created = { id: 2, contractId: 'C-2025-002', ...payload };

    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue({
      success: true,
      message: 'Created',
      data: created as any,
      timestamp: '2026-10-28T10:00:00Z',
    });

    const res = await contractService.createContract(payload);
    expect(postSpy).toHaveBeenCalledWith('/contracts', payload);
    expect(res.contractId).toBe('C-2025-002');
  });

  it('deleteContract sends DELETE request', async () => {
    const deleteSpy = vi.spyOn(apiClient, 'delete').mockResolvedValue({
      success: true,
      message: 'Deleted',
      data: null,
      timestamp: '2026-10-28T10:00:00Z',
    });

    await contractService.deleteContract(1);
    expect(deleteSpy).toHaveBeenCalledWith('/contracts/1');
  });
});

