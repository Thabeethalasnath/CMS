import { AttendanceRecord, AttendanceMetrics } from '../types/attendance';

const PRIMARY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const FALLBACK_URL = '/api/v1';

async function requestWithFallback(endpoint: string, options?: RequestInit): Promise<Response> {
  try {
    const res = await fetch(`${PRIMARY_URL}${endpoint}`, options);
    if (res.ok) return res;
    console.warn(`[AttendanceService] ${PRIMARY_URL}${endpoint} returned ${res.status}, falling back to ${FALLBACK_URL}${endpoint}`);
  } catch (err) {
    console.warn(`[AttendanceService] ${PRIMARY_URL}${endpoint} failed, falling back to ${FALLBACK_URL}${endpoint}:`, err);
  }

  return fetch(`${FALLBACK_URL}${endpoint}`, options);
}

function mapAttendance(item: any): AttendanceRecord {
  return {
    id: item.id,
    attendanceDate: item.attendanceDate || item.attendance_date || '31 Oct 2026',
    employeeId: item.employeeId || item.employee_id || 'EMP-001',
    employeeName: item.employeeName || item.employee_name || 'Amit Sharma',
    avatarInitials: item.avatarInitials || item.avatar_initials || 'AS',
    avatarColor: item.avatarColor || item.avatar_color || 'blue',
    status: item.status || 'Present',
    checkIn: item.checkIn || item.check_in || '-',
    checkOut: item.checkOut || item.check_out || '-',
    workHours: item.workHours || item.work_hours || '0h 0m',
    overtimeHours: item.overtimeHours || item.overtime_hours || '0h 0m',
    workMinutes: item.workMinutes !== undefined ? item.workMinutes : item.work_minutes,
    overtimeMinutes: item.overtimeMinutes !== undefined ? item.overtimeMinutes : item.overtime_minutes,
    dayType: item.dayType || item.day_type || 'Working Day',
    isLate: Boolean(item.isLate ?? item.is_late),
    hasOvertime: Boolean(item.hasOvertime ?? item.has_overtime),
    notes: item.notes || '',
    paidDayEquivalent: item.paidDayEquivalent || item.paid_day_equivalent || (item.status === 'Half Day' ? '0.5' : (item.status === 'Leave' || item.status === 'Absent' || item.status === 'Holiday' ? '0.0' : '1.0')),
    lateFlag: item.lateFlag || item.late_flag || (Boolean(item.isLate ?? item.is_late) ? 'Yes' : 'No'),
    overtimeValue: item.overtimeValue || item.overtime_value || (item.overtimeMinutes ? `₹ ${Math.round(item.overtimeMinutes * 12.5).toLocaleString('en-IN')}` : '₹ 0'),
    remarks: item.remarks !== undefined ? item.remarks : (item.notes || '-'),
    createdAt: item.createdAt || item.created_at,
    updatedAt: item.updatedAt || item.updated_at,
  };
}

export const attendanceService = {
  async getAttendance(): Promise<AttendanceRecord[]> {
    const res = await requestWithFallback('/attendance');
    if (!res.ok) {
      throw new Error(`Failed to fetch attendance: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid attendance data format received');
    }
    return data.map(mapAttendance);
  },

  async getAttendanceById(id: string): Promise<AttendanceRecord> {
    const res = await requestWithFallback(`/attendance/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch record ${id}: HTTP ${res.status}`);
    }
    const data = await res.json();
    return mapAttendance(data);
  },

  async createAttendance(record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const res = await requestWithFallback('/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) {
      throw new Error(`Failed to create attendance: HTTP ${res.status}`);
    }
    const data = await res.json();
    return mapAttendance(data);
  },

  async updateAttendance(id: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const res = await requestWithFallback(`/attendance/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error(`Failed to update attendance ${id}: HTTP ${res.status}`);
    }
    const data = await res.json();
    return mapAttendance(data);
  },

  async deleteAttendance(id: string): Promise<void> {
    const res = await requestWithFallback(`/attendance/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok && res.status !== 204 && res.status !== 404) {
      throw new Error(`Failed to delete attendance ${id}: HTTP ${res.status}`);
    }
  },

  getMetrics(records: AttendanceRecord[]): AttendanceMetrics {
    const totalRecords = records.length;
    const presentRecords = records.filter(
      (r) => String(r.status).toLowerCase() === 'present'
    ).length;
    const lateRecords = records.filter((r) => r.isLate).length;

    let totalOtMinutes = 0;
    records.forEach((r) => {
      if (r.overtimeMinutes) {
        totalOtMinutes += r.overtimeMinutes;
      } else if (r.overtimeHours && r.overtimeHours !== '-') {
        const match = r.overtimeHours.match(/(\d+)h\s*(\d+)m/);
        if (match) {
          totalOtMinutes += parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
        }
      }
    });

    const totalOvertimeHours = (totalOtMinutes / 60).toFixed(1);

    return {
      totalRecords,
      totalRecordsTrend: '↑ 12% vs last month',
      presentRecords,
      presentRecordsTrend: '↑ 8% vs last month',
      lateRecords,
      lateRecordsTrend: '↓ 18% vs last month',
      totalOvertimeHours,
      totalOvertimeHoursTrend: '↑ 25% vs last month',
    };
  },
};
