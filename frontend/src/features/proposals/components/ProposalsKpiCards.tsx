import React from 'react';
import { FileText, Clock, CheckCircle2, IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ProposalKpiSummary } from '../types';

interface ProposalsKpiCardsProps {
  summary: ProposalKpiSummary;
}

export const ProposalsKpiCards: React.FC<ProposalsKpiCardsProps> = ({ summary }) => {
  const cards = [
    {
      id: 'total-proposals',
      label: 'Total proposals',
      value: summary.totalProposals,
      trend: `${summary.totalProposalsTrend > 0 ? '↑' : '↓'} ${Math.abs(summary.totalProposalsTrend)}%`,
      trendLabel: 'vs last month',
      trendPositive: summary.totalProposalsTrend >= 0,
      icon: FileText,
      iconBg: 'bg-[#EBF5FF]',
      iconBorder: 'border-[#D1E9FF]',
      iconColor: 'text-[#2563EB]',
    },
    {
      id: 'pending-decisions',
      label: 'Pending decisions',
      value: summary.pendingDecisions,
      trend: `${summary.pendingDecisionsTrend > 0 ? '↑' : '↓'} ${Math.abs(summary.pendingDecisionsTrend)}%`,
      trendLabel: 'vs last month',
      trendPositive: summary.pendingDecisionsTrend >= 0,
      icon: Clock,
      iconBg: 'bg-[#FEF2F2]',
      iconBorder: 'border-[#FEE2E2]',
      iconColor: 'text-[#DC2626]',
    },
    {
      id: 'approved-proposals',
      label: 'Approved proposals',
      value: summary.approvedProposals,
      trend: `${summary.approvedProposalsTrend > 0 ? '↑' : '↓'} ${Math.abs(summary.approvedProposalsTrend)}%`,
      trendLabel: 'vs last month',
      trendPositive: summary.approvedProposalsTrend >= 0,
      icon: CheckCircle2,
      iconBg: 'bg-[#ECFDF5]',
      iconBorder: 'border-[#D1FAE5]',
      iconColor: 'text-[#16A34A]',
    },
    {
      id: 'total-proposal-value',
      label: 'Total proposal value',
      value: '₹ 8,5000',
      trend: `${summary.totalProposalValueTrend > 0 ? '↑' : '↓'} ${Math.abs(summary.totalProposalValueTrend)}%`,
      trendLabel: 'vs last month',
      trendPositive: summary.totalProposalValueTrend >= 0,
      icon: IndianRupee,
      iconBg: 'bg-[#FFF1F2]',
      iconBorder: 'border-[#FFE4E6]',
      iconColor: 'text-[#E11D48]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Left Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${card.iconBg} ${card.iconBorder} ${card.iconColor}`}
            >
              <IconComponent className="w-5 h-5 stroke-[2.2]" />
            </div>

            {/* Right Metrics */}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-500 tracking-tight leading-4 block truncate">
                {card.label}
              </span>
              <div className="text-2xl font-extrabold tracking-[-0.6px] leading-8 text-slate-900 mt-0.5">
                {card.value}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] leading-4">
                <span className={`font-semibold ${card.trendPositive ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
                  {card.trend}
                </span>
                <span className="text-slate-400 font-medium">
                  {card.trendLabel}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
