import React from 'react';
import { Users, LogOut, IndianRupee, UserPlus, ArrowRight } from 'lucide-react';
import { HrKpiCard } from './HrKpiCard';

interface WorkforceOverviewSectionProps {
  activeEmployees?: number;
  onNotice?: number;
  totalMonthlyCtc?: string;
  newHiresThisMonth?: number;
  onViewClick?: () => void;
}

export const WorkforceOverviewSection: React.FC<WorkforceOverviewSectionProps> = ({
  activeEmployees = 0,
  onNotice = 0,
  totalMonthlyCtc = '₹ 0.00',
  newHiresThisMonth = 0,
  onViewClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 m-0">Workforce Overview</h2>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Key insights about your current workforce.</p>
        </div>
        <button
          type="button"
          onClick={onViewClick}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <span>View Employees</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HrKpiCard
          label="Active Employees"
          value={activeEmployees}
          target="Target: 0"
          icon={Users}
          iconBg="bg-[#EFF6FF]"
          iconBorder="border-[#BFDBFE]"
          iconColor="text-[#2563EB]"
        />
        <HrKpiCard
          label="On Notice"
          value={onNotice}
          target="Target: 0"
          icon={LogOut}
          iconBg="bg-[#FFF7ED]"
          iconBorder="border-[#FED7AA]"
          iconColor="text-[#EA580C]"
        />
        <HrKpiCard
          label="Total Monthly CTC"
          value={totalMonthlyCtc}
          target="Target: 0"
          icon={IndianRupee}
          iconBg="bg-[#ECFDF5]"
          iconBorder="border-[#A7F3D0]"
          iconColor="text-[#059669]"
        />
        <HrKpiCard
          label="New Hires This Month"
          value={newHiresThisMonth}
          target="Target: 0"
          icon={UserPlus}
          iconBg="bg-[#FAF5FF]"
          iconBorder="border-[#F3E8FF]"
          iconColor="text-[#A855F7]"
        />
      </div>
    </div>
  );
};
