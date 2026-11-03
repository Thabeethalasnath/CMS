import { describe, it, expect, vi, beforeEach } from 'vitest';
import { opportunityService } from '@/services/opportunityService';
import { apiClient } from '@/services/api/apiClient';

describe('opportunityService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getOpportunities calls apiClient.get with proper query filters', async () => {
    const mockData = [{ id: 1, opportunityId: 'O-2025-001', opportunityName: 'Test' }];
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      message: 'OK',
      data: mockData as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const result = await opportunityService.getOpportunities({
      stage: 'New',
      status: 'Open',
      search: 'Test',
    });

    expect(getSpy).toHaveBeenCalledWith(
      '/opportunities',
      expect.objectContaining({
        stage: 'New',
        status: 'Open',
        search: 'Test',
      })
    );
    expect(result).toEqual(mockData);
  });

  it('getSummary returns summary metrics', async () => {
    const mockSummary = {
      totalOpportunities: 156,
      openOpportunities: 98,
      weightedPipeline: 1280000,
      weightedPipelineFormatted: '₹ 128',
      wonOpportunities: 28,
      totalTrend: '↑ 12%',
      openTrend: '↑ 8%',
      weightedTrend: '↑ 15%',
      wonTrend: '↑ 20%',
    };

    vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      message: 'OK',
      data: mockSummary,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const summary = await opportunityService.getSummary();
    expect(summary.totalOpportunities).toBe(156);
    expect(summary.weightedPipelineFormatted).toBe('₹ 128');
  });

  it('createOpportunity posts payload to /opportunities', async () => {
    const payload = {
      opportunityName: 'New Deal',
      clientId: 'C-001',
      ownerId: 'EMP-001',
      serviceId: 'S-001',
      stage: 'New',
      probability: 20,
      estimatedValue: 500000,
      status: 'Open',
    };

    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue({
      success: true,
      message: 'Created',
      data: { id: 10, ...payload } as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const result = await opportunityService.createOpportunity(payload);
    expect(postSpy).toHaveBeenCalledWith('/opportunities', payload);
    expect(result.id).toBe(10);
  });
});

