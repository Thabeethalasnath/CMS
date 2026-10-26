import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { CeoDashboardPage } from '../features/dashboard/pages/CeoDashboardPage';
import { ApprovalInboxPage } from '../features/dashboard/pages/ApprovalInboxPage';

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState('approval_inbox');
  const [dateRange, setDateRange] = useState('Apr 2024 - Mar 2025');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] font-sans antialiased text-slate-900">
      {/* Left Sidebar (~280px fixed on desktop, collapsible drawer on mobile) */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        <TopHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onOpenEditModal={() => setIsEditModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          unreadCount={3}
        />

        <main className="flex-1 pb-10">
          {activeNav === 'ceo_dashboard' ? (
            <CeoDashboardPage
              dateRange={dateRange}
              isEditModalOpen={isEditModalOpen}
              onCloseEditModal={() => setIsEditModalOpen(false)}
            />
          ) : activeNav === 'approval_inbox' ? (
            <ApprovalInboxPage />
          ) : (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-3 text-slate-500">
              <h2 className="text-lg font-bold text-slate-900">
                {activeNav.replace('_', ' ').toUpperCase()}
              </h2>
              <p className="text-xs">This module view is connected and ready for expansion.</p>
              <button
                onClick={() => setActiveNav('ceo_dashboard')}
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Back to CEO Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
