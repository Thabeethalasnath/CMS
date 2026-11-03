import React from 'react';
import { FileText, CheckCircle2, Clock, CalendarX } from 'lucide-react';
import { LeaveMetrics } from '../types/leave';
import { Skeleton } from '../../../components/ui/Skeleton';

interface LeaveMetricCardsProps {
  metrics: LeaveMetrics | null;
  loading: boolean;
}

export const LeaveMetricCards: React.FC<LeaveMetricCardsProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton width={44} height={44} className="rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton width="60%" height={14} />
                <Skeleton width="40%" height={26} />
                <Skeleton width="50%" height={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Leave Requests',
      value: metrics.totalRequests,
      trend: metrics.totalRequestsTrend || '↑ 12% vs last month',
      trendColor: 'text-emerald-600',
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Approved Requests',
      value: metrics.approvedRequests,
      trend: metrics.approvedRequestsTrend || '↑ 8% vs last month',
      trendColor: 'text-emerald-600',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Pending Requests',
      value: metrics.pendingRequests,
      trend: metrics.pendingRequestsTrend || '↓ 8% vs last month',
      trendColor: 'text-amber-600',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Rejected Requests',
      value: metrics.rejectedRequests,
      trend: metrics.rejectedRequestsTrend || '↓ 17% vs last month',
      trendColor: 'text-rose-600',
      icon: CalendarX,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, idx) => {
        const IconComponent = c.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-start gap-4 transition-shadow hover:shadow-md"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.iconBg}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 mb-1">{c.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-1">{c.value}</h3>
              <p className={`text-[11px] font-medium ${c.trendColor}`}>{c.trend}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

