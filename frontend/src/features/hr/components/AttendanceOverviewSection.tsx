import React from 'react';
import { FileCheck, Moon, Clock, ArrowRight } from 'lucide-react';
import { HrKpiCard } from './HrKpiCard';

interface AttendanceOverviewSectionProps {
  records?: number;
  halfDays?: number;
  lateRecords?: number;
  effectiveDate?: string;
  onViewClick?: () => void;
}

export const AttendanceOverviewSection: React.FC<AttendanceOverviewSectionProps> = ({
  records = 997,
  halfDays = 0,
  lateRecords = 0,
  effectiveDate,
  onViewClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 m-0">Attendance Overview</h2>
          <p className="text-xs text-slate-500 m-0 mt-0.5">
            {effectiveDate ? `Attendance records for ${effectiveDate} and punctuality.` : 'Overview of attendance records and punctuality.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onViewClick}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <span>View Attendance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <HrKpiCard
          label="Attendance Records"
          value={records}
          target="Target: 0"
          icon={FileCheck}
          iconBg="bg-[#EFF6FF]"
          iconBorder="border-[#BFDBFE]"
          iconColor="text-[#2563EB]"
        />
        <HrKpiCard
          label="Half Days"
          value={halfDays}
          target="Target: 0"
          icon={Moon}
          iconBg="bg-[#FFFBEB]"
          iconBorder="border-[#FDE68A]"
          iconColor="text-[#D97706]"
        />
        <HrKpiCard
          label="Late Records"
          value={lateRecords}
          target="Target: 0"
          icon={Clock}
          iconBg="bg-[#FFF1F2]"
          iconBorder="border-[#FECDD3]"
          iconColor="text-[#E11D48]"
        />
      </div>
    </div>
  );
};
