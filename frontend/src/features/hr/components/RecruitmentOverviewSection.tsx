import React from 'react';
import { User, Calendar, ArrowRight } from 'lucide-react';
import { HrKpiCard } from './HrKpiCard';

interface RecruitmentOverviewSectionProps {
  openCandidates?: number;
  candidatesOver30Days?: number;
  onViewClick?: () => void;
}

export const RecruitmentOverviewSection: React.FC<RecruitmentOverviewSectionProps> = ({
  openCandidates = 997,
  candidatesOver30Days = 0,
  onViewClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 m-0">Recruitment Overview</h2>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Track candidate pipeline and hiring progress.</p>
        </div>
        <button
          type="button"
          onClick={onViewClick}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          <span>View Recruitment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HrKpiCard
          label="Open Candidates"
          value={openCandidates}
          target="Target: 0"
          icon={User}
          iconBg="bg-[#FAF5FF]"
          iconBorder="border-[#F3E8FF]"
          iconColor="text-[#A855F7]"
        />
        <HrKpiCard
          label="Candidates Over 30 Days"
          value={candidatesOver30Days}
          target="Target: 0"
          icon={Calendar}
          iconBg="bg-[#ECFDF5]"
          iconBorder="border-[#A7F3D0]"
          iconColor="text-[#059669]"
        />
      </div>
    </div>
  );
};
