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

  /* Shared styling adhering to Designer & Figma specifications:
     Border: 1px solid #E2E8F0 on all four sides, Background: #F8FAFC, Radius: 8px, Height: 30px */
  const dropdownInlineStyle: React.CSSProperties = {
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    backgroundColor: '#F8FAFC',
    height: '30px',
    boxSizing: 'border-box',
  };

  /* Shared class for all 5 select dropdowns */
  const selectCls =
    'w-full bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg px-3 h-[30px] text-xs text-[#1E293B] appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-[#CBD5E1] cursor-pointer pr-8 font-normal transition-colors';

  /* Shared class for all 3 date picker trigger divs */
  const dateTriggerCls =
    'w-full bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg pl-9 pr-3 h-[30px] text-xs text-[#1E293B] flex items-center justify-between cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-[#CBD5E1] transition-colors';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 mb-6">

      {/* ── Row 1: Search bar + action buttons ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search by Proposal ID, title, Client ID or Opportunity ID..."
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
            }}
            className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-10 pr-9 h-[34px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-[#CBD5E1] transition-all"
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
        <div className="flex items-center gap-2 self-end sm:self-auto">

          {/* Filters Dropdown Button — pill shape, indigo border */}
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              height: '34px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #4F46E5',
              borderRadius: '9999px',
              color: '#4F46E5',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <Filter style={{ width: 16, height: 16, color: '#4F46E5', flexShrink: 0 }} />
            <span>Filters</span>
            <ChevronDown style={{ width: 14, height: 14, color: '#4F46E5', flexShrink: 0 }} />
          </button>

          {/* Clear Filters Button */}
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              paddingLeft: '10px',
              paddingRight: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '9999px',
              color: '#4F46E5',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw style={{ width: 16, height: 16, color: '#4F46E5', flexShrink: 0 }} />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* ── Row 2: 5 Dropdown filters — Figma: Fill width, 30px height containers ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 pt-1">

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5 leading-4">Status</label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              style={dropdownInlineStyle}
              className={selectCls}
            >
              {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Owner ID */}
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5 leading-4">Owner ID</label>
          <div className="relative">
            <select
              value={filters.ownerId}
              onChange={(e) => onFilterChange('ownerId', e.target.value)}
              style={dropdownInlineStyle}
              className={selectCls}
            >
              {ownerOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Client ID */}
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5 leading-4">Client ID</label>
          <div className="relative">
            <select
              value={filters.clientId}
              onChange={(e) => onFilterChange('clientId', e.target.value)}
              style={dropdownInlineStyle}
              className={selectCls}
            >
              {clientOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Opportunity ID */}
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5 leading-4">Opportunity ID</label>
          <div className="relative">
            <select
              value={filters.opportunityId}
              onChange={(e) => onFilterChange('opportunityId', e.target.value)}
              style={dropdownInlineStyle}
              className={selectCls}
            >
              {opportunityOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Service ID */}
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5 leading-4">Service ID</label>
          <div className="relative">
            <select
              value={filters.serviceId}
              onChange={(e) => onFilterChange('serviceId', e.target.value)}
              style={dropdownInlineStyle}
              className={selectCls}
            >
              {serviceOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Row 3: 3 Date Range Pickers — Figma: Fill width, 30px height containers ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

        {/* Proposal Date */}
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5 leading-4">Proposal Date</label>
          <div className="relative">
            <div
              onClick={() => setActiveDateModal('proposalDate')}
              style={dropdownInlineStyle}
              className={dateTriggerCls}
            >
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <span className={filters.proposalDateRange ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'}>
                {filters.proposalDateRange || 'Select date range'}
              </span>
              {filters.proposalDateRange && (
                <button type="button" onClick={(e) => { e.stopPropagation(); onFilterChange('proposalDateRange', ''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {activeDateModal === 'proposalDate' && (
              <div className="absolute z-20 top-full mt-1.5 left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 text-xs">
                <div className="font-semibold text-slate-700 px-2 py-1 mb-1 border-b border-slate-100 flex justify-between items-center">
                  <span>Proposal date presets</span>
                  <button onClick={() => setActiveDateModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="space-y-1">
                  {['Mar 2025', '11 Mar - 15 Mar 2025', 'Feb 2025', 'Last 30 Days', 'All Dates'].map((item) => (
                    <button key={item} onClick={() => handleDateSelect('proposalDateRange', item === 'All Dates' ? '' : item)} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors font-medium">{item}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Valid Until */}
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5 leading-4">Valid Until</label>
          <div className="relative">
            <div
              onClick={() => setActiveDateModal('validUntil')}
              style={dropdownInlineStyle}
              className={dateTriggerCls}
            >
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <span className={filters.validUntilRange ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'}>
                {filters.validUntilRange || 'Select date range'}
              </span>
              {filters.validUntilRange && (
                <button type="button" onClick={(e) => { e.stopPropagation(); onFilterChange('validUntilRange', ''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {activeDateModal === 'validUntil' && (
              <div className="absolute z-20 top-full mt-1.5 left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 text-xs">
                <div className="font-semibold text-slate-700 px-2 py-1 mb-1 border-b border-slate-100 flex justify-between items-center">
                  <span>Valid until presets</span>
                  <button onClick={() => setActiveDateModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="space-y-1">
                  {['Apr 2025', '25 Mar - 30 Apr 2025', 'Next 30 Days', 'Next 60 Days', 'All Dates'].map((item) => (
                    <button key={item} onClick={() => handleDateSelect('validUntilRange', item === 'All Dates' ? '' : item)} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors font-medium">{item}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expected Decision Date */}
        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1.5 leading-4">Expected Decision Date</label>
          <div className="relative">
            <div
              onClick={() => setActiveDateModal('expectedDecisionDate')}
              style={dropdownInlineStyle}
              className={dateTriggerCls}
            >
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <span className={filters.expectedDecisionDateRange ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'}>
                {filters.expectedDecisionDateRange || 'Select date range'}
              </span>
              {filters.expectedDecisionDateRange && (
                <button type="button" onClick={(e) => { e.stopPropagation(); onFilterChange('expectedDecisionDateRange', ''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {activeDateModal === 'expectedDecisionDate' && (
              <div className="absolute z-20 top-full mt-1.5 left-0 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 text-xs">
                <div className="font-semibold text-slate-700 px-2 py-1 mb-1 border-b border-slate-100 flex justify-between items-center">
                  <span>Decision date presets</span>
                  <button onClick={() => setActiveDateModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="space-y-1">
                  {['Mar 2025', 'Apr 2025', 'This Month', 'Next Month', 'All Dates'].map((item) => (
                    <button key={item} onClick={() => handleDateSelect('expectedDecisionDateRange', item === 'All Dates' ? '' : item)} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors font-medium">{item}</button>
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
