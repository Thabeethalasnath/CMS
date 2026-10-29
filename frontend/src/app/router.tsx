import React from 'react';
import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AppLayout, AppLayoutContextType } from '../components/layout/AppLayout';
import { ModulePlaceholder } from '../components/common/ModulePlaceholder';
import { navigationSections, footerNavigationItems } from '../config/navigation';
import { CeoDashboardPage } from '../features/dashboard/pages/CeoDashboardPage';
import { ApprovalInboxPage } from '../features/dashboard/pages/ApprovalInboxPage';
import { LeadsPage } from '../features/sales/pages/LeadsPage';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { AttendancePage } from '../features/attendance/pages/AttendancePage';

const CeoDashboardRoute: React.FC = () => {
  const context = useOutletContext<AppLayoutContextType>();
  return (
    <CeoDashboardPage
      dateRange={context?.dateRange || 'Apr 2024 - Mar 2025'}
      isEditModalOpen={context?.isEditModalOpen || false}
      onCloseEditModal={() => context?.setIsEditModalOpen(false)}
    />
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Default redirect to CEO Dashboard */}
        <Route index element={<Navigate to="/management/ceo-dashboard" replace />} />

        {/* Dedicated Full Pages */}
        <Route path="/management/ceo-dashboard" element={<CeoDashboardRoute />} />
        <Route path="/management/approval-inbox" element={<ApprovalInboxPage />} />
        <Route path="/sales/leads" element={<LeadsPage />} />
        <Route path="/clients/list" element={<ClientsPage />} />
        <Route path="/clients" element={<Navigate to="/clients/list" replace />} />
        <Route path="/hr/attendance" element={<AttendancePage />} />
        <Route path="/attendance" element={<Navigate to="/hr/attendance" replace />} />

        {/* Generate placeholder routes dynamically for all other navigation items */}
        {navigationSections.map((section) =>
          section.items
            .filter(
              (item) =>
                item.path !== '/management/ceo-dashboard' &&
                item.path !== '/management/approval-inbox' &&
                item.path !== '/sales/leads' &&
                item.path !== '/clients/list' &&
                item.path !== '/clients' &&
                item.path !== '/hr/attendance' &&
                item.path !== '/attendance'
            )
            .map((item) => (
              <Route
                key={item.id}
                path={item.path}
                element={<ModulePlaceholder title={item.label} category={section.title} />}
              />
            ))
        )}

        {/* Footer Navigation items */}
        {footerNavigationItems.map((item) => (
          <Route
            key={item.id}
            path={item.path}
            element={<ModulePlaceholder title={item.label} category="Support & Preferences" />}
          />
        ))}

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/management/ceo-dashboard" replace />} />
      </Route>
    </Routes>
  );
};
