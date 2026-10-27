import React from 'react';
import { Layers, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { ApprovalsSummary } from '../../types/approvals';

interface ApprovalMetricCardsProps {
  summary: ApprovalsSummary;
  selectedFilter?: string | null;
  onSelectFilter?: (filter: string | null) => void;
}

export const ApprovalMetricCards: React.FC<ApprovalMetricCardsProps> = ({
  summary,
  selectedFilter,
  onSelectFilter = () => {}
}) => {
  const cards = [
    {
      key: 'all',
      title: 'Total Requests',
      value: summary.total,
      boxBg: 'bg-[#EFF6FF]',
      boxBorder: 'border-[#DBEAFE]',
      iconColor: 'text-[#2563EB]',
      textColor: 'text-[#2563EB]',
      icon: <Layers size={22} className="stroke-[2.2]" />
    },
    {
      key: 'Pending',
      title: 'Pending',
      value: summary.pending,
      boxBg: 'bg-[#FFFBEB]',
      boxBorder: 'border-[#FEF3C7]',
      iconColor: 'text-[#F59E0B]',
      textColor: 'text-[#F59E0B]',
      icon: <Clock size={22} className="stroke-[2.2]" />
    },
    {
      key: 'Approved',
      title: 'Approved',
      value: summary.approved,
      boxBg: 'bg-[#ECFDF5]',
      boxBorder: 'border-[#D1FAE5]',
      iconColor: 'text-[#059669]',
      textColor: 'text-[#059669]',
      icon: <CheckCircle2 size={22} className="stroke-[2.2]" />
    },
    {
      key: 'Rejected',
      title: 'Rejected',
      value: summary.rejected,
      boxBg: 'bg-[#FEF2F2]',
      boxBorder: 'border-[#FEE2E2]',
      iconColor: 'text-[#EF4444]',
      textColor: 'text-[#EF4444]',
      icon: <XCircle size={22} className="stroke-[2.2]" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        const isSelected = selectedFilter === card.key;
        return (
          <div
            key={card.key}
            onClick={() => onSelectFilter(isSelected ? null : card.key)}
            className={`box-border flex flex-row items-center p-4 gap-4 bg-white border rounded-xl transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
              isSelected
                ? 'border-indigo-500 ring-2 ring-indigo-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* 48x48 icon tile */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${card.boxBg} ${card.boxBorder} ${card.iconColor}`}
            >
              {card.icon}
            </div>

            {/* Label and Count */}
            <div className="flex flex-col items-start justify-center">
              <span className="text-xs font-semibold text-slate-500 tracking-tight leading-4">
                {card.title}
              </span>
              <span
                className={`text-2xl font-extrabold tracking-[-0.6px] leading-8 ${card.textColor}`}
              >
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
