import React, { useState, useMemo, useEffect } from 'react';
import {
  INITIAL_INVOICES,
  INITIAL_KPIS,
  AGEING_CHART_DATA,
  INITIAL_PAYMENTS,
} from '../mockData';
import { Invoice, PaymentRecord, CollectionStatus, KpiSummary, AgeingChartItem, StatusDistributionItem } from '../types';
import { exportInvoicesToCsv, formatRupee } from '../utils';

import { CollectionsHeader } from '../components/CollectionsHeader';
import { CollectionsKpiCards } from '../components/CollectionsKpiCards';
import { LiveManagementChecks } from '../components/LiveManagementChecks';
import { ReceivablesAgeingChart } from '../components/ReceivablesAgeingChart';
import { CollectionStatusChart } from '../components/CollectionStatusChart';
import { InvoicesTableSection } from '../components/InvoicesTableSection';
import { InvoiceDetailsCard } from '../components/InvoiceDetailsCard';

import { LogPaymentModal } from '../components/LogPaymentModal';
import { SendReminderModal } from '../components/SendReminderModal';
import { PaymentHistoryModal } from '../components/PaymentHistoryModal';
import { ViewInvoiceModal } from '../components/ViewInvoiceModal';
import { CallEmailModal } from '../components/CallEmailModal';

import { collectionsApiService } from '../services/collectionsApiService';
import { ToastNotification, useToast } from '../../../components/ui/ToastNotification';

