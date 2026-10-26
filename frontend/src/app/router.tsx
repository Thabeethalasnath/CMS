import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ModulePlaceholder } from '../components/common/ModulePlaceholder';
import { navigationSections, footerNavigationItems } from '../config/navigation';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Default redirect to CEO Dashboard */}
        <Route index element={<Navigate to="/management/ceo-dashboard" replace />} />

        {/* Generate routes dynamically from navigation sections */}
        {navigationSections.map((section) =>
          section.items.map((item) => (
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
