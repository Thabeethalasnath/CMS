import React, { useState } from 'react';
import { Users2, ChevronDown, UserCheck, UserPlus, UserMinus, TrendingUp } from 'lucide-react';
import { PeopleMonthlyRecord, PeopleSummary } from '../../types/dashboard';
import { UniversalBarChart } from '../charts/UniversalBarChart';
import { UniversalAreaLineChart } from '../charts/UniversalAreaLineChart';

interface PeopleOverviewSectionProps {
  monthlyData: PeopleMonthlyRecord[];
  summary: PeopleSummary;
}

export const PeopleOverviewSection: React.FC<PeopleOverviewSectionProps> = ({
  monthlyData,
  summary
}) => {
  const [period, setPeriod] = useState('Last 6 Months');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const employeeCountData = monthlyData.map((d) => ({
    label: d.month_name,
    count: d.employee_count
  }));

  const payrollTrendData = monthlyData.map((d) => ({
    label: d.month_name,
    netPayroll: d.net_payroll,
    payrollCost: d.employer_payroll_cost
  }));

  const formatLakhs = (val: number) => {
    return `₹ ${(val / 100000).toFixed(1)}L`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-soft flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users2 size={17} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">People Overview</h2>
            <p className="text-[11px] text-slate-500">
              Active employee count, net payroll and employer payroll cost.
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

      {/* 3 Columns: Employee Count, Payroll Trend, Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch pt-1">
        {/* Column 1: Employee Count Trend */}
        <div className="flex flex-col bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">
            Employee Count Trend
          </h3>
          <UniversalBarChart
            data={employeeCountData}
            series={[{ key: 'count', name: 'Employees', color: '#38bdf8' }]}
            height={135}
            valueFormatter={(v) => `${v}`}
            barWidth={9}
          />
        </div>

        {/* Column 2: Payroll Trend (₹) */}
        <div className="flex flex-col bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2">
            Payroll Trend (₹)
          </h3>
          <UniversalAreaLineChart
            data={payrollTrendData}
            series={[
              { key: 'netPayroll', name: 'Net Payroll', strokeColor: '#2563eb', fillGradient: false },
              { key: 'payrollCost', name: 'Employer Payroll Cost', strokeColor: '#8b5cf6', fillGradient: false }
            ]}
            height={135}
            showLegend={true}
            valueFormatter={formatLakhs}
          />
        </div>

        {/* Column 3: Employee Summary Card */}
        <div className="flex flex-col bg-slate-50/60 p-4 rounded-xl border border-slate-100 justify-between">
          <h3 className="text-xs font-bold text-slate-800 mb-2">
            Employee Summary
          </h3>
          <div className="flex flex-col gap-2.5 bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <UserCheck size={15} className="text-slate-400" />
                <span className="font-medium">Active Employees</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{summary.active_employees}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <UserPlus size={15} className="text-emerald-500" />
                <span className="font-medium">New Joinees (YTD)</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{summary.new_joiners_ytd}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <UserMinus size={15} className="text-rose-500" />
                <span className="font-medium">Exits (YTD)</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{summary.exits_ytd}</span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-200 pt-2 mt-0.5">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <TrendingUp size={15} className="text-emerald-600" />
                <span>Net Growth</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                +{summary.net_growth}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
