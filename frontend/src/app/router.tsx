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
import { LeadsPage } from '../features/sales/pages/LeadsPage';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { AttendancePage } from '../features/attendance/pages/AttendancePage';
import { LeaveManagementPage } from '../features/leave/pages/LeaveManagementPage';

const CeoDashboardRoute: React.FC = () => {
  const context = useOutletContext<AppLayoutContextType>();
  return (
    <CeoDashboardPage
      dateRange={context?.dateRange || '—'}
      isEditModalOpen={context?.isEditModalOpen || false}
      onCloseEditModal={() => context?.setIsEditModalOpen?.(false)}
    />
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Redirect /login to CEO Dashboard */}
      <Route path="/login" element={<Navigate to="/management/ceo-dashboard" replace />} />

      <Route element={<AppLayout />}>
        {/* CEO Dashboard: Default First Screen and Dedicated Routes */}
        <Route index element={<CeoDashboardRoute />} />
        <Route path="/management/ceo-dashboard" element={<CeoDashboardRoute />} />
        <Route path="/dashboard" element={<Navigate to="/management/ceo-dashboard" replace />} />
        <Route path="/ceo-dashboard" element={<Navigate to="/management/ceo-dashboard" replace />} />
        <Route path="/management" element={<Navigate to="/management/ceo-dashboard" replace />} />
        <Route path="/management/dashboard" element={<Navigate to="/management/ceo-dashboard" replace />} />
        <Route path="/management/approval-inbox" element={<ApprovalInboxPage />} />
        <Route path="/management/follow-up-queue" element={<FollowUpQueuePage />} />
        <Route path="/management/collections" element={<CollectionsPage />} />
        <Route path="/finance/collections" element={<Navigate to="/management/collections" replace />} />
        <Route path="/sales/leads" element={<LeadsPage />} />
        <Route path="/sales/opportunities" element={<OpportunitiesPage />} />
        <Route path="/sales/proposals" element={<ProposalsPage />} />
        <Route path="/sales/contracts" element={<ContractsPage />} />
        <Route path="/clients/list" element={<ClientsPage />} />
        <Route path="/clients" element={<Navigate to="/clients/list" replace />} />
        <Route path="/hr/employee-master" element={<EmployeeMasterPage />} />
        <Route path="/hr/attendance" element={<AttendancePage />} />
        <Route path="/attendance" element={<Navigate to="/hr/attendance" replace />} />
        <Route path="/hr/leave" element={<LeaveManagementPage />} />
        <Route path="/leave" element={<Navigate to="/hr/leave" replace />} />

        {/* Generate dynamic module engine routes for all other navigation items */}
        {navigationSections.map((section) =>
          section.items
            .filter(
              (item) =>
                item.path !== '/management/ceo-dashboard' &&
                item.path !== '/management/approval-inbox' &&
                item.path !== '/management/follow-up-queue' &&
                item.path !== '/management/collections' &&
                item.path !== '/sales/leads' &&
                item.path !== '/sales/opportunities' &&
                item.path !== '/sales/proposals' &&
                item.path !== '/sales/contracts' &&
                item.path !== '/clients/list' &&
                item.path !== '/clients' &&
                item.path !== '/hr/employee-master' &&
                item.path !== '/hr/attendance' &&
                item.path !== '/attendance' &&
                item.path !== '/hr/leave' &&
                item.path !== '/leave'
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
