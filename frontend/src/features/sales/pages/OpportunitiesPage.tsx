import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Target,
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
  BarChart2,
  Package,
  Sparkles,
} from 'lucide-react';
import { OpportunityData, OpportunitySummaryData, CreateOpportunityPayload } from '@/types/opportunity';
import { opportunityService } from '@/services/opportunityService';
import { AddOpportunityModal } from '../components/AddOpportunityModal';
import { OpportunityDetailModal } from '../components/OpportunityDetailModal';


const formatCurrency = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '₹ 0';
  if (typeof val === 'string' && val.includes('₹')) return val;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '₹ 0';
  return '₹ ' + num.toLocaleString('en-IN');
};

export const OpportunitiesPage: React.FC = () => {
  // Data state - fully dynamic from live database
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [summary, setSummary] = useState<OpportunitySummaryData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('15 Mar 2025, 10:30 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter and search controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOwner, setSelectedOwner] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [expectedCloseDateFilter, setExpectedCloseDateFilter] = useState('');
  const [nextFollowUpFilter, setNextFollowUpFilter] = useState('');
  const [lastContactFilter, setLastContactFilter] = useState('');
  const [sortBy, setSortBy] = useState('Expected Close Date (Nearest)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10 per page');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Load data from backend
  const fetchData = useCallback(async () => {
    try {
      const [items, summaryData] = await Promise.all([
        opportunityService.getOpportunities(),
        opportunityService.getSummary().catch(() => null),
      ]);
      setOpportunities(items || []);
      if (summaryData) {
        setSummary(summaryData);
      }
      const now = new Date();
      setLastUpdated(
        `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      );
    } catch {
      // Offline or network error
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStage('All');
    setSelectedStatus('All');
    setSelectedOwner('All');
    setSelectedClient('All');
    setSelectedService('All');
    setExpectedCloseDateFilter('');
    setNextFollowUpFilter('');
    setLastContactFilter('');
    setSortBy('Expected Close Date (Nearest)');
    setCurrentPage(1);
  };

  // Filter and sort items dynamically
  const filteredOpportunities = useMemo(() => {
    let result = opportunities.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          item.opportunityId.toLowerCase().includes(query) ||
          item.opportunityName.toLowerCase().includes(query) ||
          item.leadId.toLowerCase().includes(query) ||
          item.clientId.toLowerCase().includes(query) ||
          item.ownerId.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      if (selectedStage !== 'All' && item.stage.toLowerCase() !== selectedStage.toLowerCase()) return false;
      if (selectedStatus !== 'All' && item.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      if (selectedOwner !== 'All' && item.ownerId.toLowerCase() !== selectedOwner.toLowerCase()) return false;
      if (selectedClient !== 'All' && item.clientId.toLowerCase() !== selectedClient.toLowerCase()) return false;
      if (selectedService !== 'All' && item.serviceId.toLowerCase() !== selectedService.toLowerCase()) return false;

      if (expectedCloseDateFilter.trim()) {
        const dateQ = expectedCloseDateFilter.toLowerCase().trim();
        if (!item.expectedCloseDate || !item.expectedCloseDate.toLowerCase().includes(dateQ)) {
          return false;
        }
      }

      if (lastContactFilter.trim()) {
        const dateQ = lastContactFilter.toLowerCase().trim();
        if (!item.lastContact || !item.lastContact.toLowerCase().includes(dateQ)) {
          return false;
        }
      }

      if (nextFollowUpFilter.trim()) {
        const dateQ = nextFollowUpFilter.toLowerCase().trim();
        if (!item.nextFollowUp || !item.nextFollowUp.toLowerCase().includes(dateQ)) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'Probability (High to Low)') {
        return (b.probability || 0) - (a.probability || 0);
      }
      if (sortBy === 'Estimated Value (High to Low)') {
        return (Number(b.estimatedValue) || 0) - (Number(a.estimatedValue) || 0);
      }
      if (sortBy === 'Recently Updated') {
        return (b.id || 0) - (a.id || 0);
      }
      // Expected Close Date (Nearest)
      if (!a.expectedCloseDate || a.expectedCloseDate === '-') return 1;
      if (!b.expectedCloseDate || b.expectedCloseDate === '-') return -1;
      const dateA = new Date(a.expectedCloseDate).getTime();
      const dateB = new Date(b.expectedCloseDate).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateA - dateB;
      }
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    });

    return result;
  }, [
    opportunities,
    searchQuery,
    selectedStage,
    selectedStatus,
    selectedOwner,
    selectedClient,
    selectedService,
    expectedCloseDateFilter,
    lastContactFilter,
    nextFollowUpFilter,
    sortBy,
  ]);

  // Pagination calculation
  const numericPageSize = parseInt(pageSize, 10) || 10;
  const totalPages = Math.max(1, Math.ceil(filteredOpportunities.length / numericPageSize));
  const startIndex = (currentPage - 1) * numericPageSize;
  const paginatedOpportunities = useMemo(() => {
    return filteredOpportunities.slice(startIndex, startIndex + numericPageSize);
  }, [filteredOpportunities, startIndex, numericPageSize]);

  // Unique options for dropdowns - dynamically derived from live database records
  const ownerOptions = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => o.ownerId && set.add(o.ownerId));
    return Array.from(set).sort();
  }, [opportunities]);

  const clientOptions = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => o.clientId && set.add(o.clientId));
    return Array.from(set).sort();
  }, [opportunities]);

  const serviceOptions = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => o.serviceId && set.add(o.serviceId));
    return Array.from(set).sort();
  }, [opportunities]);

  // CSV Export handler
  const handleExport = () => {
    const headers = [
      'Opportunity ID',
      'Lead ID',
      'Client ID',
      'Opportunity Name',
      'Owner ID',
      'Service ID',
      'Stage',
      'Probability %',
      'Estimated Value',
      'Expected Close Date',
      'Last Contact',
      'Next Follow-up',
      'Status',
      'Lost Reason',
      'Weighted Pipeline',
    ];

    const escapeCsvField = (field: string | number | null | undefined): string => {
      if (field === null || field === undefined) return '""';
      const str = String(field);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredOpportunities.map((row) => [
      escapeCsvField(row.opportunityId),
      escapeCsvField(row.leadId),
      escapeCsvField(row.clientId),
      escapeCsvField(row.opportunityName),
      escapeCsvField(row.ownerId),
      escapeCsvField(row.serviceId),
      escapeCsvField(row.stage),
      escapeCsvField(row.probability),
      escapeCsvField(row.estimatedValueFormatted || formatCurrency(row.estimatedValue)),
      escapeCsvField(row.expectedCloseDate),
      escapeCsvField(row.lastContact),
      escapeCsvField(row.nextFollowUp),
      escapeCsvField(row.status),
      escapeCsvField(row.lostReason),
      escapeCsvField(row.weightedPipelineFormatted || formatCurrency(row.weightedPipeline)),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `opportunities_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Add Opportunity Handler
  const handleAddOpportunity = async (payload: CreateOpportunityPayload) => {
    try {
      const created = await opportunityService.createOpportunity(payload);
      setOpportunities((prev) => [created, ...prev]);
      await fetchData();
    } catch {
      // Offline fallback
      const newId = opportunities.length + 1;
      const formattedOpp: OpportunityData = {
        id: newId,
        opportunityId: payload.opportunityId || `O-2025-${String(newId).padStart(3, '0')}`,
        leadId: payload.leadId || `L-2025-${String(newId).padStart(3, '0')}`,
        clientId: payload.clientId,
        opportunityName: payload.opportunityName,
        ownerId: payload.ownerId,
        serviceId: payload.serviceId,
        stage: payload.stage,
        probability: payload.probability,
        estimatedValue: payload.estimatedValue,
        estimatedValueFormatted: formatCurrency(payload.estimatedValue),
        expectedCloseDate: payload.expectedCloseDate || '-',
        lastContact: payload.lastContact || '15 Mar 2025',
        nextFollowUp: payload.nextFollowUp || '-',
        status: payload.status,
        lostReason: payload.lostReason || '-',
        weightedPipeline: (payload.estimatedValue * payload.probability) / 100,
        weightedPipelineFormatted: formatCurrency((payload.estimatedValue * payload.probability) / 100),
        orderIndex: newId,
      };
      setOpportunities((prev) => [formattedOpp, ...prev]);
    }
  };

  // Update Status Handler
  const handleUpdateStatus = async (
    id: number,
    stage: string,
    status: string,
    lostReason?: string
  ) => {
    try {
      const updated = await opportunityService.updateOpportunity(id, {
        stage,
        status,
        lostReason: lostReason || '-',
      });
      setOpportunities((prev) => prev.map((item) => (item.id === id ? updated : item)));
      await fetchData();
    } catch {
      setOpportunities((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                stage,
                status,
                lostReason: lostReason || '-',
              }
            : item
        )
      );
    }
  };

  // Delete Handler
  const handleDeleteOpportunity = async (id: number) => {
    try {
      await opportunityService.deleteOpportunity(id);
      setOpportunities((prev) => prev.filter((item) => item.id !== id));
      await fetchData();
    } catch {
      setOpportunities((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // View Details trigger
  const handleViewDetails = (item: OpportunityData) => {
    setSelectedOpportunity(item);
    setIsDetailModalOpen(true);
  };

  // Stage Badge Renderer matching exact Figma color palettes
  const renderStageBadge = (stage: string) => {
    switch (stage) {
      case 'New':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '18px',
              backgroundColor: '#DBEAFE',
              color: '#4F46E5',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            New
          </span>
        );
      case 'Qualified':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '18px',
              backgroundColor: '#D1FAE5',
              color: '#047857',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            Qualified
          </span>
        );
      case 'Proposal':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '18px',
              backgroundColor: '#F3E8FF',
              color: '#7E22CE',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            Proposal
          </span>
        );
      case 'Negotiation':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '18px',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            Negotiation
          </span>
        );
      case 'Won':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '18px',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            Won
          </span>
        );
      case 'Lost':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '18px',
              backgroundColor: '#FFE4E6',
              color: '#BE123C',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            Lost
          </span>
        );
      default:
        return <span>{stage}</span>;
    }
  };

  // Status Badge Renderer matching exact Figma color palettes
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '20px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '6px',
              color: '#047857',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            Open
          </span>
        );
      case 'In Progress':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '20px',
              backgroundColor: '#ECFEFF',
              border: '1px solid #A5F3FC',
              borderRadius: '6px',
              color: '#0E7490',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            In Progress
          </span>
        );
      case 'Won':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '20px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '6px',
              color: '#16A34A',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            Won
          </span>
        );
      case 'Lost':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 10px',
              height: '20px',
              backgroundColor: '#FFF1F2',
              border: '1px solid #FECDD3',
              borderRadius: '6px',
              color: '#BE123C',
              fontSize: '11px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            Lost
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  // KPI Metrics derivation - fully dynamic from live database records
  const totalCount = summary?.totalOpportunities ?? opportunities.length;
  const openCount =
    summary?.openOpportunities ??
    opportunities.filter((o) => o.status === 'Open' || o.status === 'In Progress').length;
  const weightedPipelineVal = useMemo(() => {
    if (summary?.weightedPipeline !== undefined && summary?.weightedPipeline !== null) {
      return summary.weightedPipeline;
    }
    return opportunities.reduce((acc, curr) => acc + (curr.weightedPipeline || 0), 0);
  }, [summary, opportunities]);
  const weightedPipelineDisplay =
    summary?.weightedPipelineFormatted ?? formatCurrency(weightedPipelineVal);
  const wonCount =
    summary?.wonOpportunities ??
    opportunities.filter((o) => o.stage === 'Won' || o.status === 'Won').length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '24px',
        gap: '20px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 1. Breadcrumbs and Page Heading */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          minHeight: '41px',
        }}
      >
        {/* Title and Icon */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          {/* Emerald Icon Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #D1FAE5',
              borderRadius: '8px',
              flexShrink: 0,
            }}
          >
            <Target style={{ width: '24px', height: '24px', color: '#059669', strokeWidth: 2 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '25px',
                color: '#0F172A',
                margin: 0,
              }}
            >
              Opportunities
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
                margin: 0,
              }}
            >
              Track sales opportunities, monitor pipeline value, and manage deal progress.
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
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
            onClick={handleRefresh}
            title="Refresh"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              cursor: 'pointer',
              padding: 0,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <RefreshCw
              style={{
                width: '16px',
                height: '16px',
                color: '#64748B',
                strokeWidth: 1.33,
                transform: isRefreshing ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.5s ease',
              }}
            />
          </button>

          {/* + Add Opportunity Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '8px 14px',
              gap: '6px',
              height: '32px',
              backgroundColor: '#4F46E5',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '16px',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4338CA')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
          >
            <Plus style={{ width: '16px', height: '16px', color: '#FFFFFF', strokeWidth: 1.5 }} />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* 2. Section - KpiCardsGrid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          width: '100%',
        }}
      >
        {/* Card 1: Total Opportunities */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '26px 16px',
            gap: '16px',
            height: '116px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              backgroundColor: '#EFF6FF',
              borderRadius: '8px',
              flexShrink: 0,
            }}
          >
            <BarChart2 style={{ width: '24px', height: '24px', color: '#4F46E5', strokeWidth: 2 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
              }}
            >
              Total Opportunities
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '32px',
                color: '#0F172A',
              }}
            >
              {totalCount}
            </span>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#10B981',
                }}
              >
                ↑ 12%
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#94A3B8',
                }}
              >
                vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Open Opportunities */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '26px 16px',
            gap: '16px',
            height: '116px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              backgroundColor: '#ECFDF5',
              borderRadius: '8px',
              flexShrink: 0,
            }}
          >
            <Package style={{ width: '24px', height: '24px', color: '#059669', strokeWidth: 2 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
              }}
            >
              Open Opportunities
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '32px',
                color: '#0F172A',
              }}
            >
              {openCount}
            </span>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#10B981',
                }}
              >
                ↑ 8%
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#94A3B8',
                }}
              >
                vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Weighted Pipeline */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '26px 16px',
            gap: '16px',
            height: '116px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              backgroundColor: '#FFF1F2',
              borderRadius: '8px',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '28px',
                color: '#F43F5E',
              }}
            >
              ₹
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
              }}
            >
              Weighted Pipeline
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '32px',
                color: '#0F172A',
              }}
            >
              {weightedPipelineDisplay}
            </span>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#10B981',
                }}
              >
                ↑ 15%
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#94A3B8',
                }}
              >
                vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Won Opportunities */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '26px 16px',
            gap: '16px',
            height: '116px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              backgroundColor: '#F0FDFA',
              borderRadius: '8px',
              flexShrink: 0,
            }}
          >
            <Sparkles style={{ width: '24px', height: '24px', color: '#0D9488', strokeWidth: 2 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#64748B',
              }}
            >
              Won Opportunities
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '32px',
                color: '#0F172A',
              }}
            >
              {wonCount}
            </span>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#10B981',
                }}
              >
                ↑ 20%
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: '#94A3B8',
                }}
              >
                vs last month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FilterSection */}
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
          {/* Search Input Container */}
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* Filters Toggle Button */}
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

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
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

        {/* Collapsible Filter Dropdown Rows */}
        {isFiltersOpen && (
          <>
            {/* Filter Dropdowns Row 1: Stage, Status, Owner ID, Client ID, Service ID */}
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
                onChange={(e) => {
                  setSelectedStage(e.target.value);
                  setCurrentPage(1);
                }}
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
                <option value="All">All</option>
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
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
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
                <option value="All">All</option>
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

          {/* Owner ID */}
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
              Owner ID
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedOwner}
                onChange={(e) => {
                  setSelectedOwner(e.target.value);
                  setCurrentPage(1);
                }}
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
                <option value="All">All</option>
                {ownerOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
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

          {/* Client ID */}
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
              Client ID
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
                <option value="All">All</option>
                {clientOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
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

          {/* Service ID */}
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
              Service ID
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  setCurrentPage(1);
                }}
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
                <option value="All">All</option>
                {serviceOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
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

        {/* Filter Dropdowns Row 2: Date Ranges */}
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
                placeholder="Select date range"
                value={expectedCloseDateFilter}
                onChange={(e) => {
                  setExpectedCloseDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: '#334155',
                  width: '100%',
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
                placeholder="Select date range"
                value={lastContactFilter}
                onChange={(e) => {
                  setLastContactFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: '#334155',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Next Follow-up */}
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
              Next Follow-up
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
                placeholder="Select date range"
                value={nextFollowUpFilter}
                onChange={(e) => {
                  setNextFollowUpFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: '#334155',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* 4. Section - TableContainer */}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 0,
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Table Header Bar */}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            width: '100%',
            height: '63px',
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          {/* Heading 2 */}
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#0F172A',
              margin: 0,
            }}
          >
            Opportunities ({filteredOpportunities.length})
          </h2>

          {/* Right Action: Sort by & Export */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            {/* Sort by dropdown */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#64748B',
                }}
              >
                Sort by
              </span>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  height: '30px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '6px 28px 6px 12px',
                  cursor: 'pointer',
                }}
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#334155',
                    appearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Expected Close Date (Nearest)">Expected Close Date (Nearest)</option>
                  <option value="Probability (High to Low)">Probability (High to Low)</option>
                  <option value="Estimated Value (High to Low)">Estimated Value (High to Low)</option>
                  <option value="Recently Updated">Recently Updated</option>
                </select>
                <ChevronDown
                  style={{
                    position: 'absolute',
                    right: '8px',
                    width: '12px',
                    height: '12px',
                    color: '#94A3B8',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '6px 12px',
                gap: '6px',
                height: '30px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#334155',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <Download style={{ width: '14px', height: '14px', color: '#334155', strokeWidth: 1.2 }} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Strict Single-Line Horizontal Data Table */}
        <div
          style={{
            width: '100%',
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '2000.42px',
              minWidth: '2000.42px',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}
          >
            {/* Header Row */}
            <thead>
              <tr
                style={{
                  height: '41px',
                  backgroundColor: 'rgba(248, 250, 252, 0.75)',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <th
                  style={{
                    width: '134.13px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Opportunity ID
                </th>
                <th
                  style={{
                    width: '100.63px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Lead ID
                </th>
                <th
                  style={{
                    width: '90.45px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Client ID
                </th>
                <th
                  style={{
                    width: '184.17px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Opportunity Name
                </th>
                <th
                  style={{
                    width: '91.95px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Owner ID
                </th>
                <th
                  style={{
                    width: '98.16px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Service ID
                </th>
                <th
                  style={{
                    width: '112.78px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Stage
                </th>
                <th
                  style={{
                    width: '126.41px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Probability %
                </th>
                <th
                  style={{
                    width: '143.05px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Estimated Value
                </th>
                <th
                  style={{
                    width: '171.53px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Expected Close Date
                </th>
                <th
                  style={{
                    width: '124.53px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Last Contact
                </th>
                <th
                  style={{
                    width: '138.95px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Next Follow-up
                </th>
                <th
                  style={{
                    width: '113.47px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    width: '115.52px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Lost Reason
                </th>
                <th
                  style={{
                    width: '151.98px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                >
                  Weighted Pipeline
                </th>
                <th
                  style={{
                    width: '102.72px',
                    padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    textAlign: 'right',
                    boxSizing: 'border-box',
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paginatedOpportunities.map((row) => (
                <tr
                  key={row.opportunityId}
                  style={{
                    height: '55px',
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Opportunity ID */}
                  <td
                    onClick={() => handleViewDetails(row)}
                    style={{
                      width: '134.13px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#2563EB',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.opportunityId}
                  </td>

                  {/* Lead ID */}
                  <td
                    style={{
                      width: '100.63px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#2563EB',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.leadId}
                  </td>

                  {/* Client ID */}
                  <td
                    style={{
                      width: '90.45px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#64748B',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.clientId}
                  </td>

                  {/* Opportunity Name */}
                  <td
                    style={{
                      width: '184.17px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#1E293B',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.opportunityName}
                  </td>

                  {/* Owner ID */}
                  <td
                    style={{
                      width: '91.95px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#64748B',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.ownerId}
                  </td>

                  {/* Service ID */}
                  <td
                    style={{
                      width: '98.16px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#64748B',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.serviceId}
                  </td>

                  {/* Stage */}
                  <td
                    style={{
                      width: '112.78px',
                      padding: '13.5px 16px',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {renderStageBadge(row.stage)}
                  </td>

                  {/* Probability % */}
                  <td
                    style={{
                      width: '126.41px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#334155',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.probability}%
                  </td>

                  {/* Estimated Value */}
                  <td
                    style={{
                      width: '143.05px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#334155',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.estimatedValueFormatted || formatCurrency(row.estimatedValue)}
                  </td>

                  {/* Expected Close Date */}
                  <td
                    style={{
                      width: '171.53px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: (!row.expectedCloseDate || row.expectedCloseDate === '-') ? '#94A3B8' : '#334155',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.expectedCloseDate || '-'}
                  </td>

                  {/* Last Contact */}
                  <td
                    style={{
                      width: '124.53px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: (!row.lastContact || row.lastContact === '-') ? '#94A3B8' : '#64748B',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.lastContact || '-'}
                  </td>

                  {/* Next Follow-up */}
                  <td
                    style={{
                      width: '138.95px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: (!row.nextFollowUp || row.nextFollowUp === '-') ? '#94A3B8' : '#EF4444',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.nextFollowUp || '-'}
                  </td>

                  {/* Status */}
                  <td
                    style={{
                      width: '113.47px',
                      padding: '12.5px 16px',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {renderStatusBadge(row.status)}
                  </td>

                  {/* Lost Reason */}
                  <td
                    style={{
                      width: '115.52px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: (!row.lostReason || row.lostReason === '-') ? '#94A3B8' : '#475569',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.lostReason || '-'}
                  </td>

                  {/* Weighted Pipeline */}
                  <td
                    style={{
                      width: '151.98px',
                      padding: '14px 16px 15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#334155',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                    }}
                  >
                    {row.weightedPipelineFormatted || formatCurrency(row.weightedPipeline || (Number(row.estimatedValue) * row.probability) / 100)}
                  </td>

                  {/* Action */}
                  <td
                    style={{
                      width: '102.72px',
                      padding: '14px 16px 15px',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                      textAlign: 'right',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                      <button
                        onClick={() => handleViewDetails(row)}
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '4px 12px',
                          width: '83px',
                          height: '26px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #3B82F6',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#4F46E5',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: '12px',
                          lineHeight: '16px',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
            padding: '0 16px',
            width: '100%',
            height: '61px',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          {/* Showing X - Y of Z text */}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '16px',
              color: '#64748B',
            }}
          >
            Showing {filteredOpportunities.length > 0 ? startIndex + 1 : 0} –{' '}
            {Math.min(startIndex + numericPageSize, filteredOpportunities.length)} of{' '}
            {filteredOpportunities.length} opportunities
          </span>

          {/* Right: Page Buttons and Page Size Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            {/* Page number buttons */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
              {/* Previous button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.6 : 1,
                }}
              >
                <ChevronLeft style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
              </button>

              {/* Dynamic Page Number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    backgroundColor: currentPage === page ? '#4F46E5' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: currentPage === page ? 600 : 400,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: currentPage === page ? '#FFFFFF' : '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}

              {/* Next button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.6 : 1,
                }}
              >
                <ChevronRight style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
              </button>
            </div>

            {/* Page Size Dropdown */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                height: '28px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                padding: '0 24px 0 8px',
                cursor: 'pointer',
              }}
            >
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#334155',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="10 per page">10 per page</option>
                <option value="25 per page">25 per page</option>
                <option value="50 per page">50 per page</option>
              </select>
              <ChevronDown
                style={{
                  position: 'absolute',
                  right: '6px',
                  width: '12px',
                  height: '12px',
                  color: '#94A3B8',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Opportunity Modal */}
      <AddOpportunityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddOpportunity}
      />

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        item={selectedOpportunity}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOpportunity(null);
        }}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteOpportunity}
      />
    </div>
  );
};
