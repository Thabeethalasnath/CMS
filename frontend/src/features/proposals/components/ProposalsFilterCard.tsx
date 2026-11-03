import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, Calendar, X } from 'lucide-react';
import { ProposalFilters } from '../types';

interface ProposalsFilterCardProps {
  filters: ProposalFilters;
  onFilterChange: (key: keyof ProposalFilters, value: string) => void;
  onClearFilters: () => void;
  ownerOptions: string[];
  clientOptions: string[];
  opportunityOptions: string[];
  serviceOptions: string[];
}

export const ProposalsFilterCard: React.FC<ProposalsFilterCardProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  ownerOptions,
  clientOptions,
  opportunityOptions,
  serviceOptions,
}) => {
  const [activeDateModal, setActiveDateModal] = useState<
    'proposalDate' | 'validUntil' | 'expectedDecisionDate' | null
  >(null);

  const statusOptions = ['All', 'Sent', 'Pending', 'Approved', 'In Review', 'Rejected'];

  const handleDateSelect = (
    field: 'proposalDateRange' | 'validUntilRange' | 'expectedDecisionDateRange',
    value: string
  ) => {
    onFilterChange(field, value);
    setActiveDateModal(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 mb-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search by proposal ID, title, client ID or opportunity ID..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-9 py-2 text-xs leading-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#4F46E5] transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold leading-4 transition-colors cursor-pointer shadow-xs"
          >
            <Filter className="w-4 h-4 stroke-[2.2] text-slate-500" />
            <span>Filters</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5] text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[#4F46E5] hover:text-[#4338CA] hover:bg-indigo-50/50 rounded-lg text-xs font-semibold leading-4 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.2]" />
            <span>Clear filters</span>
          </button>
        </div>
      </div>

      {/* First Filter Row: 5 Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 pt-1">
        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 leading-4">
            Status
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-xs leading-4 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer pr-9 font-normal transition-colors"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Owner ID */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 leading-4">
            Owner ID
          </label>
          <div className="relative">
            <select
              value={filters.ownerId}
              onChange={(e) => onFilterChange('ownerId', e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-xs leading-4 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer pr-9 font-normal transition-colors"
            >
              {ownerOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Client ID */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 leading-4">
            Client ID
          </label>
          <div className="relative">
            <select
              value={filters.clientId}
              onChange={(e) => onFilterChange('clientId', e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-xs leading-4 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer pr-9 font-normal transition-colors"
            >
              {clientOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Opportunity ID */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 leading-4">
            Opportunity ID
          </label>
          <div className="relative">
            <select
              value={filters.opportunityId}
              onChange={(e) => onFilterChange('opportunityId', e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-xs leading-4 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer pr-9 font-normal transition-colors"
            >
              {opportunityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Service ID */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 leading-4">
            Service ID
          </label>
          <div className="relative">
            <select
              value={filters.serviceId}
              onChange={(e) => onFilterChange('serviceId', e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 text-xs leading-4 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer pr-9 font-normal transition-colors"
            >
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Second Filter Row: 3 Date Range Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Proposal Date */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 leading-4">
            Proposal Date
          </label>
          <div className="relative">
            <div
              onClick={() => setActiveDateModal('proposalDate')}
              className="w-full bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg pl-10 pr-3.5 py-2 text-xs leading-4 text-slate-700 flex items-center justify-between cursor-pointer transition-colors"
            >
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <span className={filters.proposalDateRange ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'}>
                {filters.proposalDateRange || 'Select date range'}
              </span>
              {filters.proposalDateRange && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange('proposalDateRange', '');
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Date Popover */}
            {activeDateModal === 'proposalDate' && (
              <div className="absolute z-20 top-full mt-1.5 left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 text-xs leading-4">
                <div className="font-semibold text-slate-700 px-2 py-1 mb-1 border-b border-slate-100 flex justify-between items-center text-xs">
                  <span>Proposal date presets</span>
                  <button onClick={() => setActiveDateModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {['Today', 'This Week', 'This Month', 'Last Month', 'Last 30 Days', 'All Dates'].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleDateSelect('proposalDateRange', item === 'All Dates' ? '' : item)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors font-medium text-xs"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Valid Until */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 leading-4">
            Valid Until
          </label>
          <div className="relative">
            <div
              onClick={() => setActiveDateModal('validUntil')}
              className="w-full bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg pl-10 pr-3.5 py-2 text-xs leading-4 text-slate-700 flex items-center justify-between cursor-pointer transition-colors"
            >
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <span className={filters.validUntilRange ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'}>
                {filters.validUntilRange || 'Select date range'}
              </span>
              {filters.validUntilRange && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange('validUntilRange', '');
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Date Popover */}
            {activeDateModal === 'validUntil' && (
              <div className="absolute z-20 top-full mt-1.5 left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 text-xs leading-4">
                <div className="font-semibold text-slate-700 px-2 py-1 mb-1 border-b border-slate-100 flex justify-between items-center text-xs">
                  <span>Valid until presets</span>
                  <button onClick={() => setActiveDateModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {['Next 7 Days', 'Next 14 Days', 'Next 30 Days', 'Next 60 Days', 'All Dates'].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleDateSelect('validUntilRange', item === 'All Dates' ? '' : item)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors font-medium text-xs"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expected Decision Date */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 leading-4">
            Expected Decision Date
          </label>
          <div className="relative">
            <div
              onClick={() => setActiveDateModal('expectedDecisionDate')}
              className="w-full bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg pl-10 pr-3.5 py-2 text-xs leading-4 text-slate-700 flex items-center justify-between cursor-pointer transition-colors"
            >
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <span className={filters.expectedDecisionDateRange ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'}>
                {filters.expectedDecisionDateRange || 'Select date range'}
              </span>
              {filters.expectedDecisionDateRange && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange('expectedDecisionDateRange', '');
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Date Popover */}
            {activeDateModal === 'expectedDecisionDate' && (
              <div className="absolute z-20 top-full mt-1.5 left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 text-xs leading-4">
                <div className="font-semibold text-slate-700 px-2 py-1 mb-1 border-b border-slate-100 flex justify-between items-center text-xs">
                  <span>Decision date presets</span>
                  <button onClick={() => setActiveDateModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {['This Week', 'This Month', 'Next Month', 'Next 30 Days', 'All Dates'].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleDateSelect('expectedDecisionDateRange', item === 'All Dates' ? '' : item)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors font-medium text-xs"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
