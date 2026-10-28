import React from 'react';
import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AppLayout, AppLayoutContextType } from '../components/layout/AppLayout';
import { ModulePlaceholder } from '../components/common/ModulePlaceholder';
import { navigationSections, footerNavigationItems } from '../config/navigation';
import { CeoDashboardPage } from '../features/dashboard/pages/CeoDashboardPage';
import { ApprovalInboxPage } from '../features/dashboard/pages/ApprovalInboxPage';
import { FollowUpQueuePage } from '../features/dashboard/pages/FollowUpQueuePage';
import { OpportunitiesPage } from '../features/sales/pages/OpportunitiesPage';

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
        {/* Default redirect to Follow-Up Queue (as configured in local changes) */}
        <Route index element={<Navigate to="/management/follow-up-queue" replace />} />

        {/* Dedicated Full Pages */}
        <Route path="/management/follow-up-queue" element={<FollowUpQueuePage />} />
        <Route path="/management/ceo-dashboard" element={<CeoDashboardRoute />} />
        <Route path="/management/approval-inbox" element={<ApprovalInboxPage />} />
        <Route path="/sales/opportunities" element={<OpportunitiesPage />} />

        {/* Generate placeholder routes dynamically for all other navigation items */}
        {navigationSections.map((section) =>
          section.items
            .filter(
              (item) =>
                item.path !== '/management/ceo-dashboard' &&
                item.path !== '/management/approval-inbox' &&
                item.path !== '/management/follow-up-queue' &&
                item.path !== '/sales/opportunities'
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
        <Route path="*" element={<Navigate to="/management/follow-up-queue" replace />} />
      </Route>
    </Routes>
  );
};
