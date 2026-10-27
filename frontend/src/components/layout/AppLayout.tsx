import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export interface AppLayoutContextType {
  dateRange: string;
  setDateRange: (range: string) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
}

export const AppLayout: React.FC = () => {
  const [dateRange, setDateRange] = useState('Apr 2024 - Mar 2025');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
      }}
    >
      {/* CMS Main Sidebar */}
      <Sidebar />

      {/* Main Content Area: TopHeader + Scrollable Body */}
      <div
        style={{
          flex: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
          backgroundColor: '#F8FAFC',
        }}
      >
        <TopHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onOpenEditModal={() => setIsEditModalOpen(true)}
          unreadCount={3}
        />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#F8FAFC',
            boxSizing: 'border-box',
          }}
        >
          <Outlet context={{ dateRange, setDateRange, isEditModalOpen, setIsEditModalOpen }} />
        </main>
      </div>
    </div>
  );
};
