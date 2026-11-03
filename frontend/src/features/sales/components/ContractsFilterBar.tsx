import React from 'react';
import { Search, Filter, RotateCcw, ChevronDown, Calendar } from 'lucide-react';
import { MasterClient } from '@/services/masterDataService';

interface ContractsFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedClient: string;
  setSelectedClient: (val: string) => void;
  selectedProposal: string;
  setSelectedProposal: (val: string) => void;
  selectedContractType: string;
  setSelectedContractType: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  startDateFilter: string;
  setStartDateFilter: (val: string) => void;
  endDateFilter: string;
  setEndDateFilter: (val: string) => void;
  renewalDateFilter: string;
  setRenewalDateFilter: (val: string) => void;
  isFiltersOpen: boolean;
  setIsFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClearFilters: () => void;
  clients: MasterClient[];
  proposalOptions: string[];
  contractTypeOptions: string[];
}

export const ContractsFilterBar: React.FC<ContractsFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedClient,
  setSelectedClient,
  selectedProposal,
  setSelectedProposal,
  selectedContractType,
  setSelectedContractType,
  selectedStatus,
  setSelectedStatus,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  renewalDateFilter,
  setRenewalDateFilter,
  isFiltersOpen,
  setIsFiltersOpen,
  onClearFilters,
  clients,
  proposalOptions,
  contractTypeOptions,
}) => {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '16px',
        gap: '12px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        borderRadius: '12px',
      }}
    >
      {/* Search Bar & Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          height: '34px',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: 1,
            height: '34px',
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
            <Search style={{ width: '16px', height: '16px', color: '#94A3B8', strokeWidth: 1.5 }} />
          </div>
          <input
            type="text"
            placeholder="Search by Contract ID, Client ID, Proposal ID, or Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              boxSizing: 'border-box',
              width: '100%',
              height: '34px',
              backgroundColor: 'rgba(248, 250, 252, 0.5)',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '8px 16px 9px 36px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              lineHeight: '15px',
              color: '#1E293B',
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={() => setIsFiltersOpen((prev) => !prev)}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 12px',
            gap: '6px',
            height: '34px',
            backgroundColor: isFiltersOpen ? 'rgba(239, 246, 255, 0.6)' : 'rgba(239, 246, 255, 0.3)',
            border: '1px solid #4F46E5',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#4F46E5',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '16px',
            whiteSpace: 'nowrap',
          }}
        >
          <Filter style={{ width: '14px', height: '14px', color: '#4F46E5', strokeWidth: 1.2 }} />
          <span>Filters</span>
          <ChevronDown
            style={{
              width: '12px',
              height: '12px',
              color: '#4F46E5',
              strokeWidth: 1.5,
              transform: isFiltersOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        <button
          onClick={onClearFilters}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 10px',
            gap: '6px',
            height: '32px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#4F46E5',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '16px',
            whiteSpace: 'nowrap',
          }}
        >
          <RotateCcw style={{ width: '14px', height: '14px', color: '#4F46E5', strokeWidth: 1.5 }} />
          <span>Clear Filters</span>
        </button>
      </div>

      {isFiltersOpen && (
        <>
          {/* Row 1: Client, Proposal, Type, Status */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '12px',
              width: '100%',
            }}
          >
            {/* Client Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '17px',
                  color: '#475569',
                }}
              >
                Client
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#334155',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="All">All Clients</option>
                  {clients.map((c) => {
                    const cName = c.companyName || c.clientName || c.name || c.id;
                    return (
                      <option key={c.id} value={c.id}>
                        {cName}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '9px',
                    width: '12px',
                    height: '12px',
                    color: '#94A3B8',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Proposal Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '17px',
                  color: '#475569',
                }}
              >
                Proposal
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedProposal}
                  onChange={(e) => setSelectedProposal(e.target.value)}
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#334155',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="All">All Proposals</option>
                  {proposalOptions.filter((p) => p !== 'All').map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '9px',
                    width: '12px',
                    height: '12px',
                    color: '#94A3B8',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Contract Type Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '17px',
                  color: '#475569',
                }}
              >
                Contract Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedContractType}
                  onChange={(e) => setSelectedContractType(e.target.value)}
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#334155',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="All">All Types</option>
                  {contractTypeOptions.filter((t) => t !== 'All').map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '9px',
                    width: '12px',
                    height: '12px',
                    color: '#94A3B8',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '17px',
                  color: '#475569',
                }}
              >
                Status
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '30px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 28px 4px 10px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#334155',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expiring">Expiring</option>
                  <option value="Pending">Pending</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Expired">Expired</option>
                </select>
                <ChevronDown
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '9px',
                    width: '12px',
                    height: '12px',
                    color: '#94A3B8',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Date Filters */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '16px',
              width: '100%',
            }}
          >
            {/* Start Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '17px',
                  color: '#475569',
                }}
              >
                Start Date
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: '30px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '0 10px',
                }}
              >
                <Calendar style={{ width: '14px', height: '14px', color: '#64748B', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="Filter start date..."
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#334155',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* End Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '17px',
                  color: '#475569',
                }}
              >
                End Date
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: '30px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '0 10px',
                }}
              >
                <Calendar style={{ width: '14px', height: '14px', color: '#64748B', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="Filter end date..."
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#334155',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Renewal Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '11px',
                  lineHeight: '17px',
                  color: '#475569',
                }}
              >
                Renewal Date
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: '30px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '0 10px',
                }}
              >
                <Calendar style={{ width: '14px', height: '14px', color: '#64748B', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="Filter renewal date..."
                  value={renewalDateFilter}
                  onChange={(e) => setRenewalDateFilter(e.target.value)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#334155',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

