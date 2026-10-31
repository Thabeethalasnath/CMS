import React from 'react';
import { CalendarOff, ArrowRight } from 'lucide-react';
import { HrKpiCard } from './HrKpiCard';

interface LeaveManagementSectionProps {
  pendingApprovals?: number;
  onViewClick?: () => void;
}

export const LeaveManagementSection: React.FC<LeaveManagementSectionProps> = ({
  pendingApprovals = 0,
  onViewClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 m-0">Leave Management</h2>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Monitor and manage leave requests.</p>
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

      {/* 1 Card */}
      <div className="w-full">
        <HrKpiCard
          label="Pending Leave Approvals"
          value={pendingApprovals}
          target="Target: 0"
          icon={CalendarOff}
          iconBg="bg-[#FFFBEB]"
          iconBorder="border-[#FDE68A]"
          iconColor="text-[#D97706]"
        />
      </div>
    </div>
  );
};
