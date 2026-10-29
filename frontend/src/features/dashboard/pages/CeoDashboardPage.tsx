import React, { useState, useEffect } from 'react';
import { Crown, RotateCw } from 'lucide-react';
import { FullDashboardData } from '../../../types/dashboard';
import { initialDashboardData } from '../../../constants/initialDashboardData';
import { dashboardService } from '../../../services/dashboardService';
import { KpiCardsGrid } from '../../../components/dashboard/KpiCardsGrid';
import { FinanceOverviewSection } from '../../../components/dashboard/FinanceOverviewSection';
import { SalesDeliverySection } from '../../../components/dashboard/SalesDeliverySection';
import { PeopleOverviewSection } from '../../../components/dashboard/PeopleOverviewSection';
import { ManagementAlertsSection } from '../../../components/dashboard/ManagementAlertsSection';
import { EditDataModal } from '../../../components/dashboard/EditDataModal';

interface CeoDashboardPageProps {
  dateRange: string;
  isEditModalOpen: boolean;
  onCloseEditModal: () => void;
}

export const CeoDashboardPage: React.FC<CeoDashboardPageProps> = ({
  isEditModalOpen,
  onCloseEditModal
}) => {
  const [data, setData] = useState<FullDashboardData>(initialDashboardData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('15 Mar 2025, 10:30 AM');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const fetched = await dashboardService.getDashboardData();
      setData(fetched);
      if (fetched.settings?.last_updated) {
        setLastRefreshed(fetched.settings.last_updated);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr =
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setLastRefreshed(timeStr);
      loadData();
    }, 400);
  };

  const handleSaveData = async (updated: FullDashboardData) => {
    setData(updated);
    await dashboardService.saveDashboardData(updated);
  };

  const handleUpdateAlertCount = async (alertId: number, delta: number) => {
    const updated = await dashboardService.updateAlertCount(alertId, delta);
    setData(updated);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-5 max-w-[1400px] mx-auto w-full">
      {/* Page Title Row: Crown icon, "CEO Dashboard", subtitle, and "Last Updated" */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
            <Crown size={20} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {data.settings.dashboard_title || 'CEO Dashboard'}
            </h1>
            <p className="text-xs text-slate-500">
              {data.settings.dashboard_subtitle ||
                'Executive view of business performance across Finance, Sales, Delivery, People and Risk.'}
            </p>
          </div>
        </div>

        {/* Last Updated Action */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>
            Last Updated: <strong className="text-slate-700 font-semibold">{lastRefreshed}</strong>
          </span>
          <button
            onClick={handleManualRefresh}
            className="p-1.5 rounded-md hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors"
            title="Refresh dashboard data"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* A. KPI Cards (Two rows of 5 on desktop, responsive to 2 -> 1) */}
      <KpiCardsGrid cards={data.kpis} />

      {/* B. Finance Overview Section (4 panels) */}
      <FinanceOverviewSection
        monthlyData={data.finance_monthly}
        expenseBreakdown={data.expense_breakdown}
      />

      {/* C. Sales & Delivery Overview Section (2 panels) */}
      <SalesDeliverySection
        pipelineStages={data.sales_pipeline}
        projectStatuses={data.project_status}
      />

      {/* D. People Overview Section (3 panels) */}
      <PeopleOverviewSection
        monthlyData={data.people_monthly}
        summary={data.people_summary}
      />

      {/* E. Management Alerts Section (10 rows table) */}
      <ManagementAlertsSection
        alerts={data.alerts}
        onUpdateAlertCount={handleUpdateAlertCount}
      />

      {/* Interactive Edit Modal */}
      <EditDataModal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        dashboardData={data}
        onSaveData={handleSaveData}
      />
    </div>
  );
};
