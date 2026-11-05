import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HrKpiCardProps {
  label: string;
  value: string | number;
  target?: string;
  icon: LucideIcon;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  onClick?: () => void;
}

export const HrKpiCard: React.FC<HrKpiCardProps> = ({
  label,
  value,
  target = 'Target: 0',
  icon: Icon,
  iconBg,
  iconBorder,
  iconColor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      } group`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${iconBg} ${iconBorder} ${iconColor}`}
      >
        <Icon className="w-5 h-5 stroke-[2.2]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-slate-600 truncate">{label}</div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5 tracking-tight group-hover:text-blue-600 transition-colors">
          {value}
        </div>
        {target && <div className="text-[11px] text-slate-400 font-normal mt-0.5">{target}</div>}
      </div>
    </div>
  );
};
