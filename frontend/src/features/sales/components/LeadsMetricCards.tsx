import React from 'react';
import { Users, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { LeadsMetrics } from '../types/leads';
import { Skeleton } from '../../../components/ui/Skeleton';

interface LeadsMetricCardsProps {
  metrics: LeadsMetrics | null;
  isLoading?: boolean;
  activeFilter?: string | null;
  onSelectFilter?: (filter: string | null) => void;
}

export const LeadsMetricCards: React.FC<LeadsMetricCardsProps> = ({
  metrics,
  isLoading = false,
  activeFilter,
  onSelectFilter,
}) => {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex items-center gap-4">
            <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton variant="text" className="w-20 h-3" />
              <Skeleton variant="text" className="w-16 h-6" />
              <Skeleton variant="text" className="w-24 h-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'total',
      label: 'Total Leads',
      value: metrics.totalLeads,
      trend: metrics.totalLeadsTrend,
      trendType: 'positive',
      icon: Users,
      iconBg: 'bg-[#EFF6FF]',
      iconBorder: 'border-[#DBEAFE]',
      iconColor: 'text-[#2563EB]',
    },
    {
      id: 'new',
      label: 'New Leads',
      value: metrics.newLeads,
      trend: metrics.newLeadsTrend,
      trendType: 'positive',
      icon: FileText,
      iconBg: 'bg-[#ECFDF5]',
      iconBorder: 'border-[#D1FAE5]',
      iconColor: 'text-[#10B981]',
    },
    {
      id: 'followups',
      label: 'Follow-ups Due',
      value: metrics.followUpsDue,
      trend: metrics.followUpsDueTrend,
      trendType: 'negative',
      icon: Calendar,
      iconBg: 'bg-[#FEF2F2]',
      iconBorder: 'border-[#FEE2E2]',
      iconColor: 'text-[#EF4444]',
    },
    {
      id: 'converted',
      label: 'Converted Leads',
      value: metrics.convertedLeads,
      trend: metrics.convertedLeadsTrend,
      trendType: 'positive',
      icon: ShieldCheck,
      iconBg: 'bg-[#ECFDF5]',
      iconBorder: 'border-[#D1FAE5]',
      iconColor: 'text-[#10B981]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter && onSelectFilter(isSelected ? null : card.id)}
            className={`bg-white rounded-xl border p-4 sm:p-5 flex items-center gap-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
              isSelected
                ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Left Icon Container */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${card.iconBg} ${card.iconBorder}`}
            >
              <IconComponent size={22} className={card.iconColor} strokeWidth={2} />
            </div>

            {/* Right Metric Details */}
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-slate-500 leading-tight truncate">
                {card.label}
              </span>
              <span className="text-[26px] font-bold text-slate-900 leading-tight mt-1 tracking-tight">
                {card.value ?? '—'}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`text-[11.5px] font-semibold flex items-center gap-0.5 ${
                    card.trend
                      ? card.trendType === 'positive'
                        ? 'text-emerald-600'
                        : 'text-rose-500'
                      : 'text-slate-400'
                  }`}
                >
                  {card.trend || '—'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
