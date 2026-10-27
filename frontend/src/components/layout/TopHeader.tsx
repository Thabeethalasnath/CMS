import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Bell, Menu, Database, ChevronDown, CheckCircle2, XCircle, Clock, Check } from 'lucide-react';
import { CalendarDateRangePicker } from '../ui/CalendarDateRangePicker';

interface TopHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onOpenEditModal: () => void;
  onToggleMobileSidebar?: () => void;
  unreadCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onOpenEditModal,
  onToggleMobileSidebar = () => {},
  unreadCount = 3
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Auto-close notification dropdown on outside click or scroll
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    const handleScroll = () => {
      setShowNotifications(false);
      setShowDatePicker(false);
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleOutside);
      window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [showNotifications]);

  const recentNotifications = [
    {
      id: 1,
      title: 'State Updated: Approved',
      detail: 'Laptop replacement (AST-2025-021) moved from Pending → Approved',
      type: 'Approved',
      time: 'Just now'
    },
    {
      id: 2,
      title: 'State Updated: Rejected',
      detail: 'Sneha K (EMP-0051) sick leave request rejected',
      type: 'Rejected',
      time: '12m ago'
    },
    {
      id: 3,
      title: 'New Request: Pending',
      detail: 'Arun S (EMP-0012) submitted sick leave request for 3 days',
      type: 'Pending',
      time: '1h ago'
    }
  ];

  return (
    <header className="h-[68px] min-h-[68px] bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Left: Hamburger + Wide Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-full gap-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search anything (clients, projects, invoices, employees...)"
            className="w-full text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Right: Date Picker, DB Edit, Notifications, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Financial Year Date Range Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors"
          >
            <Calendar size={14} className="text-slate-500" />
            <span>{dateRange}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          <CalendarDateRangePicker
            value={dateRange}
            onChange={(range) => onDateRangeChange(range)}
            isOpen={showDatePicker}
            onClose={() => setShowDatePicker(false)}
          />
        </div>


        {/* Notification Bell with Badge & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Recent Notifications</span>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {recentNotifications.length} new
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {recentNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-slate-50/80 transition-colors flex items-start gap-2.5">
                    <div className="pt-0.5 shrink-0">
                      {notif.type === 'Approved' && <CheckCircle2 size={15} className="text-emerald-600" />}
                      {notif.type === 'Rejected' && <XCircle size={15} className="text-rose-600" />}
                      {notif.type === 'Pending' && <Clock size={15} className="text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-800 truncate">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{notif.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Close Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-slate-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-100 overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Akshit Ujjain"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            AU
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              Akshit Ujjain
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              CEO
            </span>
          </div>
          <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
