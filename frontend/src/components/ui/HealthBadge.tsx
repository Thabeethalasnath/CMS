import React from 'react';
import { AlertTriangle, Timer, RotateCcw } from 'lucide-react';

export type HealthStatus = 'Overdue' | 'Due Soon' | 'On Track';

interface HealthBadgeProps {
  status: HealthStatus | string;
  className?: string;
}

const HEALTH_CONFIG: Record<
  HealthStatus,
  {
    bg: string;
    text: string;
    icon: React.ReactNode;
  }
> = {
  Overdue: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#DC2626]',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] stroke-[1.17] shrink-0" />,
  },
  'Due Soon': {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    icon: <Timer className="w-3.5 h-3.5 text-[#F59E0B] stroke-[1.17] shrink-0" />,
  },
  'On Track': {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#059669]',
    icon: <RotateCcw className="w-3.5 h-3.5 text-[#10B981] stroke-[1.17] shrink-0" />,
  },
};

export const HealthBadge: React.FC<HealthBadgeProps> = ({ status, className = '' }) => {
  const normalized = (
    status === 'Overdue' || status === 'Due Soon' || status === 'On Track'
      ? status
      : 'On Track'
  ) as HealthStatus;

  const config = HEALTH_CONFIG[normalized];

  return (
    <span
      className={`inline-flex flex-row items-center px-2.5 py-0.5 gap-1.5 h-5 rounded-full font-medium text-[11px] leading-4 select-none ${config.bg} ${config.text} ${className}`}
    >
      {config.icon}
      <span>{normalized}</span>
    </span>
  );
};
