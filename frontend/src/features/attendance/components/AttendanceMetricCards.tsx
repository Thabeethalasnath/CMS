import React from 'react';
import { Users, UserCheck, Clock, Zap } from 'lucide-react';
import { AttendanceMetrics } from '../types/attendance';

interface AttendanceMetricCardsProps {
  metrics: AttendanceMetrics;
  activeFilter?: string | null;
  onSelectFilter?: (filter: string | null) => void;
}

export const AttendanceMetricCards: React.FC<AttendanceMetricCardsProps> = ({
  metrics,
  activeFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'total',
      label: 'Total Attendance Records',
      value: metrics.totalRecords.toLocaleString(),
      trend: metrics.totalRecordsTrend,
      isPositive: true,
      trendText: 'vs last month',
      icon: Users,
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
    },
    {
      id: 'present',
      label: 'Present Records',
      value: metrics.presentRecords.toLocaleString(),
      trend: metrics.presentRecordsTrend,
      isPositive: true,
      trendText: 'vs last month',
      icon: UserCheck,
      iconBg: '#ECFDF5',
      iconColor: '#059669',
    },
    {
      id: 'late',
      label: 'Late Records',
      value: metrics.lateRecords.toLocaleString(),
      trend: metrics.lateRecordsTrend,
      isPositive: false,
      trendText: 'vs last month',
      icon: Clock,
      iconBg: '#FFFBEB',
      iconColor: '#F59E0B',
    },
    {
      id: 'overtime',
      label: 'Total Overtime Hours',
      value: metrics.totalOvertimeHours,
      trend: metrics.totalOvertimeHoursTrend,
      isPositive: true,
      trendText: 'vs last month',
      icon: Zap,
      iconBg: '#FAF5FF',
      iconColor: '#9333EA',
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
            style={{
              backgroundColor: '#FFFFFF',
              border: isSelected ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
              borderRadius: '12px',
              height: '118px',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
              boxSizing: 'border-box',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isSelected
                ? '0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -2px rgba(79, 70, 229, 0.1)'
                : 'none',
            }}
            className="hover:shadow-sm hover:border-slate-300"
          >
            {/* Icon 48x48 rounded 12px */}
            <div
              style={{
                width: '48px',
                height: '48px',
                minWidth: '48px',
                borderRadius: '12px',
                backgroundColor: card.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComponent size={24} color={card.iconColor} strokeWidth={2} />
            </div>

            {/* Content Details */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '2px',
                minWidth: 0,
                flex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '18px',
                  color: '#64748B',
                  whiteSpace: 'nowrap',
                }}
              >
                {card.label}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  lineHeight: '32px',
                  color: '#0F172A',
                  letterSpacing: '-0.6px',
                }}
              >
                {card.value}
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '1px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    lineHeight: '16px',
                    color: card.isPositive ? '#059669' : '#DC2626',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {card.trend}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 400,
                    lineHeight: '16px',
                    color: '#94A3B8',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {card.trendText}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
