import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  FileCheck,
  RefreshCw,
  Plus,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  IndianRupee,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import { ContractData, ContractSummaryData, CreateContractPayload } from '@/types/contract';
import { contractService } from '@/services/contractService';
import { AddContractModal } from '../components/AddContractModal';
import { ContractDetailModal } from '../components/ContractDetailModal';

const formatCurrency = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '₹ 0';
  if (typeof val === 'string' && val.includes('₹')) return val;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '₹ 0';
  return '₹ ' + num.toLocaleString('en-IN');
};

export const ContractsPage: React.FC = () => {
  // Data state
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [summary, setSummary] = useState<ContractSummaryData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('15 Mar 2025, 10:30 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filters & Search controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState('All');
  const [selectedProposal, setSelectedProposal] = useState('All');
  const [selectedContractType, setSelectedContractType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [renewalDateFilter, setRenewalDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('Start Date (Newest)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('8 per page');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    try {
      const [items, summaryData] = await Promise.all([
        contractService.getContracts(),
        contractService.getSummary().catch(() => null),
      ]);
      setContracts(items || []);
      if (summaryData) {
        setSummary(summaryData);
      }
      const now = new Date();
      setLastUpdated(
        `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      );
    } catch {
      // Offline fallback
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedClient('All');
    setSelectedProposal('All');
    setSelectedContractType('All');
    setSelectedStatus('All');
    setStartDateFilter('');
    setEndDateFilter('');
    setRenewalDateFilter('');
    setCurrentPage(1);
  };

  // Create contract
  const handleCreateContract = async (payload: CreateContractPayload) => {
    await contractService.createContract(payload);
    await fetchData();
  };

  // Update contract
  const handleUpdateContract = async (id: number, data: Partial<ContractData>) => {
    await contractService.updateContract(id, data as any);
    await fetchData();
  };

  // Delete contract
  const handleDeleteContract = async (id: number) => {
    await contractService.deleteContract(id);
    await fetchData();
  };

  // Filtered & Sorted contracts
  const filteredContracts = useMemo(() => {
    return contracts
      .filter((item) => {
        // Text search across ID, Client ID, Proposal ID, Contract Type
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            (item.contractId && item.contractId.toLowerCase().includes(q)) ||
            (item.clientId && item.clientId.toLowerCase().includes(q)) ||
            (item.proposalId && item.proposalId.toLowerCase().includes(q)) ||
            (item.contractType && item.contractType.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Dropdown filters
        if (selectedClient !== 'All' && item.clientId !== selectedClient) return false;
        if (selectedProposal !== 'All' && item.proposalId !== selectedProposal) return false;
        if (selectedContractType !== 'All' && item.contractType !== selectedContractType) return false;
        if (selectedStatus !== 'All' && item.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;

        // Date filters
        if (startDateFilter.trim()) {
          if (!item.startDate.toLowerCase().includes(startDateFilter.toLowerCase())) return false;
        }
        if (endDateFilter.trim()) {
          if (!item.endDate.toLowerCase().includes(endDateFilter.toLowerCase())) return false;
        }
        if (renewalDateFilter.trim()) {
          if (!item.renewalDate.toLowerCase().includes(renewalDateFilter.toLowerCase())) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Start Date (Newest)') {
          return new Date(b.startDate || '').getTime() - new Date(a.startDate || '').getTime() || b.id - a.id;
        }
        if (sortBy === 'Start Date (Oldest)') {
          return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime() || a.id - b.id;
        }
        if (sortBy === 'Contract Value (High to Low)') {
          return (b.contractValue || 0) - (a.contractValue || 0);
        }
        if (sortBy === 'Contract Value (Low to High)') {
          return (a.contractValue || 0) - (b.contractValue || 0);
        }
        if (sortBy === 'End Date (Nearest)') {
          return new Date(a.endDate || '').getTime() - new Date(b.endDate || '').getTime();
        }
        return 0;
      });
  }, [
    contracts,
    searchQuery,
    selectedClient,
    selectedProposal,
    selectedContractType,
    selectedStatus,
    startDateFilter,
    endDateFilter,
    renewalDateFilter,
    sortBy,
  ]);

  // Pagination calculation
  const itemsPerPage = parseInt(pageSize, 10) || 10;
  const totalPages = Math.max(1, Math.ceil(filteredContracts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentRows = filteredContracts.slice(startIndex, startIndex + itemsPerPage);

  // Dynamic Options
  const clientOptions = useMemo(() => {
    const set = new Set(contracts.map((c) => c.clientId).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [contracts]);

  const proposalOptions = useMemo(() => {
    const set = new Set(contracts.map((c) => c.proposalId).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [contracts]);

  const contractTypeOptions = useMemo(() => {
    const set = new Set(contracts.map((c) => c.contractType).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [contracts]);

  const statusOptions = useMemo(() => {
    const set = new Set(contracts.map((c) => c.status).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [contracts]);

  // Export to CSV
  const handleExport = () => {
    const headers = [
      'CONTRACT ID',
      'CLIENT ID',
      'PROPOSAL ID',
      'CONTRACT TYPE',
      'START DATE',
      'END DATE',
      'RENEWAL DATE',
      'CONTRACT VALUE',
      'NOTICE PERIOD (DAYS)',
      'PAYMENT TERMS',
      'STATUS',
    ];

    const rows = filteredContracts.map((c) => [
      c.contractId,
      c.clientId,
      c.proposalId,
      `"${c.contractType}"`,
      c.startDate,
      c.endDate,
      c.renewalDate,
      c.contractValue,
      c.noticePeriod || 30,
      c.paymentTerms || 'Monthly',
      c.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contracts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics computation from live data
  const totalCount = summary?.totalContracts ?? contracts.length;
  const activeCount = summary?.activeContracts ?? contracts.filter((c) => c.status.toLowerCase() === 'active').length;
  const expiringCount = summary?.expiringContracts ?? contracts.filter((c) => c.status.toLowerCase() === 'expiring').length;
  const totalValueDisplay = summary?.totalContractValueFormatted ?? formatCurrency(contracts.reduce((sum, c) => sum + (c.contractValue || 0), 0));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '24px',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* =========================================================================
          SECTION 1: PAGE HEADER
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20.84px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Icon, Title, and Subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 0,
            gap: '14px',
          }}
        >
          {/* Icon Badge */}
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '48px',
              height: '48px',
              background: '#ECFDF5',
              border: '1px solid #D1FAE5',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              borderRadius: '12px',
              flexShrink: 0,
            }}
          >
            <FileCheck size={24} color="#059669" strokeWidth={2} />
          </div>

          {/* Heading Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: 0,
            }}
          >
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '33px',
                letterSpacing: '-0.6px',
                color: '#0F172A',
                margin: 0,
              }}
            >
              Contracts
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
                margin: 0,
              }}
            >
              Manage client contracts, track contract terms and validity, and monitor renewals.
            </p>
          </div>
        </div>

        {/* Right: Last Updated, Refresh Data Button, and Create Contract Button */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 0,
            gap: '12px',
          }}
        >
          {/* Last Updated Timestamp */}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '16px',
              color: '#94A3B8',
              whiteSpace: 'nowrap',
            }}
          >
            Last Updated: {lastUpdated}
          </span>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh Data"
            title="Refresh Data"
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px',
              width: '34px',
              height: '34px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#94A3B8',
            }}
          >
            <RefreshCw
              size={16}
              style={{
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '8px 16px',
              gap: '8px',
              height: '32px',
              background: '#4F46E5',
              boxShadow: '0px 1px 2px rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Create Contract
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 4 KPI METRICS CARDS
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Card 1: Total Contracts */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '32px 20px',
            gap: '14px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            minHeight: '111px',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '48px',
              height: '48px',
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '12px',
              flexShrink: 0,
            }}
          >
            <FileText size={24} color="#4F46E5" strokeWidth={2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
              }}
            >
              Total Contracts
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '24px',
                color: '#0F172A',
              }}
            >
              {totalCount}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#059669',
                }}
              >
                {summary?.totalContractsTrend || '↑ 14%'}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#64748B',
                }}
              >
                vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Contracts */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '32px 20px',
            gap: '14px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            minHeight: '111px',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '48px',
              height: '48px',
              background: '#ECFDF5',
              border: '1px solid #D1FAE5',
              borderRadius: '12px',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={24} color="#059669" strokeWidth={2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
              }}
            >
              Active Contracts
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '24px',
                color: '#0F172A',
              }}
            >
              {activeCount}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#059669',
                }}
              >
                {summary?.activeContractsTrend || '↑ 8%'}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#64748B',
                }}
              >
                vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Expiring Contracts */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '32px 20px',
            gap: '14px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            minHeight: '111px',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '48px',
              height: '48px',
              background: '#FFF1F2',
              border: '1px solid #FECDD3',
              borderRadius: '12px',
              flexShrink: 0,
            }}
          >
            <Clock size={24} color="#F43F5E" strokeWidth={2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
              }}
            >
              Expiring Contracts
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '24px',
                color: '#0F172A',
              }}
            >
              {expiringCount}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#F43F5E',
                }}
              >
                {summary?.expiringContractsTrend || '↓ 20%'}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#64748B',
                }}
              >
                vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Contract Value */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '32px 20px',
            gap: '14px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            minHeight: '111px',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '48px',
              height: '48px',
              background: '#F0FDFA',
              border: '1px solid #CCFBF1',
              borderRadius: '12px',
              flexShrink: 0,
            }}
          >
            <IndianRupee size={22} color="#0D9488" strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
              }}
            >
              Total Contract Value
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '24px',
                color: '#0F172A',
              }}
            >
              {totalValueDisplay}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#059669',
                }}
              >
                {summary?.totalContractValueTrend || '↑ 22%'}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#64748B',
                }}
              >
                vs last month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: SEARCH AND FILTERS CARD
          ========================================================================= */}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '20px',
          gap: '16px',
          width: '100%',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
        }}
      >
        {/* Search Bar & Action Buttons Header Row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 0,
            gap: '12px',
            width: '100%',
            height: '34px',
          }}
        >
          {/* Search Input Container */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 auto',
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
              <Search size={16} color="#94A3B8" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Contract ID, Client ID, Proposal ID or Contract Type..."
              style={{
                boxSizing: 'border-box',
                width: '100%',
                height: '34px',
                padding: '8px 16px 9px 36px',
                background: 'rgba(248, 250, 252, 0.5)',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                lineHeight: '15px',
                color: '#1E293B',
                outline: 'none',
              }}
            />
          </div>

          {/* Action Buttons: Filters Toggle & Clear Filters */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            {/* Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFiltersOpen((prev) => !prev)}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '8px 12px',
                gap: '8px',
                height: '34px',
                background: '#FFFFFF',
                border: '1px solid #4F46E5',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Filter size={14} color="#4F46E5" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#4F46E5',
                  textAlign: 'center',
                }}
              >
                Filters
              </span>
              <ChevronDown
                size={12}
                color="#4F46E5"
                style={{
                  transform: isFiltersOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>

            {/* Clear Filters Button */}
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0 8px',
                gap: '8px',
                height: '34px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} color="#4F46E5" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#4F46E5',
                  textAlign: 'center',
                }}
              >
                Clear Filters
              </span>
            </button>
          </div>
        </div>

        {/* Collapsible Filter Rows */}
        {isFiltersOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {/* Dropdowns Row 1: CLIENT ID, PROPOSAL ID, CONTRACT TYPE, STATUS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '16px',
                width: '100%',
              }}
            >
              {/* CLIENT ID */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                  }}
                >
                  CLIENT ID
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedClient}
                    onChange={(e) => {
                      setSelectedClient(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      height: '34px',
                      padding: '8px 32px 8px 12px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      color: '#1E293B',
                      appearance: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {clientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color="#6B7280"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* PROPOSAL ID */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                  }}
                >
                  PROPOSAL ID
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedProposal}
                    onChange={(e) => {
                      setSelectedProposal(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      height: '34px',
                      padding: '8px 32px 8px 12px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      color: '#1E293B',
                      appearance: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {proposalOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color="#6B7280"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* CONTRACT TYPE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                  }}
                >
                  CONTRACT TYPE
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedContractType}
                    onChange={(e) => {
                      setSelectedContractType(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      height: '34px',
                      padding: '8px 32px 8px 12px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      color: '#1E293B',
                      appearance: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {contractTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color="#6B7280"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* STATUS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                  }}
                >
                  STATUS
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      height: '34px',
                      padding: '8px 32px 8px 12px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      color: '#1E293B',
                      appearance: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color="#6B7280"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Date Range Pickers Row 2: START DATE, END DATE, RENEWAL DATE */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '16px',
                width: '100%',
              }}
            >
              {/* START DATE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                  }}
                >
                  START DATE
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Calendar size={14} color="#94A3B8" strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    value={startDateFilter}
                    onChange={(e) => {
                      setStartDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Select date range"
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      height: '34px',
                      padding: '8px 12px 9px 36px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      lineHeight: '15px',
                      color: '#1E293B',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* END DATE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                  }}
                >
                  END DATE
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Calendar size={14} color="#94A3B8" strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    value={endDateFilter}
                    onChange={(e) => {
                      setEndDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Select date range"
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      height: '34px',
                      padding: '8px 12px 9px 36px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      lineHeight: '15px',
                      color: '#1E293B',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* RENEWAL DATE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                  }}
                >
                  RENEWAL DATE
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Calendar size={14} color="#94A3B8" strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    value={renewalDateFilter}
                    onChange={(e) => {
                      setRenewalDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Select date range"
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      height: '34px',
                      padding: '8px 12px 9px 36px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      lineHeight: '15px',
                      color: '#1E293B',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 4: CONTRACTS TABLE SECTION
          ========================================================================= */}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 0,
          width: '100%',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Table Card Header: Contracts (count), Sort By, Export Button */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            width: '100%',
            height: '71px',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          {/* Left Heading */}
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#0F172A',
              margin: 0,
            }}
          >
            Contracts ({filteredContracts.length})
          </h2>

          {/* Right Controls: Sort By & Export Button */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Sort by dropdown */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#64748B',
                }}
              >
                Sort by
              </span>
              <div style={{ position: 'relative' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    boxSizing: 'border-box',
                    height: '30px',
                    padding: '6px 32px 6px 12px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#1E293B',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Start Date (Newest)">Start Date (Newest)</option>
                  <option value="Start Date (Oldest)">Start Date (Oldest)</option>
                  <option value="Contract Value (High to Low)">Contract Value (High to Low)</option>
                  <option value="Contract Value (Low to High)">Contract Value (Low to High)</option>
                  <option value="End Date (Nearest)">End Date (Nearest)</option>
                </select>
                <ChevronDown
                  size={14}
                  color="#6B7280"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '8px',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExport}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '6px 12px',
                gap: '6px',
                height: '30px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Download size={14} color="#64748B" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#334155',
                  textAlign: 'center',
                }}
              >
                Export
              </span>
            </button>
          </div>
        </div>

        {/* Table Responsive Container */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              minWidth: '1464px',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  height: '58.5px',
                  background: 'rgba(248, 250, 252, 0.8)',
                  borderBottom: '1px solid #E2E8F0',
                  boxSizing: 'border-box',
                }}
              >
                {/* 1. CONTRACT ID */}
                <th
                  style={{
                    width: '114.48px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  CONTRACT ID
                </th>

                {/* 2. CLIENT ID */}
                <th
                  style={{
                    width: '90.45px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  CLIENT ID
                </th>

                {/* 3. PROPOSAL ID */}
                <th
                  style={{
                    width: '111.59px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  PROPOSAL ID
                </th>

                {/* 4. CONTRACT TYPE */}
                <th
                  style={{
                    width: '171.81px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  CONTRACT TYPE
                </th>

                {/* 5. START DATE */}
                <th
                  style={{
                    width: '105.11px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  START DATE
                </th>

                {/* 6. END DATE */}
                <th
                  style={{
                    width: '105.52px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  END DATE
                </th>

                {/* 7. RENEWAL DATE */}
                <th
                  style={{
                    width: '123.98px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  RENEWAL DATE
                </th>

                {/* 8. CONTRACT VALUE */}
                <th
                  style={{
                    width: '141.61px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  CONTRACT VALUE
                </th>

                {/* 9. NOTICE PERIOD (DAYS) */}
                <th
                  style={{
                    width: '134.72px',
                    padding: '12px 16px 13px',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '11px',
                        lineHeight: '16px',
                        letterSpacing: '0.55px',
                        textTransform: 'uppercase',
                        color: '#64748B',
                      }}
                    >
                      NOTICE PERIOD
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '9px',
                        lineHeight: '16px',
                        letterSpacing: '0.55px',
                        textTransform: 'uppercase',
                        color: '#94A3B8',
                      }}
                    >
                      (DAYS)
                    </span>
                  </div>
                </th>

                {/* 10. PAYMENT TERMS */}
                <th
                  style={{
                    width: '113.05px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  PAYMENT TERMS
                </th>

                {/* 11. STATUS */}
                <th
                  style={{
                    width: '126.83px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  STATUS
                </th>

                {/* 12. ACTIONS */}
                <th
                  style={{
                    width: '125.7px',
                    padding: '20.5px 16px 21px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    boxSizing: 'border-box',
                  }}
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    style={{
                      height: '140px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      color: '#94A3B8',
                      fontSize: '14px',
                    }}
                  >
                    No matching contracts found. Try adjusting your search query or filters.
                  </td>
                </tr>
              ) : (
                currentRows.map((row) => {
                  const isExpiring = row.status?.toLowerCase() === 'expiring';
                  const isTerminated =
                    row.status?.toLowerCase() === 'terminated' || row.status?.toLowerCase() === 'expired';
                  const isPending = row.status?.toLowerCase() === 'pending';

                  let badgeBg = '#ECFDF5';
                  let badgeBorder = '#A7F3D0';
                  let badgeColor = '#047857';

                  if (isExpiring) {
                    badgeBg = '#FFFBEB';
                    badgeBorder = '#FDE68A';
                    badgeColor = '#B45309';
                  } else if (isTerminated) {
                    badgeBg = '#FFF1F2';
                    badgeBorder = '#FECDD3';
                    badgeColor = '#BE123C';
                  } else if (isPending) {
                    badgeBg = '#F0F9FF';
                    badgeBorder = '#BAE6FD';
                    badgeColor = '#0369A1';
                  }

                  return (
                    <tr
                      key={row.id}
                      style={{
                        height: '55px',
                        borderTop: '1px solid #F1F5F9',
                        boxSizing: 'border-box',
                      }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* 1. CONTRACT ID */}
                      <td
                        style={{
                          width: '114.48px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          onClick={() => {
                            setSelectedContract(row);
                            setIsDetailModalOpen(true);
                          }}
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#2563EB',
                            cursor: 'pointer',
                          }}
                        >
                          {row.contractId}
                        </span>
                      </td>

                      {/* 2. CLIENT ID */}
                      <td
                        style={{
                          width: '90.45px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#2563EB',
                          }}
                        >
                          {row.clientId}
                        </span>
                      </td>

                      {/* 3. PROPOSAL ID */}
                      <td
                        style={{
                          width: '111.59px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#2563EB',
                          }}
                        >
                          {row.proposalId || '-'}
                        </span>
                      </td>

                      {/* 4. CONTRACT TYPE */}
                      <td
                        style={{
                          width: '171.81px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#334155',
                          }}
                        >
                          {row.contractType}
                        </span>
                      </td>

                      {/* 5. START DATE */}
                      <td
                        style={{
                          width: '105.11px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#475569',
                          }}
                        >
                          {row.startDate}
                        </span>
                      </td>

                      {/* 6. END DATE */}
                      <td
                        style={{
                          width: '105.52px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#475569',
                          }}
                        >
                          {row.endDate}
                        </span>
                      </td>

                      {/* 7. RENEWAL DATE */}
                      <td
                        style={{
                          width: '123.98px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#475569',
                          }}
                        >
                          {row.renewalDate || '-'}
                        </span>
                      </td>

                      {/* 8. CONTRACT VALUE */}
                      <td
                        style={{
                          width: '141.61px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#1E293B',
                          }}
                        >
                          {formatCurrency(row.contractValue)}
                        </span>
                      </td>

                      {/* 9. NOTICE PERIOD (DAYS) */}
                      <td
                        style={{
                          width: '134.72px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                          textAlign: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#475569',
                            textAlign: 'center',
                          }}
                        >
                          {row.noticePeriod || 30}
                        </span>
                      </td>

                      {/* 10. PAYMENT TERMS */}
                      <td
                        style={{
                          width: '113.05px',
                          padding: '19px 16px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#1E293B',
                          }}
                        >
                          {row.paymentTerms || 'Monthly'}
                        </span>
                      </td>

                      {/* 11. STATUS */}
                      <td
                        style={{
                          width: '126.83px',
                          padding: '16.5px 16px',
                          boxSizing: 'border-box',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'inline-flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '2px 10px',
                            background: badgeBg,
                            border: `1px solid ${badgeBorder}`,
                            borderRadius: '9999px',
                            height: '22px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                              fontSize: '11px',
                              lineHeight: '16px',
                              color: badgeColor,
                              textAlign: 'center',
                            }}
                          >
                            {row.status}
                          </span>
                        </div>
                      </td>

                      {/* 12. ACTIONS */}
                      <td
                        style={{
                          width: '125.7px',
                          padding: '14.5px 16px',
                          boxSizing: 'border-box',
                          textAlign: 'center',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedContract(row);
                            setIsDetailModalOpen(true);
                          }}
                          style={{
                            boxSizing: 'border-box',
                            display: 'inline-flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '4px 10px',
                            width: '93.7px',
                            height: '26px',
                            background: '#FFFFFF',
                            border: '1px solid #BFDBFE',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              fontSize: '12px',
                              lineHeight: '16px',
                              color: '#4F46E5',
                              textAlign: 'center',
                            }}
                          >
                            View Details
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            width: '100%',
            height: '65px',
            background: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          {/* Left: Showing entries info */}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '12px',
              lineHeight: '16px',
              color: '#64748B',
            }}
          >
            {filteredContracts.length === 0
              ? 'Showing 0 of 0 contracts'
              : `Showing ${startIndex + 1} – ${Math.min(
                  startIndex + itemsPerPage,
                  filteredContracts.length
                )} of ${filteredContracts.length} contracts`}
          </span>

          {/* Right: Pagination buttons & Page size */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Page navigation buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {/* Previous Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                aria-label="Previous Page"
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '32px',
                  height: '32px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  cursor: safeCurrentPage <= 1 ? 'not-allowed' : 'pointer',
                  opacity: safeCurrentPage <= 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={14} color="#94A3B8" />
              </button>

              {/* Number buttons */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === safeCurrentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '32px',
                      height: '32px',
                      background: isActive ? '#4F46E5' : '#FFFFFF',
                      boxShadow: isActive ? '0px 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                      border: isActive ? 'none' : '1px solid #E2E8F0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: isActive ? '#FFFFFF' : '#475569',
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                aria-label="Next Page"
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '32px',
                  height: '32px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  cursor: safeCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                  opacity: safeCurrentPage >= totalPages ? 0.5 : 1,
                }}
              >
                <ChevronRight size={14} color="#94A3B8" />
              </button>
            </div>

            {/* Page Size Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  boxSizing: 'border-box',
                  height: '32px',
                  padding: '6px 28px 6px 12px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#1E293B',
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="8 per page">8 per page</option>
                <option value="10 per page">10 per page</option>
                <option value="25 per page">25 per page</option>
                <option value="50 per page">50 per page</option>
              </select>
              <ChevronDown
                size={14}
                color="#6B7280"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '9px',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      <AddContractModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateContract}
      />

      <ContractDetailModal
        isOpen={isDetailModalOpen}
        contract={selectedContract}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContract(null);
        }}
        onUpdate={handleUpdateContract}
        onDelete={handleDeleteContract}
      />
    </div>
  );
};

