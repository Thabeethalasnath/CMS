import { describe, it, expect, vi, beforeEach } from 'vitest';
import { followUpService } from '@/services/followUpService';
import { apiClient } from '@/services/api/apiClient';

describe('followUpService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getItems sends priority and search params', async () => {
    const mockItems = [{ id: 1, moduleName: 'Invoices & Payments', priority: 'High' }];
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      success: true,
      message: 'OK',
      data: mockItems as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const items = await followUpService.getItems('High', 'invoice');
    expect(getSpy).toHaveBeenCalledWith('/follow-up-queue', {
      priority: 'High',
      search: 'invoice',
    });
    expect(items).toEqual(mockItems);
  });

  it('toggleDone toggles isDone state via PUT', async () => {
    const mockUpdated = { id: 1, moduleName: 'Invoices', isDone: true };
    const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValue({
      success: true,
      message: 'Updated',
      data: mockUpdated as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const res = await followUpService.toggleDone(1);
    expect(putSpy).toHaveBeenCalledWith('/follow-up-queue/1/toggle-done');
    expect(res.isDone).toBe(true);
  });

  it('performAction records action notes via POST', async () => {
    const mockUpdated = { id: 1, notes: 'Followed up via call' };
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue({
      success: true,
      message: 'Action recorded',
      data: mockUpdated as any,
      timestamp: '2026-10-27T10:00:00Z',
    });

    const res = await followUpService.performAction(1, { action: 'LOG_NOTE', notes: 'Followed up via call' });
    expect(postSpy).toHaveBeenCalledWith('/follow-up-queue/1/action', {
      action: 'LOG_NOTE',
      notes: 'Followed up via call',
    });
    expect(res.notes).toBe('Followed up via call');
  });
});

