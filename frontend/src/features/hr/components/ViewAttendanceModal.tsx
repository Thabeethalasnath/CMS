import React, { useState, useEffect } from 'react';
import { X, Clock, Search, RotateCw, AlertCircle } from 'lucide-react';
import { AttendanceRecord, Department, EmployeeRecord } from '../types';
import { DEPARTMENTS } from '../mockData';
import { hrApiService } from '../services/hrApiService';

interface ViewAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: AttendanceRecord[];
  employees?: EmployeeRecord[];
  onAddAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<boolean | void> | void;
}

export const ViewAttendanceModal: React.FC<ViewAttendanceModalProps> = ({
  isOpen,
  onClose,
  attendance,
  employees: initialEmployees = [],
  onAddAttendance,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Enrolled employees list for check-in dropdown
  const [availableEmployees, setAvailableEmployees] = useState<EmployeeRecord[]>(initialEmployees);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Manual Check-in Form States
  const [showQuickCheckIn, setShowQuickCheckIn] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [empStatus, setEmpStatus] = useState<'Present' | 'Half Day' | 'Late'>('Present');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize or load employees when modal opens or drawer opens
  useEffect(() => {
    if (initialEmployees && initialEmployees.length > 0) {
      setAvailableEmployees(initialEmployees);
      if (!selectedEmpId && initialEmployees[0]) {
        setSelectedEmpId(initialEmployees[0].id);
      }
    } else if (isOpen) {
      setIsLoadingEmployees(true);
      hrApiService
        .getEmployees({ size: 100 })
        .then((res) => {
          const list = res.content || [];
          setAvailableEmployees(list);
          if (list.length > 0) {
            setSelectedEmpId(list[0].id);
          }
        })
        .catch((err) => {
          console.warn('Failed to load employees for attendance modal:', err);
        })
        .finally(() => {
          setIsLoadingEmployees(false);
        });
    }
  }, [isOpen, initialEmployees]);

  // Keep selectedEmpId valid when availableEmployees changes
  useEffect(() => {
    if (availableEmployees.length > 0 && !availableEmployees.some((e) => e.id === selectedEmpId)) {
      setSelectedEmpId(availableEmployees[0].id);
    }
  }, [availableEmployees, selectedEmpId]);

  if (!isOpen) return null;

  const filtered = attendance.filter((a) => {
    const matchesSearch = (a.employeeName || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' ? true : a.department === selectedDept;
    const matchesStatus = statusFilter === 'All' ? true : a.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const halfDayCount = attendance.filter((a) => a.status === 'Half Day').length;
  const lateCount = attendance.filter((a) => a.status === 'Late').length;

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const selectedEmp = availableEmployees.find((emp) => emp.id === selectedEmpId);
    if (!selectedEmp) return;

    try {
      setIsSubmitting(true);
      const success = await onAddAttendance({
        employeeId: selectedEmp.id,
        employeeName: selectedEmp.name,
        department: selectedEmp.department,
        date: attendanceDate,
        checkIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: empStatus,
      });

      // If backend accepted the check-in, close the quick drawer
      if (success !== false) {
        setShowQuickCheckIn(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-[#E2E8F0] z-10 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-base font-bold text-slate-900 leading-tight m-0">Attendance Overview & Records</h3>
              <p className="text-xs text-slate-500 font-normal leading-normal m-0 mt-1">
                Daily biometric check-ins, punctuality records, and half-day logs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => !isSubmitting && onClose()}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-40 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary Metric Chips */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Logs</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">{attendance.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Present</span>
            <span className="text-lg font-bold text-emerald-800 mt-0.5 block">{presentCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Half Days</span>
            <span className="text-lg font-bold text-amber-800 mt-0.5 block">{halfDayCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-red-50 border border-red-200/80">
            <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider block">Late Records</span>
            <span className="text-lg font-bold text-red-800 mt-0.5 block">{lateCount}</span>
          </div>
        </div>

        {/* Filter & Action Toolbar */}
        <div className="px-6 py-3 bg-slate-50/60 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as Department)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowQuickCheckIn(!showQuickCheckIn)}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {showQuickCheckIn ? 'Cancel Check-in' : '+ Log Attendance'}
          </button>
        </div>

        {/* Quick Check-in Inline Drawer Form */}
        {showQuickCheckIn && (
          <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 animate-fade-in">
            {isLoadingEmployees ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                <RotateCw size={14} className="animate-spin" />
                <span>Loading active employees...</span>
              </div>
            ) : availableEmployees.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                <AlertCircle size={15} className="shrink-0" />
                <span>No active employees available to log attendance. Please enroll an employee first.</span>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="flex flex-wrap items-center gap-3">
                {/* Employee Selector */}
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
                    required
                  >
                    {availableEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.id} · {emp.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Explicit Business Date Selector */}
                <div>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Status Selector */}
                <div>
                  <select
                    value={empStatus}
                    onChange={(e) => setEmpStatus(e.target.value as any)}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Late">Late</option>
                  </select>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw size={13} className="animate-spin" />
                      <span>Recording...</span>
                    </>
                  ) : (
                    <span>Record Check-in</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Attendance Records Table */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="pb-2.5">Employee</th>
                <th className="pb-2.5">Department</th>
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Check-In Time</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No attendance records found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((att) => (
                  <tr key={att.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-2.5 font-semibold text-slate-800">
                      <span>{att.employeeName}</span>
                      <span className="block text-[11px] text-slate-400">{att.employeeId}</span>
                    </td>
                    <td className="py-2.5 text-slate-500">{att.department}</td>
                    <td className="py-2.5 text-slate-500">{att.date || att.attendanceDate || '—'}</td>
                    <td className="py-2.5 text-slate-500">{att.checkIn || '09:15 AM'}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          att.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : att.status === 'Half Day'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 px-6 py-4 bg-slate-50/90 border-t border-[#E2E8F0] flex items-center justify-end shrink-0 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
