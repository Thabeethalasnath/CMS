import React from 'react';
import { CreditCard, RotateCw, Download, Plus } from 'lucide-react';

interface PaymentsHeaderProps {
  lastUpdated?: string;
  isRefreshing?: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onRecordPayment: () => void;
}

export const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({
  lastUpdated = '15 Oct 2026, 11:30 AM',
  isRefreshing = false,
  onRefresh,
  onExport,
  onRecordPayment,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      {/* Title & Icon */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track and manage client payments, match with invoices and monitor payment status.
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-xs text-slate-500 mr-1">
          Last Updated: <span className="font-medium text-slate-700">{lastUpdated}</span>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50"
          title="Refresh payment records and metrics"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export</span>
        </button>

        {/* Record Payment Button */}
        <button
          type="button"
          onClick={onRecordPayment}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-semibold text-white shadow-sm shadow-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>
    </div>
  );
};

