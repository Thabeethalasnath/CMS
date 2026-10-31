import { apiRequest } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/apiEndpoints';
import {
  EmployeeExitRecord,
  ExitFilters,
  ExitSortOption,
  ExitKpiSummary,
  PageResponse,
} from '../types';

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/**
 * Parses dates formatted as "25 Oct 2026", "05 Nov 2026" or standard ISO strings into a Date object.
 */
export const parseExitDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr === '-') return null;
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthKey = parts[1].toLowerCase().slice(0, 3);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthKey in MONTH_MAP && !isNaN(year)) {
      return new Date(year, MONTH_MAP[monthKey], day);
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export interface FetchExitRecordsParams {
  search?: string;
  exitStatus?: string;
  exitType?: string;
  noticePeriod?: string;
  approvalStatus?: string;
  dateRange?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export const employeeExitService = {
  /**
   * Fetches paginated, filtered, and sorted Employee Exit records from Spring Boot backend.
   */
  async getExitRecords(params?: FetchExitRecordsParams): Promise<PageResponse<EmployeeExitRecord>> {
    const query = new URLSearchParams();
    if (params?.search && params.search.trim()) query.set('search', params.search.trim());
    if (params?.exitStatus && params.exitStatus !== 'All') query.set('exitStatus', params.exitStatus);
    if (params?.exitType && params.exitType !== 'All') query.set('exitType', params.exitType);
    if (params?.noticePeriod && params.noticePeriod !== 'All') query.set('noticePeriod', params.noticePeriod);
    if (params?.approvalStatus && params.approvalStatus !== 'All') query.set('approvalStatus', params.approvalStatus);
    if (params?.dateRange && params.dateRange !== 'All Time') query.set('dateRange', params.dateRange);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.page !== undefined) query.set('page', params.page.toString());
    if (params?.size !== undefined) query.set('size', params.size.toString());

    const qs = query.toString();
    const url = `${API_ENDPOINTS.HR.EMPLOYEE_EXITS}${qs ? '?' + qs : ''}`;
    return await apiRequest<PageResponse<EmployeeExitRecord>>(url);
  },

  /**
   * Fetches all matching filtered records from backend for complete CSV export.
   */
  async getAllFilteredExitRecords(
    filters: ExitFilters,
    sortOption: ExitSortOption
  ): Promise<EmployeeExitRecord[]> {
    const query = new URLSearchParams();
    if (filters.search && filters.search.trim()) query.set('search', filters.search.trim());
    if (filters.exitStatus && filters.exitStatus !== 'All') query.set('exitStatus', filters.exitStatus);
    if (filters.exitType && filters.exitType !== 'All') query.set('exitType', filters.exitType);
    if (filters.noticePeriod && filters.noticePeriod !== 'All') query.set('noticePeriod', filters.noticePeriod);
    if (filters.approvalStatus && filters.approvalStatus !== 'All') query.set('approvalStatus', filters.approvalStatus);
    if (filters.dateRange && filters.dateRange !== 'All Time') query.set('dateRange', filters.dateRange);
    if (sortOption) query.set('sort', sortOption);

    const qs = query.toString();
    const url = `${API_ENDPOINTS.HR.EMPLOYEE_EXIT_EXPORT}${qs ? '?' + qs : ''}`;
    return await apiRequest<EmployeeExitRecord[]>(url);
  },

  /**
   * Fetches a single Employee Exit record by Exit ID.
   */
  async getExitRecordById(exitId: string): Promise<EmployeeExitRecord> {
    return await apiRequest<EmployeeExitRecord>(API_ENDPOINTS.HR.EMPLOYEE_EXIT_BY_ID(exitId));
  },

  /**
   * Creates a new Employee Exit record in Spring Boot & Supabase.
   */
  async createExitRecord(payload: Partial<EmployeeExitRecord>): Promise<EmployeeExitRecord> {
    const body: Record<string, any> = {
      ...payload,
      exitId: payload.id || (payload as any).exitId,
    };
    return await apiRequest<EmployeeExitRecord>(API_ENDPOINTS.HR.EMPLOYEE_EXITS, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Updates an existing Employee Exit record.
   */
  async updateExitRecord(
    exitId: string,
    payload: Partial<EmployeeExitRecord>
  ): Promise<EmployeeExitRecord> {
    return await apiRequest<EmployeeExitRecord>(API_ENDPOINTS.HR.EMPLOYEE_EXIT_BY_ID(exitId), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Deletes an Employee Exit record.
   */
  async deleteExitRecord(exitId: string): Promise<void> {
    await apiRequest<void>(API_ENDPOINTS.HR.EMPLOYEE_EXIT_BY_ID(exitId), {
      method: 'DELETE',
    });
  },

  /**
   * Fetches dynamic KPI metrics from backend.
   */
  async getKpis(): Promise<ExitKpiSummary> {
    const data = await apiRequest<any>(API_ENDPOINTS.HR.EMPLOYEE_EXIT_KPIS);
    return {
      totalExitRequests: data.totalExitRequests ?? 0,
      totalExitRequestsTrend: data.totalExitRequestsTrend ?? 12,
      approvedExits: data.approvedExits ?? 0,
      approvedExitsTrend: data.approvedExitsTrend ?? 33,
      pendingApprovals: data.pendingApprovals ?? 0,
      pendingApprovalsTrend: data.pendingApprovalsTrend ?? -9,
      completedExits: data.completedExits ?? 0,
      completedExitsTrend: data.completedExitsTrend ?? 67,
    };
  },

  /**
   * Fetches suggested next unique Exit ID and Employee ID.
   */
  async getNextExitId(): Promise<{ nextExitId: string; suggestedEmployeeId?: string }> {
    return await apiRequest<{ nextExitId: string; suggestedEmployeeId?: string }>(
      API_ENDPOINTS.HR.EMPLOYEE_EXIT_NEXT_ID
    );
  },

  /**
   * Generates next suggested Employee ID from current list as fallback.
   */
  getNextEmployeeId(records: EmployeeExitRecord[]): string {
    let maxNum = 0;
    records.forEach((r) => {
      const match = r.employeeId.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `EMP-${String(maxNum + 1).padStart(3, '0')}`;
  },

  /**
   * Exports an array of Employee Exit records to a CSV file.
   */
  exportToCsv(records: EmployeeExitRecord[]): void {
    if (records.length === 0) return;

    const headers = [
      'Exit ID',
      'Employee ID',
      'Employee Name',
      'Resignation Date',
      'Approval Date',
      'Notice Period Days',
      'Last Working Day',
      'Exit Type',
      'Reason',
      'Exit Status',
      'Assets Returned',
      'Full & Final Status',
      'Notes',
      'Notice Completion Date',
      'Exit Readiness',
    ];

    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.employeeId}"`,
      `"${r.employeeName}"`,
      `"${r.resignationDate}"`,
      `"${r.approvalDate}"`,
      r.noticePeriodDays,
      `"${r.lastWorkingDay}"`,
      `"${r.exitType}"`,
      `"${(r.reason || '').replace(/"/g, '""')}"`,
      `"${r.exitStatus}"`,
      `"${r.assetsReturned}"`,
      `"${r.fullAndFinalStatus}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${r.noticeCompletionDate}"`,
      `"${r.exitReadiness}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `employee_exit_records_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Exports a detailed text summary of a single Employee Exit record.
   */
  exportSingleRecord(record: EmployeeExitRecord): void {
    const lines = [
      '==================================================',
      `EMPLOYEE EXIT CASE SUMMARY: ${record.id}`,
      '==================================================',
      `Employee ID:            ${record.employeeId}`,
      `Employee Name:          ${record.employeeName}`,
      `Resignation Date:       ${record.resignationDate}`,
      `Approval Date:          ${record.approvalDate}`,
      `Notice Period (Days):   ${record.noticePeriodDays}`,
      `Last Working Day:       ${record.lastWorkingDay}`,
      `Exit Type:              ${record.exitType}`,
      `Reason for Exit:        ${record.reason}`,
      `Exit Status:            ${record.exitStatus}`,
      `Assets Returned:        ${record.assetsReturned}`,
      `Full & Final Status:    ${record.fullAndFinalStatus}`,
      `Notes:                  ${record.notes}`,
      `Notice Completion Date: ${record.noticeCompletionDate}`,
      `Exit Readiness:         ${record.exitReadiness}`,
      '==================================================',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.id}_${record.employeeId}_details.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
