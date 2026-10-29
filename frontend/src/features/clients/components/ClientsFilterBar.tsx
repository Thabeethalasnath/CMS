import React, { useState } from 'react';
import { Search, Filter, RotateCcw, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { ClientsFilterState } from '../types/clients';

interface ClientsFilterBarProps {
  filterState: ClientsFilterState;
  onFilterChange: (updates: Partial<ClientsFilterState>) => void;
  onClearFilters: () => void;
}

export const ClientsFilterBar: React.FC<ClientsFilterBarProps> = ({
  filterState,
  onFilterChange,
  onClearFilters,
}) => {
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);

  const statusOptions = ['All', 'Active', 'Pending', 'Prospect', 'Suspended', 'Inactive'];
  const clientTypeOptions = ['All', 'Enterprise', 'SMB', 'Startup', 'Government'];
  const industryOptions = [
    'All',
    'IT Services',
    'Manufacturing',
    'Education',
    'Healthcare',
    'Real Estate',
    'Renewable Energy',
    'Finance',
    'Logistics',
    'E-commerce',
  ];
  const countryOptions = ['All', 'India', 'United States', 'United Kingdom', 'UAE', 'Singapore'];
  const cityOptions = [
    'All',
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Kolkata',
    'Ahmedabad',
  ];
  const accountOwnerOptions = [
    'All',
    'Akshit Ujjain',
    'Rohan Sharma',
    'Priya Patel',
    'Sneha Reddy',
    'Amit Patel',
    'Neha Verma',
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Search Bar Row with Filters Toggle and Clear Button */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
        }}
      >
        {/* Search Input Box */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Search size={16} color="#94A3B8" />
          </div>
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by client ID, client name, company, email or phone..."
            style={{
              width: '100%',
              height: '34px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '8px 16px 8px 36px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              lineHeight: '15px',
              color: '#1E293B',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Filters Toggle Button */}
        <button
          type="button"
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 12px',
            gap: '6px',
            height: '34px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Filter size={14} color="#4F46E5" />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              color: '#4F46E5',
            }}
          >
            Filters
          </span>
          {showFiltersPanel ? (
            <ChevronUp size={14} color="#4F46E5" />
          ) : (
            <ChevronDown size={14} color="#4F46E5" />
          )}
        </button>

        {/* Clear Filters Button */}
        <button
          type="button"
          onClick={onClearFilters}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '8px 12px',
            gap: '6px',
            height: '34px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <RotateCcw size={14} color="#4F46E5" />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 500,
              color: '#4F46E5',
            }}
          >
            Clear Filters
          </span>
        </button>
      </div>

      {/* Expanded Filters Dropdowns */}
      {showFiltersPanel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {/* Row 1: 6 Select Dropdowns */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full"
          >
            {/* 1. Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: '16px',
                }}
              >
                Status
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filterState.status}
                  onChange={(e) => onFilterChange({ status: e.target.value })}
                  style={{
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#1E293B',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <ChevronDown size={14} color="#94A3B8" />
                </div>
              </div>
            </div>

            {/* 2. Client Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: '16px',
                }}
              >
                Client Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filterState.clientType}
                  onChange={(e) => onFilterChange({ clientType: e.target.value })}
                  style={{
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#1E293B',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {clientTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <ChevronDown size={14} color="#94A3B8" />
                </div>
              </div>
            </div>

            {/* 3. Industry */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: '16px',
                }}
              >
                Industry
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filterState.industry}
                  onChange={(e) => onFilterChange({ industry: e.target.value })}
                  style={{
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#1E293B',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {industryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <ChevronDown size={14} color="#94A3B8" />
                </div>
              </div>
            </div>

            {/* 4. Country */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: '16px',
                }}
              >
                Country
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filterState.country}
                  onChange={(e) => onFilterChange({ country: e.target.value })}
                  style={{
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#1E293B',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {countryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <ChevronDown size={14} color="#94A3B8" />
                </div>
              </div>
            </div>

            {/* 5. City */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: '16px',
                }}
              >
                City
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filterState.city}
                  onChange={(e) => onFilterChange({ city: e.target.value })}
                  style={{
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#1E293B',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {cityOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <ChevronDown size={14} color="#94A3B8" />
                </div>
              </div>
            </div>

            {/* 6. Account Owner */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: '16px',
                }}
              >
                Account Owner
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filterState.accountOwner}
                  onChange={(e) => onFilterChange({ accountOwner: e.target.value })}
                  style={{
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#1E293B',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {accountOwnerOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <ChevronDown size={14} color="#94A3B8" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Onboarding Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '256px' }}>
            <label
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 500,
                color: '#64748B',
                lineHeight: '16px',
              }}
            >
              Onboarding Date
            </label>
            <div style={{ position: 'relative', width: '256px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <Calendar size={14} color="#94A3B8" />
              </div>
              <input
                type="text"
                value={filterState.onboardingDateRange}
                onChange={(e) => onFilterChange({ onboardingDateRange: e.target.value })}
                placeholder="Select date range"
                style={{
                  width: '100%',
                  height: '30px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '4px 10px 4px 32px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  lineHeight: '15px',
                  color: '#1E293B',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
