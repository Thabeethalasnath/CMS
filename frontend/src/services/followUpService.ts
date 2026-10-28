import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/apiEndpoints';
import {
  FollowUpItemData,
  FollowUpSummaryData,
  ActionPayload,
} from '@/types/followUp';

export const followUpService = {
  getItems: async (priority?: string, search?: string): Promise<FollowUpItemData[]> => {
    const res = await apiClient.get<FollowUpItemData[]>(
      API_ENDPOINTS.FOLLOW_UP_QUEUE.BASE,
      {
        priority: priority && priority !== 'all' ? priority : undefined,
        search: search ? search.trim() : undefined,
      }
    );
    return res.data;
  },

  getSummary: async (): Promise<FollowUpSummaryData> => {
    const res = await apiClient.get<FollowUpSummaryData>(
      API_ENDPOINTS.FOLLOW_UP_QUEUE.SUMMARY
    );
    return res.data;
  },

  getItemById: async (id: string | number): Promise<FollowUpItemData> => {
    const res = await apiClient.get<FollowUpItemData>(
      API_ENDPOINTS.FOLLOW_UP_QUEUE.BY_ID(id)
    );
    return res.data;
  },

  toggleDone: async (id: string | number): Promise<FollowUpItemData> => {
    const res = await apiClient.put<FollowUpItemData>(
      API_ENDPOINTS.FOLLOW_UP_QUEUE.TOGGLE_DONE(id)
    );
    return res.data;
  },

  performAction: async (
    id: string | number,
    payload: ActionPayload
  ): Promise<FollowUpItemData> => {
    const res = await apiClient.post<FollowUpItemData>(
      API_ENDPOINTS.FOLLOW_UP_QUEUE.ACTION(id),
      payload
    );
    return res.data;
  },

  createItem: async (
    data: Partial<FollowUpItemData>
  ): Promise<FollowUpItemData> => {
    const res = await apiClient.post<FollowUpItemData>(
      API_ENDPOINTS.FOLLOW_UP_QUEUE.BASE,
      data
    );
    return res.data;
  },

  updateItem: async (
    id: string | number,
    data: Partial<FollowUpItemData>
  ): Promise<FollowUpItemData> => {
    const res = await apiClient.put<FollowUpItemData>(
      API_ENDPOINTS.FOLLOW_UP_QUEUE.BY_ID(id),
      data
    );
    return res.data;
  },

  deleteItem: async (id: string | number): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.FOLLOW_UP_QUEUE.BY_ID(id));
  },

  resetData: async (): Promise<string> => {
    const res = await apiClient.post<string>(API_ENDPOINTS.FOLLOW_UP_QUEUE.RESET);
    return res.data;
  },
};
