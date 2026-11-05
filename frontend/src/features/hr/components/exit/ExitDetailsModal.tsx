import React from 'react';
import { X, LogOut, Edit2, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import { EmployeeExitRecord } from '../../types';

interface ExitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: EmployeeExitRecord | null;
  onEdit: (record: EmployeeExitRecord) => void;
}

export const ExitDetailsModal: React.FC<ExitDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] z-10 flex flex-col max-h-[90vh] animate-fade-in">
        {/* Sticky Header with Proper Padding and Alignment */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
              <LogOut className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight m-0">{record.id}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {record.employeeId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal leading-normal m-0 mt-1">
                Offboarding & Exit Case Details for {record.employeeName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Status summary banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="block text-[11px] text-slate-400 font-medium uppercase">
                Exit Status
              </span>
              <span className="font-semibold text-xs text-slate-900 mt-0.5 block">
                {record.exitStatus}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-medium uppercase">
                Assets Returned
              </span>
              <span className="font-semibold text-xs text-slate-900 mt-0.5 block">
                {record.assetsReturned}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-medium uppercase">
                Full & Final
              </span>
              <span className="font-semibold text-xs text-slate-900 mt-0.5 block">
                {record.fullAndFinalStatus}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-medium uppercase">
                Exit Readiness
              </span>
              <span className="font-semibold text-xs text-slate-900 mt-0.5 block">
                {record.exitReadiness}
              </span>
            </div>
          </div>

          {/* Detailed key-value pairs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">Employee Name</span>
              <span className="font-bold text-slate-900 text-sm">{record.employeeName}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">Exit Type</span>
              <span className="font-semibold text-slate-900">{record.exitType}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">Resignation Date</span>
              <span className="font-medium text-slate-800">{record.resignationDate}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">Approval Date</span>
              <span className="font-medium text-slate-800">{record.approvalDate}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">Notice Period</span>
              <span className="font-medium text-slate-800">{record.noticePeriodDays} Days</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">Last Working Day</span>
              <span className="font-medium text-slate-800">{record.lastWorkingDay}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1 sm:col-span-2">
              <span className="text-slate-400 text-[11px]">Reason for Leaving</span>
              <span className="font-medium text-slate-800">{record.reason}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">Notice Completion Date</span>
              <span className="font-medium text-slate-800">{record.noticeCompletionDate}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-slate-400 text-[11px]">Assets / Equipment Notes</span>
              <span className="font-medium text-slate-800">{record.notes}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(record);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Edit2 size={13} />
            <span>Edit Record</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#3730A3] rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

