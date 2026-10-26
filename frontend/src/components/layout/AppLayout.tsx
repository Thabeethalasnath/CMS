import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
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

      {/* Main Content Area: Flow Horizontal / Scroll Vertical (Matching Figma 1280px canvas #FFFFFF / #F8FAFC) */}
      <main
        style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#F8FAFC',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};
