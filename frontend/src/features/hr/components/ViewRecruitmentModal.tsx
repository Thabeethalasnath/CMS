import React, { useState } from 'react';
import { X, UserCheck, Search, AlertCircle } from 'lucide-react';
import { CandidateRecord, Department } from '../types';
import { DEPARTMENTS } from '../mockData';

interface ViewRecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidateRecord[];
}

export const ViewRecruitmentModal: React.FC<ViewRecruitmentModalProps> = ({
  isOpen,
  onClose,
  candidates,
}) => {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState<Department>('All');
  const [onlyOver30Days, setOnlyOver30Days] = useState(false);

  if (!isOpen) return null;

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = dept === 'All' ? true : c.department === dept;
    const matches30 = onlyOver30Days ? c.daysInPipeline > 30 : true;
    return matchesSearch && matchesDept && matches30;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#E2E8F0] z-10 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
              <UserCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-base font-bold text-slate-900 leading-tight m-0">Candidate Pipeline & Recruitment</h3>
              <p className="text-xs text-slate-500 font-normal leading-normal m-0 mt-1">
                Active hiring pipeline, candidates over 30 days, and interview stages.
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

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-50/60 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as Department)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyOver30Days}
              onChange={(e) => setOnlyOver30Days(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Only &gt; 30 Days in Pipeline</span>
          </label>
        </div>

        {/* Table Body */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="pb-2.5">Candidate</th>
                <th className="pb-2.5">Target Role</th>
                <th className="pb-2.5">Department</th>
                <th className="pb-2.5">Time in Pipeline</th>
                <th className="pb-2.5 text-right">Stage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((can) => (
                <tr key={can.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2.5 font-semibold text-slate-800">{can.name}</td>
                  <td className="py-2.5 text-slate-600">{can.role}</td>
                  <td className="py-2.5 text-slate-500">{can.department}</td>
                  <td className="py-2.5">
                    {can.daysInPipeline > 30 ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                        <AlertCircle size={12} />
                        {can.daysInPipeline} days
                      </span>
                    ) : (
                      <span className="text-slate-600 font-medium">{can.daysInPipeline} days</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      {can.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 px-6 py-4 bg-slate-50/90 border-t border-[#E2E8F0] flex items-center justify-end shrink-0 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

