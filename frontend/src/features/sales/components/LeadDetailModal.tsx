import React, { useState } from 'react';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Save,
} from 'lucide-react';
import { Lead, LeadStage, LeadStatus, ServiceInterest } from '../types/leads';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (updated: Lead) => void;
  onDeleteLead: (id: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
  onDeleteLead,
}) => {
  if (!isOpen || !lead) return null;

  const [currentStage, setCurrentStage] = useState<LeadStage>(lead.stage);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);
  const [followUpDate, setFollowUpDate] = useState(lead.nextFollowUp || '');
  const [notes, setNotes] = useState(lead.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  const stages: LeadStage[] = [
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Negotiation',
    'Won',
  ];

  const stageIndex = stages.indexOf(currentStage);

  const handleSave = () => {
    const updated: Lead = {
      ...lead,
      stage: currentStage,
      status: currentStage === 'Won' ? 'Converted' : currentStatus,
      nextFollowUp: followUpDate,
      notes,
    };
    onUpdateLead(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete lead ${lead.id} (${lead.company})?`)) {
      onDeleteLead(lead.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-md">
              {lead.id}
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {lead.company}
              </h3>
              <p className="text-xs text-slate-500">
                Created on {lead.leadDate} • Owned by {lead.ownerId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] flex flex-col gap-6">
          {/* Visual Sales Pipeline Stage Bar */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-700">Sales Pipeline Progression</span>
            <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1.5 rounded-xl">
              {stages.map((stg, idx) => {
                const isActive = idx <= stageIndex;
                const isCurrent = stg === currentStage;

                return (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => setCurrentStage(stg)}
                    className={`py-2 px-1 text-center rounded-lg text-[11px] font-semibold transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isActive
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-transparent text-slate-500 hover:bg-slate-200/60'
                    }`}
                  >
                    {stg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            {/* Contact Name */}
            <div className="flex items-start gap-2.5">
              <User size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Contact Person</span>
                <span className="text-xs font-semibold text-slate-900">{lead.contactName}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2.5">
              <Mail size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Email</span>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  {lead.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-2.5">
              <Phone size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Phone</span>
                <a
                  href={`tel:${lead.phone}`}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  {lead.phone}
                </a>
              </div>
            </div>

            {/* Source */}
            <div className="flex items-start gap-2.5">
              <Building2 size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Lead Source</span>
                <span className="text-xs font-semibold text-slate-900">{lead.source}</span>
              </div>
            </div>

            {/* Service Interest */}
            <div className="flex items-start gap-2.5">
              <Briefcase size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Service Interest</span>
                <span className="text-xs font-semibold text-indigo-700">{lead.serviceInterest}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Location</span>
                <span className="text-xs font-semibold text-slate-900">
                  {lead.city}, {lead.country}
                </span>
              </div>
            </div>

            {/* Estimated Value */}
            <div className="flex items-start gap-2.5">
              <DollarSign size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Estimated Deal Value</span>
                <span className="text-xs font-bold text-emerald-600">
                  {lead.estimatedValue || 'Not specified'}
                </span>
              </div>
            </div>

            {/* Next Follow-up */}
            <div className="flex items-start gap-2.5">
              <Calendar size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Next Follow-up</span>
                <span className="text-xs font-semibold text-slate-900">
                  {lead.nextFollowUp || 'None'}
                </span>
              </div>
            </div>

            {/* Lead Score */}
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Lead Score</span>
                <span className="text-xs font-bold text-indigo-600">
                  {lead.leadScore ?? 65} / 100
                </span>
              </div>
            </div>

            {/* Expected Close Date */}
            <div className="flex items-start gap-2.5">
              <Calendar size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Expected Close Date</span>
                <span className="text-xs font-semibold text-slate-900">
                  {lead.expectedCloseDate || '—'}
                </span>
              </div>
            </div>

            {/* Lost Reason */}
            {lead.lostReason && lead.lostReason !== '-' && (
              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[11px] text-rose-500 block">Lost Reason</span>
                  <span className="text-xs font-semibold text-rose-700">{lead.lostReason}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Edit Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Update Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="Converted">Converted</option>
                <option value="Archived">Archived</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reschedule Next Follow-up
              </label>
              <input
                type="text"
                placeholder="e.g. 24 Mar 2025"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Notes and Activity Log */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Activity Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes, call logs, customer pain points or meeting summary..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Lead</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isSaved ? <CheckCircle2 size={15} /> : <Save size={15} />}
              <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
