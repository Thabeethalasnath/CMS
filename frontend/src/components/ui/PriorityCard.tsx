import React from 'react';
import { ChevronRight } from 'lucide-react';

export type PriorityLevel = 'high' | 'medium' | 'low';

interface PriorityCardProps {
  level: PriorityLevel;
  title: string;
  subtitle: string;
  count: number;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const LEVEL_STYLES: Record<
  PriorityLevel,
  {
    containerStyle: React.CSSProperties;
    containerClass: string;
    iconBox: string;
    countColor: string;
    arrowColor: string;
  }
> = {
  high: {
    containerStyle: {
      background: 'linear-gradient(90deg, rgba(254, 242, 242, 0.5) 0%, #FFFFFF 100%)',
      border: '1px solid rgba(254, 202, 202, 0.9)',
      borderRadius: '16px',
      height: '86px',
    },
    containerClass: 'hover:border-rose-400',
    iconBox: 'bg-[#FEE2E2] text-[#EF4444]',
    countColor: '#DC2626',
    arrowColor: '#F87171',
  },
  medium: {
    containerStyle: {
      background: 'linear-gradient(90deg, rgba(255, 251, 235, 0.5) 0%, #FFFFFF 100%)',
      border: '1px solid rgba(253, 230, 138, 0.9)',
      borderRadius: '16px',
      height: '86px',
    },
    containerClass: 'hover:border-amber-400',
    iconBox: 'bg-[#FEF3C7] text-[#F59E0B]',
    countColor: '#F59E0B',
    arrowColor: '#FBBF24',
  },
  low: {
    containerStyle: {
      background: 'linear-gradient(90deg, rgba(236, 253, 245, 0.5) 0%, #FFFFFF 100%)',
      border: '1px solid rgba(167, 243, 208, 0.9)',
      borderRadius: '16px',
      height: '86px',
    },
    containerClass: 'hover:border-emerald-400',
    iconBox: 'bg-[#D1FAE5] text-[#10B981]',
    countColor: '#059669',
    arrowColor: '#34D399',
  },
};

export const PriorityCard: React.FC<PriorityCardProps> = ({
  level,
  title,
  subtitle,
  count,
  icon,
  isActive = false,
  onClick,
}) => {
  const styles = LEVEL_STYLES[level];

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={styles.containerStyle}
      className={`box-border flex flex-row justify-between items-center px-4 py-4 md:py-5 flex-1 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md ${
        styles.containerClass
      } ${isActive ? 'ring-2 ring-blue-500 scale-[1.01]' : ''}`}
    >
      <div className="flex flex-row items-center p-0 gap-[14px]">
        <div
          className={`flex flex-row justify-center items-center w-11 h-11 rounded-xl shrink-0 ${styles.iconBox}`}
        >
          {icon}
        </div>
        <div className="flex flex-col items-start p-0">
          <span
            className="font-bold text-sm leading-5 text-[#1E293B]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {title}
          </span>
          <span
            className="font-normal text-xs leading-4 text-[#64748B] mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {subtitle}
          </span>
        </div>
      </div>

      <div className="flex flex-row items-center p-0 gap-2">
        <span
          className="font-bold text-2xl leading-8 flex items-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: styles.countColor,
            fontSize: '24px',
            lineHeight: '32px',
          }}
        >
          {count}
        </span>
        <ChevronRight
          className="w-4 h-4 stroke-[2]"
          style={{ color: styles.arrowColor }}
        />
      </div>
    </div>
  );
};
