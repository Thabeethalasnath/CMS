import React, { useState } from 'react';
import { FileSpreadsheet, ChevronDown } from 'lucide-react';
import { FinanceMonthlyRecord, ExpenseBreakdownItem } from '../../types/dashboard';
import { UniversalBarChart } from '../charts/UniversalBarChart';
import { UniversalAreaLineChart } from '../charts/UniversalAreaLineChart';
import { UniversalDonutChart } from '../charts/UniversalDonutChart';

interface FinanceOverviewSectionProps {
  monthlyData?: FinanceMonthlyRecord[];
  expenseBreakdown?: ExpenseBreakdownItem[];
}

export const FinanceOverviewSection: React.FC<FinanceOverviewSectionProps> = ({
  monthlyData = [],
  expenseBreakdown = []
}) => {
  const [period, setPeriod] = useState('Last 6 Months');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const formatLakhs = (val: number) => {
    return `₹ ${(val / 100000).toFixed(1)}L`;
  };

  const safeMonthly = monthlyData || [];
  const safeExpense = expenseBreakdown || [];

  const invoiceVsCollectionsData = safeMonthly.map((d) => ({
    label: d.month_name,
    invoice: d.invoice_value,
    collected: d.collected_payments
  }));

  const expensesData = safeMonthly.map((d) => ({
    label: d.month_name,
    expense: d.expenses
  }));

  const receivablesData = safeMonthly.map((d) => ({
    label: d.month_name,
    receivables: d.outstanding_receivables
  }));

  const totalExpenseVal = safeExpense.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenseFormatted = `₹ ${(totalExpenseVal / 100000).toFixed(1)}L`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-soft flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileSpreadsheet size={17} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">Finance Overview</h2>
            <p className="text-[11px] text-slate-500">
              Invoice value, collections, outstanding receivables, expenses, estimated project profit and payroll measures.
            </p>
          </div>
        </div>

        {/* Dropdown Filter */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-md text-[11.5px] font-medium text-slate-700 transition-colors"
          >
            <span>{period}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          {showPeriodDropdown && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-lg p-1 z-30 animate-fade-in text-xs">
              {['Last 6 Months', 'Last Quarter', 'Full FY25'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setPeriod(opt);
                    setShowPeriodDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-50 ${
                    period === opt ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4 Panels in a Row (Responsive: 1 -> 2 -> 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch pt-1">
        {/* Panel 1: Invoice Value vs Collected Payments */}
        <div className="flex flex-col bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">
            Invoice Value vs Collections
          </h3>
          <UniversalBarChart
            data={invoiceVsCollectionsData}
            series={[
              { key: 'invoice', name: 'Invoice Value', color: '#2563eb' },
              { key: 'collected', name: 'Collected Payments', color: '#06b6d4' }
            ]}
            height={135}
            showLegend={true}
            valueFormatter={formatLakhs}
            barWidth={7}
          />
        </div>

        {/* Panel 2: Outstanding Receivables */}
        <div className="flex flex-col bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">
            Outstanding Receivables
          </h3>
          <UniversalAreaLineChart
            data={receivablesData}
            series={[
              {
                key: 'receivables',
                name: 'Receivables',
                strokeColor: '#ef4444',
                fillGradient: true,
                fillColorStart: '#fca5a5',
                fillColorEnd: '#fee2e2'
              }
            ]}
            height={135}
            valueFormatter={formatLakhs}
          />
        </div>

        {/* Panel 3: Expenses (orange) */}
        <div className="flex flex-col bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">
            Expenses
          </h3>
          <UniversalBarChart
            data={expensesData}
            series={[{ key: 'expense', name: 'Expenses', color: '#f97316' }]}
            height={135}
            valueFormatter={formatLakhs}
            barWidth={10}
          />
        </div>

        {/* Panel 4: Expense Breakdown (donut) */}
        <div className="flex flex-col bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">
            Expense Breakdown
          </h3>
          <UniversalDonutChart
            data={safeExpense.map((item) => ({
              label: item.category_name,
              value: item.amount,
              percentage: item.percentage,
              color: item.color_hex
            }))}
            centerPrimaryText={totalExpenseFormatted}
            centerSecondaryText="Total Expenses"
            size={110}
            valueFormatter={formatLakhs}
          />
        </div>
      </div>
    </div>
  );
};
