import React from 'react';
import { LogOut, ArrowRight } from 'lucide-react';
import { HrKpiCard } from './HrKpiCard';

interface EmployeeLifecycleSectionProps {
  employeesExiting?: number;
  onViewClick?: () => void;
}

export const EmployeeLifecycleSection: React.FC<EmployeeLifecycleSectionProps> = ({
  employeesExiting = 5,
  onViewClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 m-0">Employee Lifecycle</h2>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Track employee exits.</p>
        </div>
        <button
          type="button"
          onClick={onViewClick}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Card */}
      <div className="w-full">
        <HrKpiCard
          label="Employees Exiting"
          value={employeesExiting ?? 5}
          target="Target: 0"
          icon={LogOut}
          iconBg="bg-[#FFF1F2]"
          iconBorder="border-[#FECDD3]"
          iconColor="text-[#E11D48]"
        />
      </div>
    </div>
  );
};
