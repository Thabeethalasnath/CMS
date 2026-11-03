import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Calendar,
  Building,
  User,
  ChevronDown,
} from 'lucide-react';
import { Proposal, ProposalStatus } from '../types';
import { formatRupee } from '@/features/collections/utils';
import { SemanticStatusBadge } from '../../../components/ui/SemanticStatusBadge';

interface ProposalDetailsModalProps {
  proposal: Proposal | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (proposalId: string, newStatus: ProposalStatus) => void;
  onDelete?: (proposalId: string) => void;
}

export const ProposalDetailsModal: React.FC<ProposalDetailsModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  const [currentStatus, setCurrentStatus] = useState<ProposalStatus>(proposal?.status || 'Pending');

  useEffect(() => {
    if (proposal) {
      setCurrentStatus(proposal.status);
    }
  }, [proposal]);

  if (!isOpen || !proposal) return null;

  const handleStatusChange = (newStatus: ProposalStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatus?.(proposal.proposalId, newStatus);
  };

  const allowedStatuses: ProposalStatus[] = ['Draft', 'Sent', 'Pending', 'Approved', 'In Review', 'Rejected'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold leading-6 text-slate-900 tracking-tight">
                  {proposal.proposalId}
                </h2>
                <span className="text-[11px] font-medium leading-4 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {proposal.version}
                </span>
                <SemanticStatusBadge status={currentStatus} />

                {/* Status Dropdown with Allowed Status Options */}
                <div className="relative inline-flex items-center ml-1">
                  <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(e.target.value as ProposalStatus)}
                    aria-label="Change Proposal Status"
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg pl-2.5 pr-7 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none transition-colors"
                  >
                    {allowedStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <p className="text-xs font-normal leading-4 text-slate-500 mt-0.5">
                {proposal.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Financial Value Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total proposal value
              </span>
              <div className="text-2xl font-extrabold tracking-[-0.6px] leading-8 text-slate-900 mt-0.5">
                {formatRupee(proposal.totalAmount)}
              </div>
            </div>
            <div className="text-right text-xs font-normal leading-4 text-slate-600 space-y-0.5">
              <div>Before tax: <span className="font-semibold text-slate-800">{formatRupee(proposal.serviceBeforeTax)}</span></div>
              <div>Tax (18% GST): <span className="font-semibold text-slate-800">{formatRupee(proposal.taxAmount)}</span></div>
            </div>
          </div>

          {/* 4 Cards Grid of Core Associated Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Opportunity & Client */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC]">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2 leading-4">
                <Building className="w-4 h-4 text-indigo-500" />
                <span>Client & opportunity</span>
              </div>
              <div className="space-y-1.5 text-xs leading-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Client ID:</span>
                  <span className="font-medium text-slate-800">{proposal.clientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client name:</span>
                  <span className="font-medium text-slate-800">{proposal.clientName || 'Enterprise Partner'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Opportunity ID:</span>
                  <span className="font-medium text-blue-600">{proposal.opportunityId}</span>
                </div>
              </div>
            </div>

            {/* Service & Owner */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC]">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2 leading-4">
                <User className="w-4 h-4 text-indigo-500" />
                <span>Service & ownership</span>
              </div>
              <div className="space-y-1.5 text-xs leading-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service ID:</span>
                  <span className="font-medium text-slate-800">{proposal.serviceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service name:</span>
                  <span className="font-medium text-slate-800">{proposal.serviceName || 'Custom Service Package'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proposal owner:</span>
                  <span className="font-medium text-slate-800">{proposal.ownerId} {proposal.ownerName ? `(${proposal.ownerName})` : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline / Dates Banner */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-3 leading-4">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Milestone & decision dates</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs leading-4">Proposal date</span>
                <span className="font-semibold text-slate-800 text-xs leading-4 mt-0.5 block">
                  {proposal.proposalDate}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs leading-4">Valid until</span>
                <span className="font-semibold text-slate-800 text-xs leading-4 mt-0.5 block">
                  {proposal.validUntil}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs leading-4">Expected decision</span>
                <span className="font-semibold text-indigo-700 text-xs leading-4 mt-0.5 block">
                  {proposal.expectedDecisionDate}
                </span>
              </div>
            </div>
          </div>

          {/* Scope / Description */}
          {proposal.description && (
            <div className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC]">
              <span className="text-xs font-semibold text-slate-700 block mb-1 leading-4">
                Scope & deliverables
              </span>
              <p className="text-xs font-normal leading-5 text-slate-600">
                {proposal.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="text-xs font-normal text-slate-400">
            KALPANAAA CMS · Proposals Management
          </div>
          <div className="flex items-center gap-2.5">
            {proposal.status === 'Draft' && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(proposal.proposalId)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-rose-100 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 rounded-lg text-xs font-semibold leading-4 transition-colors cursor-pointer"
              >
                Delete draft
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onUpdateStatus?.(proposal.proposalId, 'Rejected');
                onClose();
              }}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold leading-4 transition-colors cursor-pointer"
            >
              Reject request
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateStatus?.(proposal.proposalId, 'Approved');
                onClose();
              }}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold leading-4 transition-colors cursor-pointer"
            >
              Approve request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold leading-4 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
