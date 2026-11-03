import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/apiEndpoints';
import { triggerNotificationRefresh } from '../../../services/notificationService';
import {
  CreateLeavePayload,
  LeaveMetrics,
  LeaveRecord,
  UpdateLeavePayload,
} from '../types/leave';

function mapLeaveRecord(item: any): LeaveRecord {
  return {
    id: item.id,
    employeeId: item.employeeId || item.employee_id || '',
    employeeName: item.employeeName || item.employee_name || '',
    leaveType: item.leaveType || item.leave_type || '',
    fromDate: item.fromDate || item.from_date || '',
    toDate: item.toDate || item.to_date || '',
    days: Number(item.days || item.calculatedDays || item.calculated_days || 1),
    reason: item.reason || '',
    approvalStatus: item.approvalStatus || item.approval_status || 'Pending',
    approvedBy: item.approvedBy || item.approved_by || null,
    calculatedDays: Number(item.calculatedDays || item.calculated_days || item.days || 1),
    leaveStatus: item.leaveStatus || item.leave_status || item.approvalStatus || 'Pending',
    appliedDate: item.appliedDate || item.applied_date,
    createdAt: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
  };
}

export const leaveService = {
  async getLeaves(): Promise<LeaveRecord[]> {
    const res = await apiClient.get<LeaveRecord[]>(API_ENDPOINTS.LEAVES.BASE);
    const data = res.data || [];
    return data.map(mapLeaveRecord);
  },

  async getMetrics(): Promise<LeaveMetrics> {
    const res = await apiClient.get<LeaveMetrics>(API_ENDPOINTS.LEAVES.METRICS);
    return res.data;
  },

  async getLeaveById(id: string): Promise<LeaveRecord> {
    const res = await apiClient.get<LeaveRecord>(API_ENDPOINTS.LEAVES.BY_ID(id));
    return mapLeaveRecord(res.data);
  },

  async createLeave(payload: CreateLeavePayload): Promise<LeaveRecord> {
    const res = await apiClient.post<LeaveRecord>(API_ENDPOINTS.LEAVES.BASE, payload);
    triggerNotificationRefresh();
    return mapLeaveRecord(res.data);
  },

  async updateLeave(id: string, payload: UpdateLeavePayload): Promise<LeaveRecord> {
    const res = await apiClient.put<LeaveRecord>(API_ENDPOINTS.LEAVES.BY_ID(id), payload);
    triggerNotificationRefresh();
    return mapLeaveRecord(res.data);
  },

  async deleteLeave(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LEAVES.BY_ID(id));
    triggerNotificationRefresh();
  },
};

