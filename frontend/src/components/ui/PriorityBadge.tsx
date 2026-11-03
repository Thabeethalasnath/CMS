import React from 'react';

export type Priority = 'High' | 'Medium' | 'Low';

interface PriorityBadgeProps {
  priority: Priority | string;
  className?: string;
}

const BADGE_CONFIG: Record<
  Priority,
  {
    bg: string;
    text: string;
    dot: string;
  }
> = {
  High: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#DC2626]',
    dot: 'bg-[#EF4444]',
  },
  Medium: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    dot: 'bg-[#F59E0B]',
  },
  Low: {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#059669]',
    dot: 'bg-[#10B981]',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const normalized = (priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()) as Priority;
  const config = BADGE_CONFIG[normalized] || BADGE_CONFIG.Low;

  return (
    <span
      className={`inline-flex flex-row items-center px-2.5 py-0.5 gap-1.5 h-5 rounded-full font-medium text-[11px] leading-4 select-none ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{normalized}</span>
    </span>
  );
};
