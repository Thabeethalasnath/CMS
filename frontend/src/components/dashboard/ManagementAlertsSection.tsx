import React from 'react';
import {
  Bell,
  ChevronRight,
  FileText,
  Clock,
  Briefcase,
  ShieldCheck,
  FolderSync,
  FileWarning,
  Award,
  UserCheck,
  AlertCircle,
  Users
} from 'lucide-react';
import { ManagementAlertItem } from '../../types/dashboard';

interface ManagementAlertsSectionProps {
  alerts: ManagementAlertItem[];
  onAlertClick?: (alert: ManagementAlertItem) => void;
  onUpdateAlertCount?: (id: number, delta: number) => void;
}

export const ManagementAlertsSection: React.FC<ManagementAlertsSectionProps> = ({
  alerts,
  onAlertClick = () => {}
}) => {
  const renderAlertIcon = (iconType: string, color: string) => {
    const size = 16;
    let iconComp = <FileText size={size} color={color} strokeWidth={2} />;

    switch (iconType) {
      case 'invoice':
        iconComp = <FileText size={size} color={color} strokeWidth={2} />;
        break;
      case 'contract':
        iconComp = <FileText size={size} color={color} strokeWidth={2} />;
        break;
      case 'project':
        iconComp = <Briefcase size={size} color={color} strokeWidth={2} />;
        break;
      case 'compliance':
        iconComp = <ShieldCheck size={size} color={color} strokeWidth={2} />;
        break;
      case 'doc_expiring':
        iconComp = <FolderSync size={size} color={color} strokeWidth={2} />;
        break;
      case 'doc_expired':
        iconComp = <FileWarning size={size} color={color} strokeWidth={2} />;
        break;
      case 'warranty':
        iconComp = <Award size={size} color={color} strokeWidth={2} />;
        break;
      case 'approval_pending':
        iconComp = <UserCheck size={size} color={color} strokeWidth={2} />;
        break;
      case 'approval_overdue':
        iconComp = <AlertCircle size={size} color={color} strokeWidth={2} />;
        break;
      case 'candidate':
        iconComp = <Users size={size} color={color} strokeWidth={2} />;
        break;
      default:
        iconComp = <Clock size={size} color={color} strokeWidth={2} />;
        break;
    }

    return (
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        {iconComp}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#F59E0B] border border-[#FDE68A]/60 flex items-center justify-center shrink-0 shadow-2xs">
          <Bell size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug">Management Alerts</h2>
          <p className="text-xs text-slate-500">
            Live counts from the Alerts Center. Click on an item to view filtered alerts.
          </p>
        </div>
      </div>

      {/* Table Container with Two Columns & Middle Vertical Divider */}
      <div className="border border-slate-100/90 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1.2fr_1fr] bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 select-none">
          <div className="px-5 py-2.5">
            Alert
          </div>
          <div className="px-5 py-2.5 border-l border-slate-100">
            Count
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 bg-white">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onAlertClick(alert)}
              className="grid grid-cols-[1.2fr_1fr] items-center hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              {/* Alert Icon & Label */}
              <div className="px-5 py-3 flex items-center gap-3 min-w-0">
                {renderAlertIcon(alert.icon_type, alert.icon_color)}
                <span className="text-xs font-medium text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                  {alert.title}
                </span>
              </div>

              {/* Count & Right Chevron */}
              <div className="px-5 py-3 border-l border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {alert.alert_count}
                </span>
                <ChevronRight
                  size={15}
                  className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
