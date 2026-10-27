import React, { useState } from 'react';
import { BarChart2, ChevronDown } from 'lucide-react';
import { SalesPipelineStage, ProjectStatusItem } from '../../types/dashboard';
import { UniversalFunnelChart } from '../charts/UniversalFunnelChart';
import { UniversalDonutChart } from '../charts/UniversalDonutChart';

interface SalesDeliverySectionProps {
  pipelineStages: SalesPipelineStage[];
  projectStatuses: ProjectStatusItem[];
}

export const SalesDeliverySection: React.FC<SalesDeliverySectionProps> = ({
  pipelineStages,
  projectStatuses
}) => {
  const [period, setPeriod] = useState('Last 6 Months');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const safePipelineStages = pipelineStages || [];
  const safeProjectStatuses = projectStatuses || [];

  const totalProjects = safeProjectStatuses.reduce((acc, curr: any) => acc + (curr.project_count ?? curr.projectCount ?? 0), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-soft flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BarChart2 size={17} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">Sales & Delivery Overview</h2>
            <p className="text-[11px] text-slate-500">
              Weighted sales pipeline and active project count with opportunity stage and project status breakdowns.
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

      {/* 2 Columns: Funnel and Active Projects Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch pt-1">
        {/* Column 1: Sales Pipeline by Stage */}
        <div className="flex flex-col bg-slate-50/60 p-4 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-3">
            Sales Pipeline by Stage
          </h3>
          <UniversalFunnelChart data={safePipelineStages} height={145} />
        </div>

        {/* Column 2: Active Projects by Status */}
        <div className="flex flex-col bg-slate-50/60 p-4 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-3">
            Active Projects by Status
          </h3>
          <UniversalDonutChart
            data={safeProjectStatuses.map((item: any) => ({
              label: item.status_name ?? item.statusName ?? '',
              value: item.project_count ?? item.projectCount ?? 0,
              percentage: item.percentage ?? 0,
              color: item.color_hex ?? item.colorHex ?? '#10B981',
              secondaryInfo: `${item.project_count ?? item.projectCount ?? 0}`
            }))}
            centerPrimaryText={`${totalProjects}`}
            centerSecondaryText="Active Projects"
            size={110}
            valueFormatter={(v) => `${v}`}
          />
        </div>
      </div>
    </div>
  );
};
