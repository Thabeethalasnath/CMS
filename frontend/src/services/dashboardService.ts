import { FullDashboardData } from '../types/dashboard';
import { initialDashboardData } from '../constants/initialDashboardData';

const STORAGE_KEY = 'kalpanaaa_cms_dashboard_data';
const BACKEND_API_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const dashboardService = {
  // Fetch dashboard data
  async getDashboardData(): Promise<FullDashboardData> {
    try {
      // 1. Try fetching from Backend / Supabase API
      const response = await fetch(`${BACKEND_API_URL}/dashboard/ceo`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to local storage:', err);
    }

    // 2. Check Local Storage
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // parsing error
      }
    }

    // 3. Fallback to Initial Database Seed
    return initialDashboardData;
  },

  // Save/Update full dashboard data
  async saveDashboardData(data: FullDashboardData): Promise<void> {
    // Optimistically update local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    try {
      // Send to Backend / Supabase API
      await fetch(`${BACKEND_API_URL}/dashboard/ceo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn('API server not responding, data saved locally:', err);
    }
  },

  // Update specific alert count
  async updateAlertCount(alertId: number, delta: number): Promise<FullDashboardData> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/dashboard/ceo/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });

      if (response.ok) {
        const updated = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
    } catch (err) {
      console.warn('API alert update failed, updating locally:', err);
    }

    const current = await this.getDashboardData();
    const updatedAlerts = current.alerts.map((a) => {
      if (a.id === alertId) {
        return { ...a, alert_count: Math.max(0, a.alert_count + delta) };
      }
      return a;
    });

    const updatedData: FullDashboardData = {
      ...current,
      alerts: updatedAlerts
    };

    await this.saveDashboardData(updatedData);
    return updatedData;
  }
};
