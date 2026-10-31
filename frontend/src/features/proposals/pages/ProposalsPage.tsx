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
import { ErrorBanner } from '../../../components/ui/ErrorBanner';

export const ProposalsPage: React.FC = () => {
  // 1. Proposals data states
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [allFilteredProposals, setAllFilteredProposals] = useState<Proposal[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState('—');
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
  const [isKpiLoading, setIsKpiLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Dynamic KPI summary state (starts null to show skeletons / real data)
  const [kpiSummary, setKpiSummary] = useState<ProposalKpiSummary | null>(null);

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
  const [nextProposalId, setNextProposalId] = useState<string>('');

  // 7. Designer Toast Notifications
  const { toasts, addToast, removeToast } = useToast();

  const updateTimestamp = () => {
    const now = new Date();
    setLastUpdated(
      `${now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    );
  };

  // Load filter options and next ID on mount
  const loadMetadata = useCallback(async () => {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load filter metadata.';
      setError(msg);
    }
  }, []);

  // Dedicated KPI loader so filter resets and table filtering do not flash or refresh KPI cards
  const loadKpis = useCallback(async () => {
    setIsKpiLoading(true);
    try {
      const kpis = await proposalsApiService.getKpis();
      setKpiSummary(kpis);
    } catch (err: unknown) {
      console.warn('Failed to load proposal KPIs:', err);
    } finally {
      setIsKpiLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetadata();
    loadKpis();
  }, [loadMetadata, loadKpis]);

  // Primary data query function through dedicated service layer (table data only)
  const loadProposals = useCallback(async () => {
    setIsTableLoading(true);
    setError(null);
    try {
      const [pageRes, allFiltered] = await Promise.all([
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
      ]);

      setProposals(pageRes.content);
      setTotalCount(pageRes.totalElements);
      setAllFilteredProposals(allFiltered);
      updateTimestamp();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch proposals.';
      setError(msg);
    } finally {
      setIsTableLoading(false);
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

      setIsCreateModalOpen(false);
      await Promise.all([loadProposals(), loadKpis(), loadMetadata()]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create proposal.';
      addToast('error', 'Creation Failed', msg);
    }
  };

  // Handle Refresh
  const handleRefresh = async () => {
    await Promise.all([loadProposals(), loadKpis(), loadMetadata()]);
    addToast('success', 'Data Refreshed', 'Proposal records synchronized and updated.');
  };

  // Handle Status Update with optimistic rollback
  const handleUpdateStatus = async (proposalId: string, newStatus: ProposalStatus) => {
    const previousProposals = [...proposals];
    const previousFiltered = [...allFilteredProposals];
    const previousSelected = selectedProposal;
    const previousKpis = kpiSummary;

    // Optimistically update
    setProposals((prev) =>
      prev.map((p) => (p.proposalId === proposalId ? { ...p, status: newStatus } : p))
    );
    setAllFilteredProposals((prev) =>
      prev.map((p) => (p.proposalId === proposalId ? { ...p, status: newStatus } : p))
    );
    setSelectedProposal((prev) =>
      prev && prev.proposalId === proposalId ? { ...prev, status: newStatus } : prev
    );

    try {
      const updated = await proposalsApiService.updateStatus(proposalId, newStatus);
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
      // Rollback on failure
      setProposals(previousProposals);
      setAllFilteredProposals(previousFiltered);
      setSelectedProposal(previousSelected);
      setKpiSummary(previousKpis);

      const msg = err instanceof Error ? err.message : 'Failed to update proposal status.';
      addToast('error', 'Status Update Failed', msg);
    }
  };

  // Handle Delete Proposal with optimistic rollback
  const handleDeleteProposal = async (proposalId: string) => {
    const previousProposals = [...proposals];
    const previousFiltered = [...allFilteredProposals];
    const previousTotal = totalCount;

    setProposals((prev) => prev.filter((p) => p.proposalId !== proposalId));
    setAllFilteredProposals((prev) => prev.filter((p) => p.proposalId !== proposalId));
    setTotalCount((prev) => Math.max(0, prev - 1));

    try {
      await proposalsApiService.deleteProposal(proposalId);
      addToast('success', 'Proposal Deleted', `Proposal ${proposalId} removed successfully.`);
      setIsDetailsModalOpen(false);
      setSelectedProposal(null);
      const freshKpis = await proposalsApiService.getKpis();
      setKpiSummary(freshKpis);
      loadMetadata();
    } catch (err: unknown) {
      setProposals(previousProposals);
      setAllFilteredProposals(previousFiltered);
      setTotalCount(previousTotal);

      const msg = err instanceof Error ? err.message : 'Failed to delete proposal.';
      addToast('error', 'Delete Failed', msg);
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

      {/* Error Banner when initial query or load fails */}
      {error && !isTableLoading && (
        <div className="mb-6">
          <ErrorBanner
            title="Failed to Load Proposals"
            message={error}
            onRetry={loadProposals}
          />
        </div>
      )}

      {/* 2. Four KPI Cards */}
      <ProposalsKpiCards summary={kpiSummary} isLoading={isKpiLoading} />

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
        isLoading={isTableLoading}
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
        onDelete={handleDeleteProposal}
      />
    </div>
  );
};
