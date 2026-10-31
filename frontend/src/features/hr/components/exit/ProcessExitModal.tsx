import React, { useState, useEffect } from 'react';
import { X, LogOut, CheckCircle2, ChevronDown } from 'lucide-react';
import {
  EmployeeExitRecord,
  EmployeeRecord,
  ExitType,
  ExitStatus,
  AssetsReturnedStatus,
  FullAndFinalStatus,
  ExitReadiness,
} from '../../types';
import { parseExitDate } from '../../services/employeeExitService';
import { hrApiService } from '../../services/hrApiService';

interface ProcessExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: EmployeeExitRecord) => void;
  editRecord?: EmployeeExitRecord | null;
  existingCount?: number;
  nextExitId?: string;
}

export const ProcessExitModal: React.FC<ProcessExitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editRecord,
  existingCount = 18,
  nextExitId,
}) => {
  const isEditing = !!editRecord;

  // Master employees list for lookup
  const [employeesList, setEmployeesList] = useState<EmployeeRecord[]>([]);

  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [resignationDate, setResignationDate] = useState(() =>
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [approvalDate, setApprovalDate] = useState(() =>
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [noticePeriodDays, setNoticePeriodDays] = useState(30);
  const [lastWorkingDay, setLastWorkingDay] = useState('');
  const [exitType, setExitType] = useState<ExitType>('Resignation');
  const [reason, setReason] = useState('Personal reasons');
  const [exitStatus, setExitStatus] = useState<ExitStatus>('Pending');
  const [assetsReturned, setAssetsReturned] = useState<AssetsReturnedStatus>('Pending');
  const [fullAndFinalStatus, setFullAndFinalStatus] = useState<FullAndFinalStatus>('Pending');
  const [notes, setNotes] = useState('-');
  const [noticeCompletionDate, setNoticeCompletionDate] = useState('');
  const [exitReadiness, setExitReadiness] = useState<ExitReadiness>('Not Started');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch employee master records for reference
  useEffect(() => {
    if (isOpen) {
      hrApiService
        .getEmployees({ size: 250 })
        .then((res) => {
          if (res && res.content) {
            setEmployeesList(res.content);
          }
        })
        .catch((err) => {
          console.warn('Could not load employees master list:', err);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editRecord) {
      // Editing an existing exit record: strictly preserve its historical Employee ID & details
      setEmployeeId(editRecord.employeeId);
      setEmployeeName(editRecord.employeeName);
      setResignationDate(editRecord.resignationDate);
      setApprovalDate(editRecord.approvalDate);
      setNoticePeriodDays(editRecord.noticePeriodDays);
      setLastWorkingDay(editRecord.lastWorkingDay);
      setExitType(editRecord.exitType);
      setReason(editRecord.reason);
      setExitStatus(editRecord.exitStatus);
      setAssetsReturned(editRecord.assetsReturned);
      setFullAndFinalStatus(editRecord.fullAndFinalStatus);
      setNotes(editRecord.notes);
      setNoticeCompletionDate(editRecord.noticeCompletionDate);
      setExitReadiness(editRecord.exitReadiness);
    } else {
      // New Exit: Do NOT invent or overwrite Employee ID based on exit counter
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      const computedLwd = nextMonth.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      setEmployeeId('');
      setEmployeeName('');
      setResignationDate(
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      );
      setApprovalDate(
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      );
      setNoticePeriodDays(30);
      setLastWorkingDay(computedLwd);
      setNoticeCompletionDate(computedLwd);
      setExitType('Resignation');
      setReason('Personal reasons');
      setExitStatus('Pending');
      setAssetsReturned('Pending');
      setFullAndFinalStatus('Pending');
      setNotes('-');
      setExitReadiness('Not Started');
    }
    setErrors({});
  }, [editRecord, isOpen, existingCount]);

  if (!isOpen) return null;

  const handleNoticePeriodChange = (val: number) => {
    setNoticePeriodDays(val);
    const parsed = parseExitDate(resignationDate) || new Date();
    const lwd = new Date(parsed.getTime() + val * 24 * 60 * 60 * 1000);
    const formatted = lwd.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setLastWorkingDay(formatted);
    setNoticeCompletionDate(formatted);
  };

  const handleEmployeeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmployeeName(val);
    if (!isEditing) {
      const matched = employeesList.find(
        (emp) => emp.name.toLowerCase() === val.trim().toLowerCase()
      );
      if (matched) {
        setEmployeeId(matched.id);
      }
    }
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmployeeId(val);
    if (!isEditing) {
      const matched = employeesList.find(
        (emp) => emp.id.toLowerCase() === val.trim().toLowerCase()
      );
      if (matched) {
        setEmployeeName(matched.name);
      }
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!employeeName.trim()) errs.employeeName = 'Employee Name is required';
    if (!employeeId.trim()) errs.employeeId = 'Employee ID is required';
    if (!resignationDate.trim()) errs.resignationDate = 'Resignation date is required';
    if (!lastWorkingDay.trim()) errs.lastWorkingDay = 'Last working day is required';
    if (isNaN(noticePeriodDays) || noticePeriodDays < 0) {
      errs.noticePeriodDays = 'Notice period must be 0 or greater';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const assignedExitId = isEditing ? editRecord.id : nextExitId || '';

    const record: EmployeeExitRecord = {
      id: assignedExitId,
      employeeId: employeeId.trim(),
      employeeName: employeeName.trim(),
      resignationDate: resignationDate.trim(),
      approvalDate: approvalDate.trim(),
      noticePeriodDays: Number(noticePeriodDays),
      lastWorkingDay: lastWorkingDay.trim(),
      exitType,
      reason: reason.trim(),
      exitStatus,
      assetsReturned,
      fullAndFinalStatus,
      notes: notes.trim() || '-',
      noticeCompletionDate: noticeCompletionDate.trim() || lastWorkingDay.trim(),
      exitReadiness,
    };

    onSubmit(record);
    onClose();
  };

  /* Unified input box inline styles strictly conforming to #E2E8F0 borders & #FFFFFF background */
  const boxStyle: React.CSSProperties = {
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    height: '38px',
    boxSizing: 'border-box',
  };

  const errorBoxStyle: React.CSSProperties = {
    ...boxStyle,
    border: '1px solid #F87171',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] z-10 flex flex-col max-h-[90vh] animate-fade-in">
        {/* Sticky Header with Proper Padding and Alignment */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
              <LogOut className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-base font-bold text-slate-900 leading-tight m-0">
                {isEditing ? 'Edit Exit Record' : 'Process Employee Exit'}
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-normal m-0 mt-1">
                {isEditing
                  ? `Update offboarding details for ${editRecord.id}`
                  : 'Initiate offboarding request and set notice timeline.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Independently Scrollable Form with Fixed Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {/* Row 1: Employee Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="exit-employee-names-list"
                value={employeeName}
                onChange={handleEmployeeNameChange}
                placeholder="e.g. Amit Sharma"
                style={errors.employeeName ? errorBoxStyle : boxStyle}
                className="w-full px-3.5 text-xs text-slate-800 placeholder-slate-400 bg-white rounded-[8px] hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
              <datalist id="exit-employee-names-list">
                {employeesList.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.id} — {emp.department} ({emp.role})
                  </option>
                ))}
              </datalist>
              {errors.employeeName && (
                <p className="text-[11px] text-red-500 mt-1">{errors.employeeName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="exit-employee-ids-list"
                value={employeeId}
                onChange={handleEmployeeIdChange}
                placeholder="e.g. EMP-001"
                style={errors.employeeId ? errorBoxStyle : boxStyle}
                className="w-full px-3.5 text-xs text-slate-800 placeholder-slate-400 bg-white rounded-[8px] hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
              <datalist id="exit-employee-ids-list">
                {employeesList.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.department}
                  </option>
                ))}
              </datalist>
              {errors.employeeId && (
                <p className="text-[11px] text-red-500 mt-1">{errors.employeeId}</p>
              )}
            </div>
          </div>

          {/* Row 2: Dates - Resignation & Approval */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Resignation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={resignationDate}
                onChange={(e) => setResignationDate(e.target.value)}
                placeholder="e.g. 25 Oct 2026"
                style={errors.resignationDate ? errorBoxStyle : boxStyle}
                className="w-full px-3.5 text-xs text-slate-800 placeholder-slate-400 bg-white rounded-[8px] hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
              {errors.resignationDate && (
                <p className="text-[11px] text-red-500 mt-1">{errors.resignationDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Approval Date
              </label>
              <input
                type="text"
                value={approvalDate}
                onChange={(e) => setApprovalDate(e.target.value)}
                placeholder="e.g. 26 Oct 2026"
                style={boxStyle}
                className="w-full px-3.5 text-xs text-slate-800 placeholder-slate-400 bg-white rounded-[8px] hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Notice Period & Last Working Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Notice Period (Days) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[10, 15, 20, 30, 45].map((days) => {
                  const isSelected = noticePeriodDays === days;
                  return (
                    <button
                      key={days}
                      type="button"
                      onClick={() => handleNoticePeriodChange(days)}
                      style={{
                        border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        height: '38px',
                        boxSizing: 'border-box',
                      }}
                      className={`flex-1 text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'text-blue-600 font-semibold shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {days}d
                    </button>
                  );
                })}
              </div>
              {errors.noticePeriodDays && (
                <p className="text-[11px] text-red-500 mt-1">{errors.noticePeriodDays}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Last Working Day <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastWorkingDay}
                onChange={(e) => {
                  setLastWorkingDay(e.target.value);
                  setNoticeCompletionDate(e.target.value);
                }}
                placeholder="e.g. 24 Nov 2026"
                style={errors.lastWorkingDay ? errorBoxStyle : boxStyle}
                className="w-full px-3.5 text-xs text-slate-800 placeholder-slate-400 bg-white rounded-[8px] hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
              {errors.lastWorkingDay && (
                <p className="text-[11px] text-red-500 mt-1">{errors.lastWorkingDay}</p>
              )}
            </div>
          </div>

          {/* Row 4: Exit Type & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Exit Type</label>
              <div className="relative">
                <select
                  value={exitType}
                  onChange={(e) => setExitType(e.target.value as ExitType)}
                  style={boxStyle}
                  className="w-full pl-3.5 pr-9 text-xs text-slate-800 bg-white rounded-[8px] appearance-none cursor-pointer hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option value="Resignation">Resignation</option>
                  <option value="Termination">Termination</option>
                  <option value="Retirement">Retirement</option>
                  <option value="Absconding">Absconding</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reason for Exit
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Career Growth"
                style={boxStyle}
                className="w-full px-3.5 text-xs text-slate-800 placeholder-slate-400 bg-white rounded-[8px] hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 5: Exit Status, Assets Returned, Full & Final Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Exit Status</label>
              <div className="relative">
                <select
                  value={exitStatus}
                  onChange={(e) => setExitStatus(e.target.value as ExitStatus)}
                  style={boxStyle}
                  className="w-full pl-3.5 pr-9 text-xs text-slate-800 bg-white rounded-[8px] appearance-none cursor-pointer hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="In Review">In Review</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assets Returned
              </label>
              <div className="relative">
                <select
                  value={assetsReturned}
                  onChange={(e) => setAssetsReturned(e.target.value as AssetsReturnedStatus)}
                  style={boxStyle}
                  className="w-full pl-3.5 pr-9 text-xs text-slate-800 bg-white rounded-[8px] appearance-none cursor-pointer hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option value="Pending">Pending</option>
                  <option value="Returned">Returned</option>
                  <option value="-">-</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full & Final Status
              </label>
              <div className="relative">
                <select
                  value={fullAndFinalStatus}
                  onChange={(e) => setFullAndFinalStatus(e.target.value as FullAndFinalStatus)}
                  style={boxStyle}
                  className="w-full pl-3.5 pr-9 text-xs text-slate-800 bg-white rounded-[8px] appearance-none cursor-pointer hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 6: Exit Readiness & Notice Completion Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Exit Readiness
              </label>
              <div className="relative">
                <select
                  value={exitReadiness}
                  onChange={(e) => setExitReadiness(e.target.value as ExitReadiness)}
                  style={boxStyle}
                  className="w-full pl-3.5 pr-9 text-xs text-slate-800 bg-white rounded-[8px] appearance-none cursor-pointer hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Notice Completion Date
              </label>
              <input
                type="text"
                value={noticeCompletionDate}
                onChange={(e) => setNoticeCompletionDate(e.target.value)}
                placeholder="e.g. 24 Nov 2026"
                style={boxStyle}
                className="w-full px-3.5 text-xs text-slate-800 placeholder-slate-400 bg-white rounded-[8px] hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 7: Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Handover in progress, assets list..."
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
              }}
              className="w-full p-3 text-xs text-slate-800 placeholder-slate-400 bg-white rounded-[8px] hover:border-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Fixed Footer Action Buttons */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-[#E2E8F0] flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              height: '38px',
              boxSizing: 'border-box',
            }}
            className="px-4 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-[8px] transition-colors cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              borderRadius: '8px',
              height: '38px',
              boxSizing: 'border-box',
            }}
            className="px-5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-[8px] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 size={15} />
            {isEditing ? 'Save Changes' : 'Confirm & Process Exit'}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};
