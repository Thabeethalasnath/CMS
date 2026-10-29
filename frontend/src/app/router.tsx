import React from 'react';
import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AppLayout, AppLayoutContextType } from '../components/layout/AppLayout';
import { ModulePlaceholder } from '../components/common/ModulePlaceholder';
import { navigationSections, footerNavigationItems } from '../config/navigation';
import { CeoDashboardPage } from '../features/dashboard/pages/CeoDashboardPage';
import { ApprovalInboxPage } from '../features/dashboard/pages/ApprovalInboxPage';
import { FollowUpQueuePage } from '../features/dashboard/pages/FollowUpQueuePage';
import { OpportunitiesPage } from '../features/sales/pages/OpportunitiesPage';
import { ContractsPage } from '../features/sales/pages/ContractsPage';
import { ProposalsPage } from '../features/proposals/pages/ProposalsPage';
import { CollectionsPage } from '../features/collections/pages/CollectionsPage';
import { EmployeeMasterPage } from '../features/hr/pages/EmployeeMasterPage';

const CeoDashboardRoute: React.FC = () => {
  const context = useOutletContext<AppLayoutContextType>();
  return (
    <CeoDashboardPage
      dateRange={context?.dateRange || 'Apr 2024 - Mar 2025'}
      isEditModalOpen={context?.isEditModalOpen || false}
      onCloseEditModal={() => context?.setIsEditModalOpen?.(false)}
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
        <Route path="/management/follow-up-queue" element={<FollowUpQueuePage />} />
        <Route path="/management/collections" element={<CollectionsPage />} />
        <Route path="/sales/opportunities" element={<OpportunitiesPage />} />
        <Route path="/sales/proposals" element={<ProposalsPage />} />
        <Route path="/sales/contracts" element={<ContractsPage />} />
        <Route path="/hr/employee-master" element={<EmployeeMasterPage />} />

        {/* Generate dynamic module engine routes for all other navigation items */}
        {navigationSections.map((section) =>
          section.items
            .filter(
              (item) =>
                item.path !== '/management/ceo-dashboard' &&
                item.path !== '/management/approval-inbox' &&
                item.path !== '/management/follow-up-queue' &&
                item.path !== '/management/collections' &&
                item.path !== '/sales/opportunities' &&
                item.path !== '/sales/proposals' &&
                item.path !== '/sales/contracts' &&
                item.path !== '/hr/employee-master'
            )
            .map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={<ModulePlaceholder title={item.label} category={section.title} />}
              />
            ))
        )}

        {/* Footer navigation routes */}
        {footerNavigationItems.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={<ModulePlaceholder title={item.label} category="General" />}
          />
        ))}

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/management/ceo-dashboard" replace />} />
      </Route>
    </Routes>
  );
};