export const CollectionsPage: React.FC = () => {
  // Main Data States
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(INITIAL_INVOICES[0]);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);

  // Live Backend Data States
  const [backendKpis, setBackendKpis] = useState<KpiSummary | null>(null);
  const [backendAgeing, setBackendAgeing] = useState<AgeingChartItem[] | null>(null);
  const [backendStatusDist, setBackendStatusDist] = useState<StatusDistributionItem[] | null>(null);

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');

  // Modals Visibility
  const [isLogPaymentOpen, setIsLogPaymentOpen] = useState(false);
  const [isSendReminderOpen, setIsSendReminderOpen] = useState(false);
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [isViewInvoiceOpen, setIsViewInvoiceOpen] = useState(false);
  const [isCallEmailOpen, setIsCallEmailOpen] = useState(false);

  // Designer Toast Notifications
  const { toasts, addToast, removeToast } = useToast();
  const [lastUpdated, setLastUpdated] = useState('15 Mar 2025, 10:30 AM');

  const handleRefreshCollections = async () => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    setLastUpdated(formatted);
    await refreshBackendData();
    addToast('success', 'Records Refreshed', 'Collections data synchronized with database.');
  };

  // Live Management Checks filter click
  const handleSelectLiveCategory = (status: CollectionStatus) => {
    setStatusFilter(status);
    const tableElement = document.getElementById('invoices-receivables-section');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Set of initial invoice IDs to isolate dynamically logged records
  const initialIds = useMemo(() => new Set(INITIAL_INVOICES.map((i) => i.id)), []);

  // Invoices newly added via Log Payment in this session
  const newlyAddedInvoices = useMemo(
    () => invoices.filter((inv) => !initialIds.has(inv.id)),
    [invoices, initialIds]
  );

  // Dynamic KPIs derived from dataset
  const dynamicKpis: KpiSummary = useMemo(() => {
    let addOutstanding = 0;
    let addOutstandingCount = 0;
    let addOverdueAmount = 0;
    let addOverdueCount = 0;
    let addDueSoonAmount = 0;
    let addDueSoonCount = 0;

    newlyAddedInvoices.forEach((inv) => {
      if (inv.outstanding > 0) {
        addOutstanding += inv.outstanding;
        addOutstandingCount += 1;
      }
      if (inv.status === 'Overdue') {
        addOverdueAmount += inv.outstanding;
        addOverdueCount += 1;
      } else if (inv.status === 'Due Soon') {
        addDueSoonAmount += inv.outstanding;
        addDueSoonCount += 1;
      }
    });

    return {
      totalOutstanding: {
        amount: INITIAL_KPIS.totalOutstanding.amount + addOutstanding,
        count: INITIAL_KPIS.totalOutstanding.count + addOutstandingCount,
        trendPct: INITIAL_KPIS.totalOutstanding.trendPct,
      },
      overdueAmount: {
        amount: INITIAL_KPIS.overdueAmount.amount + addOverdueAmount,
        count: INITIAL_KPIS.overdueAmount.count + addOverdueCount,
        trendPct: INITIAL_KPIS.overdueAmount.trendPct,
      },
      dueSoon: {
        count: INITIAL_KPIS.dueSoon.count + addDueSoonCount,
        amount: INITIAL_KPIS.dueSoon.amount + addDueSoonAmount,
        trendPct: INITIAL_KPIS.dueSoon.trendPct,
      },
      collectedThisMonth: INITIAL_KPIS.collectedThisMonth,
    };
  }, [newlyAddedInvoices]);

  // Dynamic Ageing Chart Data
  const dynamicAgeingData: AgeingChartItem[] = useMemo(() => {
    const map = new Map(AGEING_CHART_DATA.map((item) => [item.bucket, { ...item }]));

    newlyAddedInvoices.forEach((inv) => {
      const bucket = map.get(inv.ageingBucket);
      if (bucket && inv.outstanding > 0) {
        bucket.amount += inv.outstanding;
        bucket.count += 1;
      }
    });

    return Array.from(map.values());
  }, [newlyAddedInvoices]);

  // Dynamic Status Distribution
  const dynamicStatusDistribution: StatusDistributionItem[] = useMemo(() => {
    const counts: Record<CollectionStatus, number> = {
      Paid: 12,
      'Partially Paid': 8,
      'Due Soon': 8,
      Overdue: 12,
      Open: 4,
    };

    newlyAddedInvoices.forEach((inv) => {
      if (counts[inv.status] !== undefined) {
        counts[inv.status] += 1;
      } else {
        counts.Open += 1;
      }
    });

    const total = 36 + newlyAddedInvoices.length;

    return [
      { status: 'Paid', count: counts.Paid, percentage: Math.round((counts.Paid / total) * 100), color: '#10B981' },
      { status: 'Partially Paid', count: counts['Partially Paid'], percentage: Math.round((counts['Partially Paid'] / total) * 100), color: '#38BDF8' },
      { status: 'Due Soon', count: counts['Due Soon'], percentage: Math.round((counts['Due Soon'] / total) * 100), color: '#FBBF24' },
      { status: 'Overdue', count: counts.Overdue, percentage: Math.round((counts.Overdue / total) * 100), color: '#F97316' },
      { status: 'Open', count: counts.Open, percentage: Math.round((counts.Open / total) * 100), color: '#EF4444' },
    ];
  }, [newlyAddedInvoices]);

  // Dynamic Insights
  const dynamicInsights = useMemo(() => {
    const overdueCount = 12 + newlyAddedInvoices.filter((i) => i.status === 'Overdue').length;
    const dueSoonCount = 8 + newlyAddedInvoices.filter((i) => i.status === 'Due Soon').length;
    const partiallyPaidCount = 8 + newlyAddedInvoices.filter((i) => i.status === 'Partially Paid').length;
    const total = 36 + newlyAddedInvoices.length;
    const partiallyPaidPct = Math.round((partiallyPaidCount / total) * 100);

    const totalOutstanding =
      INITIAL_KPIS.totalOutstanding.amount +
      newlyAddedInvoices.reduce((acc, i) => acc + (i.outstanding > 0 ? i.outstanding : 0), 0);
    const totalOutstandingInvoices =
      INITIAL_KPIS.totalOutstanding.count +
      newlyAddedInvoices.filter((i) => i.outstanding > 0).length;

    const avgOutstanding =
      totalOutstandingInvoices > 0 ? Math.round(totalOutstanding / totalOutstandingInvoices) : 78889;

    return [
      {
        id: '1',
        highlight: `${overdueCount} invoices`,
        text: ' are overdue and need immediate follow-up.',
      },
      {
        id: '2',
        highlight: `${dueSoonCount} invoices`,
        text: ' are due within the next 30 days.',
      },
      {
        id: '3',
        prefix: 'Partially paid invoices account for ',
        highlight: `${partiallyPaidPct}%`,
        text: ' of total invoices.',
      },
      {
        id: '4',
        prefix: 'Average outstanding per invoice: ',
        highlight: `${formatRupee(avgOutstanding)}.`,
        text: '',
      },
    ];
  }, [newlyAddedInvoices]);

  // Fetch live collections data from Spring Boot backend on mount
  const refreshBackendData = async () => {
    try {
      const [invRes, kpiRes, ageingRes, statusRes] = await Promise.allSettled([
        collectionsApiService.getInvoices({ size: 100 }),
        collectionsApiService.getKpis(),
        collectionsApiService.getAgeingChart(),
        collectionsApiService.getStatusDistribution(),
      ]);

      if (invRes.status === 'fulfilled' && invRes.value?.content && invRes.value.content.length > 0) {
        setInvoices(invRes.value.content);
        setSelectedInvoice((prev) => {
          if (!prev || prev.id === INITIAL_INVOICES[0]?.id) {
            return invRes.value.content[0];
          }
          const match = invRes.value.content.find((i: Invoice) => i.id === prev.id);
          return match || invRes.value.content[0];
        });
      }

      if (kpiRes.status === 'fulfilled' && kpiRes.value) {
        setBackendKpis(kpiRes.value);
      }

      if (ageingRes.status === 'fulfilled' && ageingRes.value) {
        setBackendAgeing(ageingRes.value);
      }

      if (statusRes.status === 'fulfilled' && statusRes.value) {
        setBackendStatusDist(statusRes.value);
      }
    } catch (err) {
      console.warn('Backend API connection notice, running with local data:', err);
    }
  };

  useEffect(() => {
    refreshBackendData();
  }, []);

  // Fetch payments whenever selected invoice changes
  useEffect(() => {
    if (selectedInvoice?.id) {
      collectionsApiService.getPayments(selectedInvoice.id)
        .then((records) => {
          if (records && records.length > 0) {
            setPayments(records);
          }
        })
        .catch(() => {});
    }
  }, [selectedInvoice?.id, isPaymentHistoryOpen]);

  // Handler to add a new manual invoice via Log Payment Modal
  const handleSaveInvoice = async (newInvoice: Invoice) => {
    const cleanInvoiceId = newInvoice.id.trim().toUpperCase();
    try {
      // Create the invoice via backend API with autoAssignIfTaken protection
      const saved = await collectionsApiService.createInvoice({
        invoiceId: cleanInvoiceId,
        clientId: newInvoice.clientId,
        client: newInvoice.client,
        invoiceDate: newInvoice.invoiceDate,
        dueDate: newInvoice.dueDate,
        outstanding: newInvoice.outstanding,
        statusOverride: newInvoice.status,
        autoAssignIfTaken: true,
      });

      if (saved.id !== cleanInvoiceId && cleanInvoiceId !== '') {
        addToast(
          'success',
          'Invoice Recorded',
          `Assigned ID ${saved.id} (${saved.client})`,
          'Paid'
        );
      } else {
        addToast(
          'success',
          'Invoice Recorded',
          `Invoice ${saved.id} (${saved.client}) saved to database.`,
          'Paid'
        );
      }

      // Update invoices with the saved record at row 1 immediately
      setInvoices((prev) => [saved, ...prev.filter((i) => i.id !== saved.id && i.id !== newInvoice.id)]);
      setSelectedInvoice(saved);
      setStatusFilter('All Statuses');

      // Re-fetch backend data to guarantee 100% sync with database
      await refreshBackendData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as any)?.message || 'Failed to save to database';
      addToast('error', 'Request Failed', msg, 'Rejected');
      throw err;
    }
  };

  // Handler to update an invoice's status from table status dropdown
  const handleUpdateStatus = async (invoiceId: string, newStatus: CollectionStatus) => {
    // Optimistic local state update
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;

        const updated: Invoice = { ...inv, status: newStatus };

        if (newStatus === 'Paid') {
          updated.outstanding = 0;
          updated.amountPaid = inv.invoiceAmount;
          updated.daysOverdue = null;
          updated.ageingBucket = 'Current';
          updated.recommendedAction = 'Receipt Issued';
        } else if (newStatus === 'Overdue') {
          updated.daysOverdue = inv.daysOverdue && inv.daysOverdue > 0 ? inv.daysOverdue : 30;
          updated.ageingBucket = inv.ageingBucket === 'Current' ? '1–30 days' : inv.ageingBucket;
          updated.recommendedAction = 'Call + Email client';
          if (updated.outstanding === 0) {
            updated.outstanding = inv.invoiceAmount;
            updated.amountPaid = 0;
          }
        } else if (newStatus === 'Due Soon') {
          updated.daysOverdue = null;
          updated.ageingBucket = '1–30 days';
          updated.recommendedAction = 'Send Reminder';
          if (updated.outstanding === 0) {
            updated.outstanding = inv.invoiceAmount;
            updated.amountPaid = 0;
          }
        } else if (newStatus === 'Partially Paid') {
          if (updated.outstanding === 0 || updated.amountPaid === 0) {
            updated.amountPaid = Math.round(inv.invoiceAmount / 2);
            updated.outstanding = inv.invoiceAmount - updated.amountPaid;
          }
          updated.recommendedAction = 'Send Reminder';
        } else if (newStatus === 'Open') {
          updated.daysOverdue = null;
          updated.ageingBucket = 'Current';
          updated.recommendedAction = 'Monitor';
          if (updated.outstanding === 0) {
            updated.outstanding = inv.invoiceAmount;
            updated.amountPaid = 0;
          }
        }

        return updated;
      })
    );

    setSelectedInvoice((prev) => {
      if (prev.id !== invoiceId) return prev;
      const updated: Invoice = { ...prev, status: newStatus };
      if (newStatus === 'Paid') {
        updated.outstanding = 0;
        updated.amountPaid = prev.invoiceAmount;
        updated.daysOverdue = null;
        updated.ageingBucket = 'Current';
        updated.recommendedAction = 'Receipt Issued';
      }
      return updated;
    });

    try {
      const updated = await collectionsApiService.updateStatus(invoiceId, newStatus);
      setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setSelectedInvoice((prev) => (prev.id === updated.id ? updated : prev));

      const isErr = newStatus === 'Overdue';
      const isSuccess = newStatus === 'Paid';
      const isWarning = newStatus === 'Due Soon';
      const toastType = isErr ? 'error' : isSuccess ? 'success' : isWarning ? 'warning' : 'info';
      const toastTitle = isErr
        ? 'Request Overdue'
        : isSuccess
        ? 'Payment Completed'
        : isWarning
        ? 'Due Soon Notice'
        : 'Status Updated';

      addToast(
        toastType,
        toastTitle,
        `Invoice ${invoiceId} marked as ${newStatus}.`,
        newStatus
      );

      // Refresh KPIs and charts from live backend
      collectionsApiService.getKpis().then(setBackendKpis).catch(() => {});
      collectionsApiService.getAgeingChart().then(setBackendAgeing).catch(() => {});
      collectionsApiService.getStatusDistribution().then(setBackendStatusDist).catch(() => {});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as any)?.message || 'Status update failed';
      addToast('error', 'Update Failed', msg, 'Rejected');
    }
  };

  const handleExportAll = () => {
    exportInvoicesToCsv('all_collections_invoices', invoices);
    addToast('success', 'Export Completed', 'Exported all collections invoices to CSV.');
  };

  return (
    <div
      style={{
        padding: '24px 32px 60px 32px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Top-Right Designer Toast Notification Popup */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} position="top-right" />

      {/* 1. Page Header */}
      <CollectionsHeader
        lastUpdated={lastUpdated}
        onRefresh={handleRefreshCollections}
        onLogPayment={() => setIsLogPaymentOpen(true)}
        onExport={handleExportAll}
      />

      {/* 2. KPI Summary Cards (4 Cards) */}
      <CollectionsKpiCards kpis={backendKpis || dynamicKpis} />

      {/* 3. Live Management Checks (2 Alert Cards) */}
      <LiveManagementChecks
        overdueCount={(backendKpis || dynamicKpis).overdueAmount.count}
        dueSoonCount={(backendKpis || dynamicKpis).dueSoon.count}
        onSelectCategory={handleSelectLiveCategory}
      />

      {/* 4. Charts Section: Receivables Ageing & Collection Status (Side-by-side) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
          alignItems: 'stretch',
        }}
      >
        <ReceivablesAgeingChart data={backendAgeing || dynamicAgeingData} />
        <CollectionStatusChart
          distribution={backendStatusDist || dynamicStatusDistribution}
          insights={dynamicInsights}
          totalCount={invoices.length}
        />
      </div>

      {/* 5. Search & Filters with Invoices & Receivables Table */}
      <div id="invoices-receivables-section">
        <InvoicesTableSection
          invoices={invoices}
          selectedInvoiceId={selectedInvoice.id}
          onSelectInvoice={(inv) => setSelectedInvoice(inv)}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onUpdateStatus={handleUpdateStatus}
          onCallEmail={(inv) => {
            setSelectedInvoice(inv);
            setIsCallEmailOpen(true);
          }}
          onSendReminder={(inv) => {
            setSelectedInvoice(inv);
            setIsSendReminderOpen(true);
          }}
          onViewInvoice={(inv) => {
            setSelectedInvoice(inv);
            setIsViewInvoiceOpen(true);
          }}
          onPaymentHistory={(inv) => {
            setSelectedInvoice(inv);
            setIsPaymentHistoryOpen(true);
          }}
        />
      </div>

      {/* 6. Invoice Details Section */}
      <InvoiceDetailsCard
        invoice={selectedInvoice}
        onLogPayment={() => setIsLogPaymentOpen(true)}
        onCallEmail={() => setIsCallEmailOpen(true)}
        onSendReminder={() => setIsSendReminderOpen(true)}
        onViewHistory={() => setIsPaymentHistoryOpen(true)}
        onViewInvoice={() => setIsViewInvoiceOpen(true)}
      />

      {/* Modals */}
      <LogPaymentModal
        isOpen={isLogPaymentOpen}
        onClose={() => setIsLogPaymentOpen(false)}
        onSaveInvoice={handleSaveInvoice}
      />

      <SendReminderModal
        isOpen={isSendReminderOpen}
        invoice={selectedInvoice}
        onClose={() => setIsSendReminderOpen(false)}
        onConfirm={() =>
          addToast(
            'warning',
            'Reminder Delivered',
            `Payment reminder sent to ${selectedInvoice.client} (${selectedInvoice.id}).`,
            'Pending'
          )
        }
      />

      <PaymentHistoryModal
        isOpen={isPaymentHistoryOpen}
        invoice={selectedInvoice}
        payments={payments}
        onClose={() => setIsPaymentHistoryOpen(false)}
        onOpenLogPayment={() => setIsLogPaymentOpen(true)}
      />

      <ViewInvoiceModal
        isOpen={isViewInvoiceOpen}
        invoice={selectedInvoice}
        onClose={() => setIsViewInvoiceOpen(false)}
      />

      <CallEmailModal
        isOpen={isCallEmailOpen}
        invoice={selectedInvoice}
        onClose={() => setIsCallEmailOpen(false)}
      />
    </div>
  );
};
