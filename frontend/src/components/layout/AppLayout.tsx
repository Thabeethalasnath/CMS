import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export interface AppLayoutContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchClear: () => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
}

export const AppLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('—');
  const [userName, setUserName] = useState('—');
  const [userRole, setUserRole] = useState('—');

  useEffect(() => {
    dashboardService.getDashboardData()
      .then((data) => {
        if (data.settings?.active_date_range) setDateRange(data.settings.active_date_range);
        if (data.settings?.user_name) setUserName(data.settings.user_name);
        if (data.settings?.user_role) setUserRole(data.settings.user_role);
      })
      .catch(() => {});
  }, []);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Side rail defaults to expanded; toggles and persists preference in localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('cms_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('cms_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
      }}
    >
      {/* CMS Main Sidebar with Collapsible Rail */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area: Header pinned at top, Main scrolling */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F8FAFC',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDateRange={dateRange}
          onDateRangeChange={setDateRange}
          userName={userName}
          userRole={userRole}
        />
        <main
          style={{
            flex: 1,
            width: '100%',
            minWidth: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Outlet
            context={{
              searchQuery,
              setSearchQuery,
              onSearchClear: () => setSearchQuery(''),
              dateRange,
              setDateRange,
              isEditModalOpen,
              setIsEditModalOpen,
            }}
          />
        </main>
      </div>
    </div>
  );
};
