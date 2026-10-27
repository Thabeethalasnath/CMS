import React from 'react';
import { CheckCircle2, XCircle, Clock, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  statusBadge?: 'Approved' | 'Rejected' | 'Pending' | string;
  timestamp?: string;
}

interface ToastNotificationProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-[76px] right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        let iconEl = <Info size={14} className="text-indigo-600" />;
        let iconBoxBg = 'bg-indigo-50 border-indigo-200/70 text-indigo-600';

        if (toast.type === 'success' || toast.statusBadge === 'Approved') {
          iconEl = <CheckCircle2 size={14} className="text-emerald-600" />;
          iconBoxBg = 'bg-emerald-50 border-emerald-200/70 text-emerald-600';
        } else if (toast.type === 'error' || toast.statusBadge === 'Rejected') {
          iconEl = <XCircle size={14} className="text-rose-600" />;
          iconBoxBg = 'bg-rose-50 border-rose-200/70 text-rose-600';
        } else if (toast.type === 'warning' || toast.statusBadge === 'Pending') {
          iconEl = <Clock size={14} className="text-amber-600" />;
          iconBoxBg = 'bg-amber-50 border-amber-200/70 text-amber-600';
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.06)] px-3.5 py-2.5 flex items-center gap-3 min-w-[280px] max-w-sm animate-slide-in-right transition-all duration-200"
          >
            {/* Status Icon Box */}
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${iconBoxBg}`}>
              {iconEl}
            </div>

            {/* Content text */}
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-xs font-semibold text-slate-900 leading-tight truncate">
                {toast.title}
              </span>
              {toast.message && (
                <span className="text-[11.5px] text-slate-500 truncate leading-snug mt-0.5">
                  {toast.message}
                </span>
              )}
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors shrink-0 cursor-pointer ml-1"
              title="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
