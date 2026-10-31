import React from 'react';
import { Search, Filter, RotateCcw, ChevronDown, Calendar } from 'lucide-react';
import { MasterEmployee, MasterClient } from '@/services/masterDataService';

interface OpportunitiesFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStage: string;
  setSelectedStage: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedOwner: string;
  setSelectedOwner: (val: string) => void;
  selectedClient: string;
  setSelectedClient: (val: string) => void;
  selectedService: string;
  setSelectedService: (val: string) => void;
  expectedCloseDateFilter: string;
  setExpectedCloseDateFilter: (val: string) => void;
  lastContactFilter: string;
  setLastContactFilter: (val: string) => void;
  nextFollowUpFilter: string;
  setNextFollowUpFilter: (val: string) => void;
  isFiltersOpen: boolean;
  setIsFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClearFilters: () => void;
  employees: MasterEmployee[];
  clients: MasterClient[];
  services: string[];
}

export const OpportunitiesFilterBar: React.FC<OpportunitiesFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStage,
  setSelectedStage,
  selectedStatus,
  setSelectedStatus,
  selectedOwner,
  setSelectedOwner,
  selectedClient,
  setSelectedClient,
  selectedService,
  setSelectedService,
  expectedCloseDateFilter,
  setExpectedCloseDateFilter,
  lastContactFilter,
  setLastContactFilter,
  nextFollowUpFilter,
  setNextFollowUpFilter,
  isFiltersOpen,
  setIsFiltersOpen,
  onClearFilters,
  employees,
  clients,
  services,
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
      {/* Search bar & Action Buttons */}
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
            placeholder="Search by Opportunity ID, name, Lead ID or Client ID..."
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
            transition: 'all 0.15s ease',
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
          {/* Row 1: Stage, Status, Owner, Client, Service */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '12px',
              width: '100%',
            }}
          >
            {/* Stage */}
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
                Stage
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
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
                  <option value="All">All Stages</option>
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
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

            {/* Status */}
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
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
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

            {/* Owner - from master data */}
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
                Owner
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
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
                  <option value="All">All Owners</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName} ({emp.employeeId})
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

            {/* Client - from master data */}
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

            {/* Service - from master data */}
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
                Service
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
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
                  <option value="All">All Services</option>
                  {services.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
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
            {/* Expected Close Date */}
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
                Expected Close Date
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
                  placeholder="Filter close date..."
                  value={expectedCloseDateFilter}
                  onChange={(e) => setExpectedCloseDateFilter(e.target.value)}
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

            {/* Last Contact */}
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
                Last Contact
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
                  placeholder="Filter last contact..."
                  value={lastContactFilter}
                  onChange={(e) => setLastContactFilter(e.target.value)}
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

            {/* Next Follow-Up */}
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
                Next Follow-Up
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
                  placeholder="Filter follow-up..."
                  value={nextFollowUpFilter}
                  onChange={(e) => setNextFollowUpFilter(e.target.value)}
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

