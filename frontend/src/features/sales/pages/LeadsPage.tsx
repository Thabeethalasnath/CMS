import React, { useState, useEffect, useMemo } from 'react';
import { Users, RotateCw, Plus, Loader2 } from 'lucide-react';
import { Lead, LeadsFilterState, LeadSortOption } from '../types/leads';
import { leadsService } from '../services/leadsService';
import { LeadsMetricCards } from '../components/LeadsMetricCards';
import { LeadsFilterBar } from '../components/LeadsFilterBar';
import { LeadsTable } from '../components/LeadsTable';
import { AddLeadModal } from '../components/AddLeadModal';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { ToastNotification, ToastItem } from '../../../components/ui/ToastNotification';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('15 Mar 2025, 10:30 AM');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Quick Metric Filter (total, new, followups, converted)
  const [metricFilter, setMetricFilter] = useState<string | null>(null);

  // Filters State
  const initialFilterState: LeadsFilterState = {
    searchQuery: '',
    leadDateRange: '',
    source: 'All',
    serviceInterest: 'All',
    country: 'All',
    city: 'All',
    ownerId: 'All',
    stage: 'All',
    status: 'All',
    nextFollowUpDateRange: '',
  };

  const [filterState, setFilterState] = useState<LeadsFilterState>(initialFilterState);

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sortBy, setSortBy] = useState<LeadSortOption>('date-desc');

  // Toasts State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      timestamp: 'Just now',
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch leads from live database
  const loadLeadsFromDb = async (showToast = false) => {
    try {
      const data = await leadsService.getLeads();
      setLeads(data);
      if (showToast) {
        addToast('info', 'Leads Refreshed', 'Synchronized live records from Supabase database.');
      }
    } catch (err: any) {
      console.error('Failed to load leads from database:', err);
      addToast('error', 'Database Connection Error', 'Could not fetch records from the database.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeadsFromDb();
  }, []);

  // Metrics calculation directly from live database leads
  const metrics = useMemo(() => leadsService.getMetrics(leads), [leads]);

  // Handle Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const now = new Date();
    const timeStr =
      now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setLastRefreshed(timeStr);
    await loadLeadsFromDb(true);
  };

  // Filter Updates
  const handleFilterChange = (updates: Partial<LeadsFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterState(initialFilterState);
    setMetricFilter(null);
    setCurrentPage(1);
    addToast('info', 'Filters Reset', 'All filter options restored to default.');
  };

  // Filter & Sort Logic
  const filteredAndSortedLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Metric card quick filter
        if (metricFilter === 'new' && lead.stage !== 'New') return false;
        if (
          metricFilter === 'followups' &&
          lead.status !== 'Follow-up Required' &&
          lead.stage !== 'Contacted'
        )
          return false;
        if (
          metricFilter === 'converted' &&
          lead.stage !== 'Won' &&
          lead.status !== 'Converted'
        )
          return false;

        // Search Query filter
        if (filterState.searchQuery.trim()) {
          const q = filterState.searchQuery.toLowerCase();
          const match =
            lead.id.toLowerCase().includes(q) ||
            lead.company.toLowerCase().includes(q) ||
            lead.contactName.toLowerCase().includes(q) ||
            lead.email.toLowerCase().includes(q) ||
            lead.phone.toLowerCase().includes(q) ||
            lead.serviceInterest.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Dropdown filters
        if (filterState.source !== 'All' && lead.source !== filterState.source) return false;
        if (
          filterState.serviceInterest !== 'All' &&
          lead.serviceInterest !== filterState.serviceInterest
        )
          return false;
        if (filterState.country !== 'All' && lead.country !== filterState.country) return false;
        if (filterState.city !== 'All' && lead.city !== filterState.city) return false;
        if (filterState.ownerId !== 'All' && lead.ownerId !== filterState.ownerId) return false;
        if (filterState.stage !== 'All' && lead.stage !== filterState.stage) return false;
        if (filterState.status !== 'All' && lead.status !== filterState.status) return false;

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-desc':
            // L-2025-001 (15 Mar 2025) is the newest lead, down to L-2025-008 (11 Mar 2025)
            return a.id.localeCompare(b.id);
          case 'date-asc':
            return b.id.localeCompare(a.id);
          case 'company-asc':
            return a.company.localeCompare(b.company);
          case 'company-desc':
            return b.company.localeCompare(a.company);
          case 'contact-asc':
            return a.contactName.localeCompare(b.contactName);
          case 'id-desc':
            return b.id.localeCompare(a.id);
          default:
            return a.id.localeCompare(b.id);
        }
      });
  }, [leads, filterState, metricFilter, sortBy]);

  // Paginated Slice
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedLeads.slice(start, start + pageSize);
  }, [filteredAndSortedLeads, currentPage, pageSize]);

  // Handlers for Add, Update, Delete, Export (Live DB Operations)
  const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'leadDate'>) => {
    try {
      const created = await leadsService.addLead(newLeadData);
      setLeads((prev) => [created, ...prev]);
      addToast(
        'success',
        'Lead Created in Database',
        `${created.company} (${created.id}) saved to Supabase PostgreSQL.`
      );
    } catch (err: any) {
      addToast('error', 'Creation Failed', 'Could not insert new lead into database.');
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    try {
      const saved = await leadsService.updateLead(updatedLead);
      setLeads((prev) => prev.map((l) => (l.id === saved.id ? saved : l)));
      addToast(
        'success',
        'Lead Updated in Database',
        `Lead ${saved.id} (${saved.company}) updated in Supabase PostgreSQL.`
      );
    } catch (err: any) {
      addToast('error', 'Update Failed', 'Could not update lead in database.');
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const leadToDelete = leads.find((l) => l.id === id);
      await leadsService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      addToast(
        'error',
        'Lead Deleted from Database',
        leadToDelete
          ? `Lead ${leadToDelete.company} (${id}) deleted from database.`
          : `Lead ${id} deleted from database.`
      );
    } catch (err: any) {
      addToast('error', 'Delete Failed', 'Could not remove lead from database.');
    }
  };

  const handleExport = () => {
    leadsService.exportToCSV(filteredAndSortedLeads);
    addToast(
      'success',
      'Export Started',
      `Downloading ${filteredAndSortedLeads.length} database leads as CSV.`
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Page Title & Breadcrumb Row */}
      <div className="flex flex-row items-center justify-between flex-wrap gap-4 w-full">
        <div className="flex flex-row items-center gap-3">
          {/* Green Icon Badge matching Figma */}
          <div className="w-[39px] h-[39px] bg-[#ECFDF5] border border-[#D1FAE5] rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
            <Users size={20} className="text-[#059669]" />
          </div>

          <div className="flex flex-col items-start">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] leading-7">
              Leads
            </h1>
            <p className="text-xs text-[#64748B] leading-4 mt-0.5">
              Manage prospective customers, track sales progress, and monitor follow-ups.
            </p>
          </div>
        </div>

        {/* Right Actions: Last Updated + Add Lead Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-row items-center gap-2 text-xs text-[#64748B]">
            <span>
              Last Updated: <strong className="font-semibold text-slate-700">{lastRefreshed}</strong>
            </span>
            <button
              onClick={handleRefresh}
              className="p-1 rounded hover:bg-slate-200/60 text-[#2563EB] transition-colors cursor-pointer"
              title="Sync with database"
            >
              <RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98"
          >
            <Plus size={16} strokeWidth={2.4} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <LeadsMetricCards
        metrics={metrics}
        activeFilter={metricFilter}
        onSelectFilter={setMetricFilter}
      />

      {/* Search & Filter Bar */}
      <LeadsFilterBar
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Leads Table or Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-3 text-slate-500 shadow-sm">
          <Loader2 size={28} className="animate-spin text-indigo-600" />
          <span className="text-xs font-semibold">Loading live leads from Supabase PostgreSQL...</span>
        </div>
      ) : (
        <LeadsTable
          leads={paginatedLeads}
          totalCount={filteredAndSortedLeads.length}
          currentPage={currentPage}
          pageSize={pageSize}
          sortBy={sortBy}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          onSortChange={setSortBy}
          onViewLead={(lead) => setSelectedLead(lead)}
          onDeleteLead={handleDeleteLead}
          onExport={handleExport}
        />
      )}

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLead}
      />

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
        onUpdateLead={handleUpdateLead}
        onDeleteLead={handleDeleteLead}
      />

      {/* Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
