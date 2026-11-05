import React, { useState } from 'react';
import { X, CalendarCheck, Check, Ban, Clock, RotateCw } from 'lucide-react';
import { LeaveRecord } from '../types';

interface ManageLeavesModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaves: LeaveRecord[];
  onUpdateStatus: (id: string, newStatus: 'Approved' | 'Rejected') => Promise<boolean | void> | void;
}

export const ManageLeavesModal: React.FC<ManageLeavesModalProps> = ({
  isOpen,
  onClose,
  leaves,
  onUpdateStatus,
}) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLeaves = leaves.filter((l) => (filter === 'All' ? true : l.status === filter));

  const handleAction = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    if (updatingId) return; // Prevent repeated / concurrent submissions
    try {
      setUpdatingId(id);
      await onUpdateStatus(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !updatingId && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E2E8F0] z-10 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
              <CalendarCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-base font-bold text-slate-900 leading-tight m-0">Leave Management</h3>
              <p className="text-xs text-slate-500 font-normal leading-normal m-0 mt-1">
                Review, approve, or reject employee leave applications.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => !updatingId && onClose()}
            disabled={!!updatingId}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-40 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-[#E2E8F0] bg-slate-50/60 flex items-center gap-2 overflow-x-auto shrink-0">
          {(['Pending', 'All', 'Approved', 'Rejected'] as const).map((tab) => {
            const count = leaves.filter((l) => (tab === 'All' ? true : l.status === tab)).length;
            const active = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                disabled={!!updatingId}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    active ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Leaves List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 min-h-0">
          {filteredLeaves.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No {filter} leave requests</p>
              <p className="text-xs text-slate-400 mt-0.5">
                All employee leave applications are currently up to date.
              </p>
            </div>
          ) : (
            filteredLeaves.map((leave) => {
              const isCurrentUpdating = updatingId === leave.id;
              const isAnyUpdating = !!updatingId;

              return (
                <div
                  key={leave.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{leave.employeeName}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {leave.department}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : leave.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 font-normal">
                      <strong className="font-medium text-slate-800">{leave.leaveType}</strong> · {leave.startDate} to {leave.endDate} ({leave.days} day{leave.days > 1 ? 's' : ''})
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 italic">
                      Reason: "{leave.reason}"
                    </p>
                  </div>

                  {/* Approve / Reject buttons */}
                  {leave.status === 'Pending' ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAction(leave.id, 'Approved')}
                        disabled={isAnyUpdating}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isCurrentUpdating ? (
                          <RotateCw size={13} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        <span>{isCurrentUpdating ? 'Updating...' : 'Approve'}</span>
                      </button>
                      <button
                        onClick={() => handleAction(leave.id, 'Rejected')}
                        disabled={isAnyUpdating}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Ban size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 font-medium shrink-0">
                      Processed
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 px-6 py-4 bg-slate-50/90 border-t border-[#E2E8F0] flex items-center justify-end shrink-0 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={!!updatingId}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
