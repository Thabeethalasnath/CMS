import React from 'react';
import { X, CheckCircle, XCircle, Clock, Building, User, Tag, Calendar, FileText, AlertCircle } from 'lucide-react';
import { ApprovalStatus } from '../../types/approvals';

export type DetailItemType =
  | {
      type: 'employee';
      id: number;
      title: string;
      code: string;
      requestType: string;
      appliedDate: string;
      dateRange: string;
      duration: string;
      reason: string;
      status: ApprovalStatus;
    }
  | {
      type: 'client';
      id: number;
      title: string;
      code: string;
      requestType: string;
      referenceId: string;
      requester: string;
      requestDate: string;
      dueDate: string;
      amount: string;
      status: ApprovalStatus;
    }
  | {
      type: 'ticketAsset';
      id: number;
      title: string;
      code: string;
      recordType: string;
      recordCode: string;
      clientRequester: string;
      approvalType: string;
      priority: string;
      requestDate: string;
      assignedApprover: string;
      status: ApprovalStatus;
    };

interface ApprovalDetailModalProps {
  item: DetailItemType | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (type: 'employee' | 'client' | 'ticketAsset', id: number, status: ApprovalStatus) => void;
}

export const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  if (!isOpen || !item) return null;

  const handleAction = (status: ApprovalStatus) => {
    onUpdateStatus(item.type, item.id, status);
    onClose();
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 z-10 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-sm">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Approval Request Details
              </h3>
              <p className="text-xs text-slate-500">
                {item.code} &bull; {item.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-4 text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
          {/* Status Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Current Status
              </span>
              <span className="text-sm font-bold text-slate-800 mt-0.5">
                {item.status} Request
              </span>
            </div>
            {getStatusBadge(item.status)}
          </div>

          {/* Details Fields Grid */}
          <div className="grid grid-cols-2 gap-3.5 pt-1">
            {item.type === 'employee' && (
              <>
                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" /> Employee
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {item.title} <span className="text-slate-500 font-normal">({item.code})</span>
                  </p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                    <Tag size={13} className="text-slate-400" /> Request Type
                  </span>
                  <p className="text-xs font-bold text-indigo-700 mt-1">
                    {item.requestType}
                  </p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" /> Applied Date
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {item.appliedDate}
                  </p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" /> Duration
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {item.duration} ({item.dateRange})
                  </p>
                </div>

                <div className="col-span-2 p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-slate-400" /> Reason / Notes
                  </span>
                  <p className="text-xs text-slate-800 mt-1 bg-white p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </>
            )}

            {item.type === 'client' && (
              <>
                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                    <Building size={13} className="text-slate-400" /> Client
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{item.title}</p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                    <Tag size={13} className="text-slate-400" /> Request Type
                  </span>
                  <p className="text-xs font-bold text-indigo-700 mt-1">{item.requestType}</p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Reference ID
                  </span>
                  <p className="text-xs font-mono font-semibold text-slate-800 mt-1">
                    {item.referenceId}
                  </p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Requester
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">{item.requester}</p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Request & Due Date
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {item.requestDate} &rarr; {item.dueDate}
                  </p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Amount
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{item.amount}</p>
                </div>
              </>
            )}

            {item.type === 'ticketAsset' && (
              <>
                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Record Type & Code
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    {item.recordType} &bull; <span className="font-mono text-slate-600">{item.recordCode}</span>
                  </p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Priority
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">{item.priority}</p>
                </div>

                <div className="col-span-2 p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Title / Asset Name
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{item.title}</p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Requester / Client
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">{item.clientRequester}</p>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <span className="text-[10.5px] font-semibold text-slate-400 uppercase">
                    Assigned Approver
                  </span>
                  <p className="text-xs font-semibold text-indigo-700 mt-1">{item.assignedApprover}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => handleAction('Pending')}
            disabled={item.status === 'Pending'}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 disabled:opacity-50 transition-colors"
          >
            Mark Pending
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('Rejected')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors"
            >
              <XCircle size={15} />
              Reject Request
            </button>

            <button
              onClick={() => handleAction('Approved')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <CheckCircle size={15} />
              Approve Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
