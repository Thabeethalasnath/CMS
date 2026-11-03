import { apiClient } from './api/apiClient';
import { API_ENDPOINTS } from './api/apiEndpoints';

export interface PortalNotification {
  id: number;
  title: string;
  detail: string;
  type: 'APPROVAL' | 'INVOICE' | 'FOLLOW_UP' | 'PROPOSAL' | 'LEAD' | 'OPPORTUNITY' | 'CONTRACT' | 'DASHBOARD' | string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationSummaryResponse {
  unreadCount: number;
  notifications: PortalNotification[];
}

export const NOTIFICATION_REFRESH_EVENT = 'portal-notification-refresh';

/**
 * Triggers an immediate refresh of notifications across the entire portal.
 * Call this whenever any record or detail is created/updated/deleted.
 */
export function triggerNotificationRefresh(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_REFRESH_EVENT));
  }
}

export const notificationService = {
  async getNotifications(limit = 10): Promise<NotificationSummaryResponse> {
    const response = await apiClient.get<NotificationSummaryResponse>(
      `${API_ENDPOINTS.NOTIFICATIONS.BASE}?limit=${limit}`
    );
    return response.data;
  },

  async markAsRead(id: number): Promise<boolean> {
    const response = await apiClient.patch<boolean>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    );
    triggerNotificationRefresh();
    return response.data;
  },

  async markAllAsRead(): Promise<number> {
    const response = await apiClient.post<number>(
      API_ENDPOINTS.NOTIFICATIONS.READ_ALL
    );
    triggerNotificationRefresh();
    return response.data;
  },
};

