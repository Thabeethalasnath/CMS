import React, { useState } from 'react';
import { X, Plus, Calendar, User, Tag, FileText } from 'lucide-react';
import { EmployeeApproval } from '../../types/approvals';

interface AddEmployeeApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<EmployeeApproval, 'id' | 'applied_date' | 'status'>) => void;
}

export const AddEmployeeApprovalModal: React.FC<AddEmployeeApprovalModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [requestType, setRequestType] = useState('Sick Leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [duration, setDuration] = useState('1 day');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim() || !employeeCode.trim() || !reason.trim()) {
      alert('Please fill in employee name, ID, and reason.');
      return;
    }

    onSubmit({
      employee_name: employeeName.trim(),
      employee_code: employeeCode.trim(),
      request_type: requestType,
      from_date: fromDate || '18 Mar 2025',
      to_date: toDate || '19 Mar 2025',
      duration: duration || '2 days',
      reason: reason.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 z-10 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Plus size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Add Employee Approval Request</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Employee Name</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 focus-within:border-indigo-500 focus-within:bg-white">
              <User size={14} className="text-slate-400" />
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="e.g. Deepak Sharma"
                className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Employee ID / Code</label>
            <input
              type="text"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="e.g. EMP-0089"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 outline-none text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Request Type</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 focus-within:border-indigo-500 focus-within:bg-white">
              <Tag size={14} className="text-slate-400" />
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800"
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Casual Leave">Casual Leave</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">From Date</label>
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="e.g. 18 Mar 2025"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 outline-none text-slate-800 placeholder-slate-400 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">To Date</label>
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="e.g. 20 Mar 2025"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 outline-none text-slate-800 placeholder-slate-400 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3 days"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 outline-none text-slate-800 placeholder-slate-400 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Reason</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for leave / WFH request..."
              className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50/50 outline-none text-slate-800 placeholder-slate-400 focus:border-indigo-500 resize-none"
              required
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
