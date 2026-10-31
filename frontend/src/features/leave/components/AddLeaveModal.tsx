import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import { CreateLeavePayload } from '../types/leave';

interface AddLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeavePayload) => Promise<void>;
  employees: { id: string; name: string }[];
}

const QUICK_REASONS = [
  'Personal work',
  'Fever and rest',
  'Family function',
  'Medical checkup',
  'Out of station',
  'Vacation',
  'Emergency at home',
  'Dental procedure',
];

export const AddLeaveModal: React.FC<AddLeaveModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default employee when options arrive
  useEffect(() => {
    if (employees.length > 0 && !employeeId) {
      setEmployeeId(employees[0].id);
    }
  }, [employees, employeeId]);

  // Auto-calculate days when dates change
  const handleDateChange = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);

    if (from && to) {
      const d1 = new Date(from);
      const d2 = new Date(to);
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const diffTime = d2.getTime() - d1.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays > 0) {
          setDays(diffDays);
        }
      }
    }
  };

  const formatDateDisplay = (isoStr: string) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!employeeId) {
      setError('Please select an employee.');
      return;
    }
    if (!fromDate || !toDate) {
      setError('Please select both from and to dates.');
      return;
    }
    if (days < 1) {
      setError('Days must be at least 1.');
      return;
    }

    const selectedEmp = employees.find((emp) => emp.id === employeeId);
    const employeeName = selectedEmp ? selectedEmp.name : 'Unknown';

    // Format dates nicely as "dd MMM yyyy"
    const fromFormatted = formatDateDisplay(fromDate);
    const toFormatted = formatDateDisplay(toDate);

    try {
      setIsSubmitting(true);
      await onSubmit({
        employeeId,
        employeeName,
        leaveType,
        fromDate: fromFormatted,
        toDate: toFormatted,
        days: Number(days),
        reason: reason.trim() || 'Personal work',
        approvalStatus: 'Pending',
      });
      // Reset form
      setReason('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit leave request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Add Leave Request</h3>
              <p className="text-xs text-slate-500">Submit a new employee leave request</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Employee Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Employee *</label>
            <div className="relative">
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                aria-label="Select Employee"
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium cursor-pointer"
                required
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Leave Type *</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              aria-label="Select Leave Type"
              className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
              <option value="Comp Off">Comp Off</option>
            </select>
          </div>

          {/* Dates & Auto-Calculated Days */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">From Date *</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => handleDateChange(e.target.value, toDate)}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">To Date *</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => handleDateChange(fromDate, e.target.value)}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Days Count *</label>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">Reason</label>
              <span className="text-[11px] text-slate-400">Quick suggestions below</span>
            </div>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Personal work, medical treatment, family event..."
              className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {/* Quick Reason Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_REASONS.map((qr) => (
                <button
                  key={qr}
                  type="button"
                  onClick={() => setReason(qr)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                    reason === qr
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
