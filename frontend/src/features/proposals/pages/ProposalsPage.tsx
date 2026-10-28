import React, { useState, useEffect, useCallback } from 'react';
import { Proposal, ProposalFilters, ProposalSortOption, ProposalStatus, ProposalKpiSummary } from '../types';
import { proposalsApiService } from '../services/proposalsApiService';
import { ProposalsHeader } from '../components/ProposalsHeader';
import { ProposalsKpiCards } from '../components/ProposalsKpiCards';
import { ProposalsFilterCard } from '../components/ProposalsFilterCard';
import { ProposalsTable } from '../components/ProposalsTable';
import { CreateProposalModal } from '../components/CreateProposalModal';
import { ProposalDetailsModal } from '../components/ProposalDetailsModal';
import { ToastNotification, useToast } from '../../../components/ui/ToastNotification';

export const ProposalsPage: React.FC = () => {
  // 1. Proposals data states
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [allFilteredProposals, setAllFilteredProposals] = useState<Proposal[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState('15 Mar 2025, 10:30 AM');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Dynamic KPI summary state
  const [kpiSummary, setKpiSummary] = useState<ProposalKpiSummary>({
    totalProposals: 0,
    totalProposalsTrend: 12,
    pendingDecisions: 0,
    pendingDecisionsTrend: -8,
    approvedProposals: 0,
    approvedProposalsTrend: 18,
    totalProposalValue: 0,
    totalProposalValueTrend: 20,
  });

  // 3. Filter options
  const [ownerOptions, setOwnerOptions] = useState<string[]>(['All']);
  const [clientOptions, setClientOptions] = useState<string[]>(['All']);
  const [opportunityOptions, setOpportunityOptions] = useState<string[]>(['All']);
  const [serviceOptions, setServiceOptions] = useState<string[]>(['All']);

  // 4. Filter states
  const defaultFilters: ProposalFilters = {
    search: '',
    status: 'All',
    ownerId: 'All',
    clientId: 'All',
    opportunityId: 'All',
    serviceId: 'All',
    proposalDateRange: '',
    validUntilRange: '',
    expectedDecisionDateRange: '',
  };

  const [filters, setFilters] = useState<ProposalFilters>(defaultFilters);

  // 5. Sorting & Pagination states
  const [sortOption, setSortOption] = useState<ProposalSortOption>('date-newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 6. Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [nextProposalId, setNextProposalId] = useState<string>('P-2025-125');

  // 7. Designer Toast Notifications
  const { toasts, addToast, removeToast } = useToast();

  // Load filter options and next ID on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [opts, nextId] = await Promise.all([
          proposalsApiService.getFilterOptions(),
          proposalsApiService.getNextProposalId(),
        ]);
        setOwnerOptions(opts.owners);
        setClientOptions(opts.clients);
        setOpportunityOptions(opts.opportunities);
        setServiceOptions(opts.services);
        setNextProposalId(nextId);
      } catch (err) {
        console.warn('Metadata load notice:', err);
      }
    };
    loadMetadata();
  }, []);

  // Primary data query function through dedicated service layer
  const loadProposals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pageRes, allFiltered, kpis] = await Promise.all([
        proposalsApiService.getProposals({
          search: filters.search,
          status: filters.status,
          ownerId: filters.ownerId,
          clientId: filters.clientId,
          opportunityId: filters.opportunityId,
          serviceId: filters.serviceId,
          proposalDateRange: filters.proposalDateRange,
          validUntilRange: filters.validUntilRange,
          expectedDecisionDateRange: filters.expectedDecisionDateRange,
          sortOption,
          page: currentPage,
          size: pageSize,
        }),
        proposalsApiService.getAllFilteredProposals({
          search: filters.search,
          status: filters.status,
          ownerId: filters.ownerId,
          clientId: filters.clientId,
          opportunityId: filters.opportunityId,
          serviceId: filters.serviceId,
          proposalDateRange: filters.proposalDateRange,
          validUntilRange: filters.validUntilRange,
          expectedDecisionDateRange: filters.expectedDecisionDateRange,
          sortOption,
        }),
        proposalsApiService.getKpis(),
      ]);

      setProposals(pageRes.content);
      setTotalCount(pageRes.totalElements);
      setAllFilteredProposals(allFiltered);
      setKpiSummary(kpis);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch proposals.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortOption, currentPage, pageSize]);

  // Reactive effect when filters, sorting, or pagination change
  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  // Handle filter changes
  const handleFilterChange = (key: keyof ProposalFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    addToast('info', 'Filters Cleared', 'Reset to display all proposals.');
  };

  // Handle Export to CSV
  const handleExport = () => {
    const dataToExport = allFilteredProposals.length > 0 ? allFilteredProposals : proposals;
    proposalsApiService.exportToCsv(dataToExport);
    addToast('success', 'Export Completed', `Exported ${dataToExport.length} proposals to CSV.`);
  };

  // Handle Create Proposal with validation & persistence
  const handleCreateProposal = async (newProposal: Proposal) => {
    try {
      await proposalsApiService.createProposal({
        proposalId: newProposal.proposalId,
        opportunityId: newProposal.opportunityId,
        clientId: newProposal.clientId,
        clientName: newProposal.clientName,
        proposalDate: newProposal.proposalDate,
        validUntil: newProposal.validUntil,
        version: newProposal.version,
        title: newProposal.title,
        serviceId: newProposal.serviceId,
        serviceName: newProposal.serviceName,
        serviceBeforeTax: newProposal.serviceBeforeTax,
        taxAmount: newProposal.taxAmount,
        totalAmount: newProposal.totalAmount,
        ownerId: newProposal.ownerId,
        ownerName: newProposal.ownerName,
        status: newProposal.status,
        expectedDecisionDate: newProposal.expectedDecisionDate,
        description: newProposal.description,
      });

      addToast(
        'success',
        'Proposal Created',
        `${newProposal.title} (${newProposal.proposalId})`,
        newProposal.status
      );

      // Refresh proposal list, dynamic filter options, and next ID
      await loadProposals();
      const [opts, nextId] = await Promise.all([
        proposalsApiService.getFilterOptions(),
        proposalsApiService.getNextProposalId(),
      ]);
      setOwnerOptions(opts.owners);
      setClientOptions(opts.clients);
      setOpportunityOptions(opts.opportunities);
      setServiceOptions(opts.services);
      setNextProposalId(nextId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create proposal.';
      addToast('error', 'Creation Failed', msg);
    }
  };

  // Handle Refresh
  const handleRefresh = async () => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    setLastUpdated(formatted);
    await loadProposals();
    addToast('success', 'Data Refreshed', 'Proposal records synchronized and updated.');
  };

  // Handle Status Update (e.g. Approve, Reject, or status dropdown change)
  const handleUpdateStatus = async (proposalId: string, newStatus: ProposalStatus) => {
    try {
      const updated = await proposalsApiService.updateStatus(proposalId, newStatus);

      // Update state locally for instantaneous responsive feedback
      setProposals((prev) =>
        prev.map((p) => (p.proposalId === proposalId ? { ...p, status: newStatus } : p))
      );
      setAllFilteredProposals((prev) =>
        prev.map((p) => (p.proposalId === proposalId ? { ...p, status: newStatus } : p))
      );
      setSelectedProposal((prev) =>
        prev && prev.proposalId === proposalId ? { ...prev, status: newStatus } : prev
      );

      // Refresh KPIs to ensure counts remain strictly consistent
      const freshKpis = await proposalsApiService.getKpis();
      setKpiSummary(freshKpis);

      const isErr = newStatus === 'Rejected';
      const isSuccess = newStatus === 'Approved';
      const isWarning = newStatus === 'Pending';
      const toastType = isErr ? 'error' : isSuccess ? 'success' : isWarning ? 'warning' : 'info';
      const toastTitle = isErr ? 'Request Rejected' : isSuccess ? 'Request Approved' : 'Status Updated';

      addToast(
        toastType,
        toastTitle,
        `${updated.title} (${proposalId})`,
        newStatus
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update proposal status.';
      addToast('error', 'Status Update Failed', msg);
    }
  };

  const handleViewDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1850px] mx-auto min-h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top-Right Designer Toast Notification Popup */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} position="top-right" />

      {/* 1. Page Header */}
      <ProposalsHeader
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        onCreateProposal={() => setIsCreateModalOpen(true)}
      />

      {/* 2. Four KPI Cards */}
      <ProposalsKpiCards summary={kpiSummary} />

      {/* 3. Search and Filter Panel */}
      <ProposalsFilterCard
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        ownerOptions={ownerOptions}
        clientOptions={clientOptions}
        opportunityOptions={opportunityOptions}
        serviceOptions={serviceOptions}
      />

      {/* 4. Proposals Table with Horizontal Overflow and Pagination */}
      <ProposalsTable
        proposals={proposals}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        onExport={handleExport}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        isLoading={isLoading}
        error={error}
        onRetry={loadProposals}
        onClearFilters={handleClearFilters}
      />

      {/* 5. Create Proposal Modal */}
      <CreateProposalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProposal}
        nextId={nextProposalId}
      />

      {/* 6. Proposal Details Modal */}
      <ProposalDetailsModal
        isOpen={isDetailsModalOpen}
        proposal={selectedProposal}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProposal(null);
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
