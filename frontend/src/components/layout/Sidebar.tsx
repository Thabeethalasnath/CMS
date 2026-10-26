import React, { useState } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Clock,
  Coins,
  TrendingUp,
  Building2,
  Users,
  Briefcase,
  DollarSign,
  FileText,
  Headphones,
  ShieldCheck,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface SidebarProps {
  activeNav?: string;
  onSelectNav?: (navKey: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav = 'ceo_dashboard',
  onSelectNav = () => {},
  isMobileOpen = false,
  onCloseMobile = () => {}
}) => {
  const [managementOpen, setManagementOpen] = useState(true);

  const mainNavItems = [
    { id: 'sales', label: 'Sales & CRM', icon: <TrendingUp size={16} /> },
    { id: 'clients', label: 'Clients', icon: <Building2 size={16} /> },
    { id: 'hr', label: 'HR & People', icon: <Users size={16} /> },
    { id: 'projects', label: 'Projects & Delivery', icon: <Briefcase size={16} /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign size={16} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
    { id: 'support', label: 'Support & AMC', icon: <Headphones size={16} /> },
    { id: 'reports', label: 'Reports & Control', icon: <ShieldCheck size={16} /> }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1437] text-slate-200 select-none border-r border-[#152347]">
      {/* 68px Brand Header */}
      <div className="h-[68px] min-h-[68px] px-5 flex items-center justify-between border-b border-[#142144]">
        <div className="flex items-center gap-3">
          <img
            src="/logo-icon.svg"
            alt="KALPANAAA Logo"
            className="w-10 h-9 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-[13.5px] tracking-[0.08em] leading-tight">
              KALPANAAA
            </span>
            <span className="text-slate-400 text-[8.5px] font-semibold tracking-[0.06em]">
              SOFTWARE SOLUTIONS
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-1.5 custom-scrollbar">
        {/* Management Collapsible Group */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setManagementOpen(!managementOpen)}
            className="flex items-center justify-between px-3 h-8 rounded-lg bg-[#4F46E5] text-white font-semibold text-xs shadow-md hover:bg-[#4338CA] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase size={15} className="text-white" />
              <span>Management</span>
            </div>
            {managementOpen ? (
              <ChevronUp size={14} className="text-indigo-200" />
            ) : (
              <ChevronDown size={14} className="text-indigo-200" />
            )}
          </button>

          {/* Submenu items */}
          {managementOpen && (
            <div className="flex flex-col gap-1 pt-1 pl-1">
              {/* CEO Dashboard (Active) */}
              <button
                onClick={() => {
                  onSelectNav('ceo_dashboard');
                  onCloseMobile();
                }}
                className={`flex items-center gap-2.5 px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                  activeNav === 'ceo_dashboard'
                    ? 'bg-[#112D65] border border-[#4F46E5] text-white font-semibold'
                    : 'text-slate-300 hover:bg-[#152347]'
                }`}
              >
                <LayoutDashboard
                  size={15}
                  className={activeNav === 'ceo_dashboard' ? 'text-blue-300' : 'text-slate-400'}
                />
                <span>CEO Dashboard</span>
              </button>

              {/* Approval Inbox */}
              <button
                onClick={() => {
                  onSelectNav('approval_inbox');
                  onCloseMobile();
                }}
                className={`flex items-center gap-2.5 px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                  activeNav === 'approval_inbox'
                    ? 'bg-[#112D65] border border-[#4F46E5] text-white font-semibold'
                    : 'text-slate-300 hover:bg-[#152347]'
                }`}
              >
                <Inbox size={15} className="text-slate-400" />
                <span>Approval Inbox</span>
              </button>

              {/* Follow-Up Queue */}
              <button
                onClick={() => {
                  onSelectNav('followup_queue');
                  onCloseMobile();
                }}
                className={`flex items-center gap-2.5 px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                  activeNav === 'followup_queue'
                    ? 'bg-[#112D65] border border-[#4F46E5] text-white font-semibold'
                    : 'text-slate-300 hover:bg-[#152347]'
                }`}
              >
                <Clock size={15} className="text-slate-400" />
                <span>Follow-Up Queue</span>
              </button>

              {/* Collections */}
              <button
                onClick={() => {
                  onSelectNav('collections');
                  onCloseMobile();
                }}
                className={`flex items-center gap-2.5 px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                  activeNav === 'collections'
                    ? 'bg-[#112D65] border border-[#4F46E5] text-white font-semibold'
                    : 'text-slate-300 hover:bg-[#152347]'
                }`}
              >
                <Coins size={15} className="text-slate-400" />
                <span>Collections</span>
              </button>
            </div>
          )}
        </div>

        {/* Other Collapsible Groups */}
        <div className="flex flex-col gap-1 mt-2">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectNav(item.id);
                onCloseMobile();
              }}
              className="flex items-center justify-between px-3 h-[34px] rounded-lg text-slate-300 text-xs font-medium hover:bg-[#152347] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-slate-400">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Footer (Help & Settings) */}
      <div className="border-t border-[#142144] p-3 flex flex-col gap-1 bg-[#0B1437]">
        <button
          onClick={() => {
            onSelectNav('help');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-[#152347] hover:text-white transition-colors"
        >
          <HelpCircle size={15} className="text-slate-400" />
          <span>Help & Support</span>
        </button>

        <button
          onClick={() => {
            onSelectNav('settings');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-[#152347] hover:text-white transition-colors"
        >
          <Settings size={15} className="text-slate-400" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-[280px] min-w-[280px] h-screen sticky top-0 z-30 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-[280px] max-w-[80vw] h-full shadow-2xl z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
