import React, { useState, useEffect } from 'react';
import { FileCheck, RotateCw } from 'lucide-react';
import { approvalsService, AllApprovalsData } from '../../../services/approvalsService';
import { ApprovalMetricCards } from '../../../components/approvals/ApprovalMetricCards';
import { EmployeeApprovalsSection } from '../../../components/approvals/EmployeeApprovalsSection';
import { ClientApprovalsSection } from '../../../components/approvals/ClientApprovalsSection';
import { TicketsAssetsApprovalsSection } from '../../../components/approvals/TicketsAssetsApprovalsSection';
import { ApprovalDetailModal, DetailItemType } from '../../../components/approvals/ApprovalDetailModal';
import { AddEmployeeApprovalModal } from '../../../components/approvals/AddEmployeeApprovalModal';
import { AddClientApprovalModal } from '../../../components/approvals/AddClientApprovalModal';
import { ToastNotification, ToastItem } from '../../../components/ui/ToastNotification';
import { ApprovalStatus } from '../../../types/approvals';

export const ApprovalInboxPage: React.FC = () => {
  const [data, setData] = useState<AllApprovalsData>(approvalsService.getApprovalsData());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('15 Mar 2025, 10:30 AM');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    statusBadge?: string
  ) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      statusBadge,
      timestamp: 'Just now'
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals state
  const [detailItem, setDetailItem] = useState<DetailItemType | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  useEffect(() => {
    // Initial load
    const fresh = approvalsService.getApprovalsData();
    setData(fresh);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr =
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setLastRefreshed(timeStr);
      setData(approvalsService.getApprovalsData());
      setIsRefreshing(false);
      addToast('info', 'Data Refreshed', 'Approval records are up-to-date.');
    }, 450);
  };

  const handleUpdateStatus = (
    type: 'employee' | 'client' | 'ticketAsset',
    id: number,
    status: ApprovalStatus
  ) => {
    let nameOrCode = '';
    let prevStatus = 'Pending';

    if (type === 'employee') {
      const item = data.employees.find((e) => e.id === id);
      prevStatus = item?.status || 'Pending';
      nameOrCode = item ? `${item.employee_name} (${item.employee_code})` : 'Employee request';
      const updated = approvalsService.updateEmployeeStatus(id, status);
      setData(updated);
    } else if (type === 'client') {
      const item = data.clients.find((c) => c.id === id);
      prevStatus = item?.status || 'Pending';
      nameOrCode = item ? `${item.client_name} (${item.approval_id})` : 'Client request';
      const updated = approvalsService.updateClientStatus(id, status);
      setData(updated);
    } else if (type === 'ticketAsset') {
      const item = data.ticketsAssets.find((t) => t.id === id);
      prevStatus = item?.status || 'Pending';
      nameOrCode = item ? `${item.title} (${item.approval_id})` : 'Ticket / Asset request';
      const updated = approvalsService.updateTicketAssetStatus(id, status);
      setData(updated);
    }

    // Trigger refined Notification at top-right below navbar
    const toastType = status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'warning';
    const title = status === 'Approved' ? 'Request Approved' : status === 'Rejected' ? 'Request Rejected' : 'Marked as Pending';
    addToast(
      toastType,
      title,
      nameOrCode,
      status
    );
  };

  const handleAddEmployeeRequest = (
    req: Parameters<typeof approvalsService.addEmployeeRequest>[0]
  ) => {
    const updated = approvalsService.addEmployeeRequest(req);
    setData(updated);
    addToast('success', 'Leave Request Created', `${req.employee_name} request submitted as Pending.`);
  };

  const handleAddClientRequest = (
    req: Parameters<typeof approvalsService.addClientRequest>[0]
  ) => {
    const updated = approvalsService.addClientRequest(req);
    setData(updated);
    addToast('success', 'Client Approval Created', `${req.client_name} request submitted as Pending.`);
  };

  // Optional top-level filter by status (All, Pending, Approved, Rejected)
  const filteredEmployees = selectedStatusFilter && selectedStatusFilter !== 'all'
    ? data.employees.filter((e) => e.status === selectedStatusFilter)
    : data.employees;

  const filteredClients = selectedStatusFilter && selectedStatusFilter !== 'all'
    ? data.clients.filter((c) => c.status === selectedStatusFilter)
    : data.clients;

  const filteredTicketsAssets = selectedStatusFilter && selectedStatusFilter !== 'all'
    ? data.ticketsAssets.filter((t) => t.status === selectedStatusFilter)
    : data.ticketsAssets;

  return (
    <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Page Title & Breadcrumb Row */}
      <div className="flex flex-row items-center justify-between flex-wrap gap-4 w-full">
        <div className="flex flex-row items-center gap-3">
          {/* Amber Icon Badge */}
          <div className="box-border flex flex-row items-center justify-center w-9 h-9 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg shrink-0">
            <FileCheck size={20} className="text-[#F59E0B]" />
          </div>

          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A] leading-7">
              Approval Inbox
            </h1>
            <p className="text-xs text-[#64748B] leading-4">
              Review and manage employee, client and ticket / asset approval requests.
            </p>
          </div>
        </div>

        {/* Last Updated Timestamp + Refresh */}
        <div className="flex flex-row items-center gap-2 text-xs text-[#64748B]">
          <span>
            Last Updated: <strong className="font-semibold text-slate-700">{lastRefreshed}</strong>
          </span>
          <button
            onClick={handleManualRefresh}
            className="p-1 rounded hover:bg-slate-200/60 text-[#2563EB] transition-colors"
            title="Refresh inbox data"
          >
            <RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <ApprovalMetricCards
        summary={data.summary}
        selectedFilter={selectedStatusFilter}
        onSelectFilter={setSelectedStatusFilter}
      />

      {/* Section 1: Employee Approvals */}
      <EmployeeApprovalsSection
        approvals={filteredEmployees}
        onOpenAddModal={() => setIsAddEmployeeOpen(true)}
        onViewDetails={(item) => setDetailItem(item)}
        onUpdateStatus={(id, status) => handleUpdateStatus('employee', id, status)}
      />

      {/* Section 2: Client Approvals */}
      <ClientApprovalsSection
        approvals={filteredClients}
        onOpenAddModal={() => setIsAddClientOpen(true)}
        onViewDetails={(item) => setDetailItem(item)}
        onUpdateStatus={(id, status) => handleUpdateStatus('client', id, status)}
      />

      {/* Section 3: Tickets & Assets Approvals */}
      <TicketsAssetsApprovalsSection
        approvals={filteredTicketsAssets}
        onViewDetails={(item) => setDetailItem(item)}
        onUpdateStatus={(id, status) => handleUpdateStatus('ticketAsset', id, status)}
      />

      {/* Detail / Action Modal */}
      <ApprovalDetailModal
        item={detailItem}
        isOpen={detailItem !== null}
        onClose={() => setDetailItem(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Add Employee Leave / WFH Modal */}
      <AddEmployeeApprovalModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSubmit={handleAddEmployeeRequest}
      />

      {/* Add Client Approval Modal */}
      <AddClientApprovalModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSubmit={handleAddClientRequest}
      />

      {/* Top-Right Notification Toast */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
