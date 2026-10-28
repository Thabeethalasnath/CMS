import React, { useState, useRef, useEffect } from 'react';
import { Check, Clock, UserCheck, Shield } from 'lucide-react';

interface TopNavProps {
  onMenuClick?: () => void;
  isSidebarCollapsed?: boolean;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  selectedDateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onMenuClick,
  isSidebarCollapsed = false,
  searchQuery = '',
  onSearchChange,
  selectedDateRange = 'Apr 2024 - Mar 2025',
  onDateRangeChange,
}) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dateRanges = [
    'Apr 2024 - Mar 2025',
    'Jan 2024 - Dec 2024',
    'Apr 2025 - Mar 2026',
    'Last 30 Days',
    'This Quarter (Q4)',
  ];

  return (
    <header
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0px 24px',
        width: '100%',
        height: '64px',
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        zIndex: 10,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Left: Hamburger & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px',
          gap: '16px',
          height: '34px',
          maxWidth: '672px',
          flex: '1 1 auto',
          minWidth: 0,
        }}
      >
        {/* Button - Hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          title={isSidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          className="hover:bg-slate-100"
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            flex: 'none',
            order: 0,
            flexGrow: 0,
            flexShrink: 0,
            border: 'none',
            background: isSidebarCollapsed ? '#EEF2FF' : 'transparent',
            cursor: 'pointer',
            transform: isSidebarCollapsed ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.28s cubic-bezier(0.2, 0, 0, 1), background-color 0.15s ease',
          }}
        >
          {/* SVG 20x20 Vector border: 1.66667px solid */}
          <svg
            style={{ width: '20px', height: '20px', transition: 'stroke 0.2s ease' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isSidebarCollapsed ? '#4F46E5' : '#64748B'}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        {/* Container - Search Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            isolation: 'isolate',
            width: '100%',
            maxWidth: '448px',
            height: '34px',
            flex: '1 1 auto',
            minWidth: 0,
          }}
        >
          {/* Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search anything (clients, projects, invoices, employees...)"
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '8px 16px 9px 36px',
              width: '100%',
              height: '34px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 0,
              zIndex: 0,
              fontFamily: "'Inter', sans-serif",
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '15px',
              color: '#0F172A',
              outline: 'none',
            }}
            className="placeholder:text-[#94A3B8] focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          />

          {/* Search Icon Container */}
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px 0px 0px 12px',
              position: 'absolute',
              width: '28px',
              left: '0px',
              top: '0px',
              bottom: '0px',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            {/* akar-icons:search 16x16 */}
            <svg
              style={{ width: '16px', height: '16px' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right: Actions & User Info */}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0px',
          gap: '16px',
          width: '406.31px',
          height: '36px',
          flex: 'none',
          order: 1,
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        {/* Date Filter Dropdown */}
        <div style={{ position: 'relative', flexShrink: 0 }} ref={dateRef}>
          <button
            type="button"
            onClick={() => setIsDateOpen(!isDateOpen)}
            className="hover:bg-slate-100 transition-colors"
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '6px 12px',
              gap: '8px',
              width: '193.31px',
              height: '30px',
              background: '#F8FAFC',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              borderRadius: '8px',
              flex: 'none',
              order: 0,
              flexGrow: 0,
              cursor: 'pointer',
            }}
          >
            {/* SVG Calendar 14x14 */}
            <svg
              style={{ width: '14px', height: '14px', flexShrink: 0 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>

            {/* Text container */}
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                width: '121.31px',
                height: '16px',
                flex: 'none',
                order: 1,
                flexGrow: 0,
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  width: '121.31px',
                  height: '16px',
                  fontFamily: "'Inter', sans-serif",
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#334155',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'left',
                }}
              >
                {selectedDateRange}
              </span>
            </div>

            {/* SVG:margin chevron */}
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '0px 0px 0px 4px',
                width: '16px',
                height: '12px',
                flex: 'none',
                order: 2,
                flexGrow: 0,
              }}
            >
              <svg
                style={{ width: '12px', height: '12px' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          {isDateOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Period
              </div>
              {dateRanges.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    onDateRangeChange?.(range);
                    setIsDateOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    selectedDateRange === range ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-[#334155]'
                  }`}
                >
                  <span>{range}</span>
                  {selectedDateRange === range && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Button - Notification Bell */}
        <div style={{ position: 'relative', flexShrink: 0 }} ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Notification Bell"
            className="hover:bg-slate-100 transition-colors"
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              isolation: 'isolate',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              position: 'relative',
            }}
          >
            {/* SVG Bell 20x20 */}
            <svg
              style={{ width: '20px', height: '20px', zIndex: 0 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {/* Background+Border Badge */}
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px',
                position: 'absolute',
                width: '14px',
                height: '14px',
                right: '6px',
                top: '4.5px',
                background: '#F43F5E',
                border: '2px solid #FFFFFF',
                borderRadius: '9999px',
                flex: 'none',
                order: 1,
                flexGrow: 0,
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  width: '5.81px',
                  height: '14px',
                  fontFamily: "'Inter', sans-serif",
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontSize: '9px',
                  lineHeight: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: '#FFFFFF',
                }}
              >
                3
              </span>
            </div>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800">Notifications</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 flex gap-2.5 cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Invoices overdue</p>
                    <p className="text-[11px] text-slate-500">₹ 4,28,000 pending past 45 days.</p>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 flex gap-2.5 cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Compliance License</p>
                    <p className="text-[11px] text-slate-500">Annual license renewal 32 days overdue.</p>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 flex gap-2.5 cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">PO Approval Needed</p>
                    <p className="text-[11px] text-slate-500">ACME Pvt Ltd SLA overdue by 5 days.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative', flexShrink: 0 }} ref={profileRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="group hover:opacity-90 transition-opacity"
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px 0px 0px 8px',
              gap: '10px',
              width: '145px',
              height: '32px',
              cursor: 'pointer',
              userSelect: 'none',
              flex: 'none',
              order: 2,
              flexGrow: 0,
              flexShrink: 0,
            }}
          >
            {/* Background: Avatar Container */}
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              {/* Overlay+Shadow */}
              <div
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '32px',
                  left: '0px',
                  top: '0px',
                  boxShadow: '0px 0px 0px 2px #DBEAFE',
                  borderRadius: '9999px',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />

              {/* image 117 */}
              <img
                src="/avatar.jpg"
                alt="Akshit Ujjain"
                style={{
                  boxSizing: 'border-box',
                  width: '32px',
                  height: '32px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  display: 'block',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0,
                  zIndex: 1,
                }}
              />
            </div>

            {/* Container: Name & Role */}
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '0px',
                width: '73px',
                height: '30px',
                flex: 'none',
                order: 1,
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              {/* Name Row */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  width: '73px',
                  height: '15px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <span
                  style={{
                    width: '73px',
                    height: '15px',
                    fontFamily: "'Inter', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '12px',
                    lineHeight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#1E293B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Akshit Ujjain
                </span>
              </div>

              {/* Role Row */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  width: '73px',
                  height: '15px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <span
                  style={{
                    width: '21.03px',
                    height: '15px',
                    fontFamily: "'Inter', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '10px',
                    lineHeight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748B',
                  }}
                >
                  CEO
                </span>
              </div>
            </div>

            {/* SVG: chevron */}
            <svg
              style={{
                width: '12px',
                height: '12px',
                color: '#94A3B8',
                flex: 'none',
                order: 2,
                flexGrow: 0,
                flexShrink: 0,
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1.5 z-50">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Akshit Ujjain</p>
                <p className="text-[11px] text-slate-500">akshit@cms.internal</p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Workspace Settings
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Company Directory
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Activity Logs
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
