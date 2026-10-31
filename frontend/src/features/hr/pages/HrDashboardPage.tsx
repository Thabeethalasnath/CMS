import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HrDashboardHeader } from '../components/HrDashboardHeader';
import { WorkforceOverviewSection } from '../components/WorkforceOverviewSection';
import { RecruitmentOverviewSection } from '../components/RecruitmentOverviewSection';
import { LeaveManagementSection } from '../components/LeaveManagementSection';
import { AttendanceOverviewSection } from '../components/AttendanceOverviewSection';
import { EmployeeLifecycleSection } from '../components/EmployeeLifecycleSection';
import { RecentActivitiesSection } from '../components/RecentActivitiesSection';
import { QuickActionsSection } from '../components/QuickActionsSection';
import { HrChartsSection } from '../components/HrChartsSection';
import { HrAddEmployeeModal } from '../components/HrAddEmployeeModal';
import { ManageLeavesModal } from '../components/ManageLeavesModal';
import { ViewAttendanceModal } from '../components/ViewAttendanceModal';
import { ViewEmployeesModal } from '../components/ViewEmployeesModal';
import { ViewRecruitmentModal } from '../components/ViewRecruitmentModal';

import {
  Department,
  EmployeeRecord,
  CandidateRecord,
  LeaveRecord,
  AttendanceRecord,
  RecentActivityItem,
  HrDashboardData,
  HrDashboardMetrics,
} from '../types';
import { INITIAL_QUICK_ACTIONS } from '../mockData';
import { hrApiService } from '../services/hrApiService';
import { ToastNotification, useToast } from '../../../components/ui/ToastNotification';
import { AppLayoutContextType } from '../../../components/layout/AppLayout';

export const HrDashboardPage: React.FC = () => {
  // Global layout context if available
  const outletCtx = useOutletContext<AppLayoutContextType | undefined>();

  // Backend Live Datasets in State
  const [dashboardData, setDashboardData] = useState<HrDashboardData | null>(null);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active Filters & View Controls
  const [selectedDept, setSelectedDept] = useState<Department>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    outletCtx?.dateRange || 'Apr 2024 - Mar 2025'
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [lastUpdated, setLastUpdated] = useState('—');

  // Modals Visibility
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isManageLeavesOpen, setIsManageLeavesOpen] = useState(false);
  const [isViewAttendanceOpen, setIsViewAttendanceOpen] = useState(false);
  const [isViewEmployeesOpen, setIsViewEmployeesOpen] = useState(false);
  const [employeeModalStatus, setEmployeeModalStatus] = useState<string>('All');
  const [isViewRecruitmentOpen, setIsViewRecruitmentOpen] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  // Load Primary HR Dashboard Data
  const loadDashboardData = useCallback(async (dept: Department, period: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hrApiService.getHrDashboardData(dept, period);
      setDashboardData(data);
      if (data.lastUpdated) {
        setLastUpdated(data.lastUpdated);
      }
      if (data.recentActivities) {
        setActivities(data.recentActivities);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to connect to HR dashboard backend service.';
      setError(errMsg);
      addToast('error', 'Dashboard Load Failed', errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Load Supplementary Datasets for Modals & Analytics
  const loadSupplementaryDatasets = useCallback(async () => {
    try {
      setIsLoadingEmployees(true);
      const [empRes, candRes, leaveRes, attRes] = await Promise.allSettled([
        hrApiService.getEmployees({ size: 100 }),
        hrApiService.getCandidates(),
        hrApiService.getLeaves(),
        hrApiService.getAttendance(),
      ]);

      if (empRes.status === 'fulfilled') {
        setEmployees(empRes.value.content || []);
      }
      if (candRes.status === 'fulfilled') {
        setCandidates(candRes.value || []);
      }
      if (leaveRes.status === 'fulfilled') {
        setLeaves(leaveRes.value || []);
      }
      if (attRes.status === 'fulfilled') {
        setAttendance(attRes.value || []);
      }
    } catch (err) {
      console.error('Error fetching supplementary HR datasets:', err);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, []);

  // Initial and reactive data fetching
  useEffect(() => {
    loadDashboardData(selectedDept, selectedPeriod);
  }, [loadDashboardData, selectedDept, selectedPeriod]);

  useEffect(() => {
    loadSupplementaryDatasets();
  }, [loadSupplementaryDatasets]);

  // Metrics resolution from backend data
  const metrics: HrDashboardMetrics = useMemo(() => {
    if (dashboardData) {
      return {
        workforce: dashboardData.workforce || {
          activeEmployees: 0,
          onNotice: 0,
          totalMonthlyCtc: '₹0',
          newHiresThisMonth: 0,
        },
        recruitment: dashboardData.recruitment || {
          openCandidates: 0,
          candidatesOver30Days: 0,
        },
        leave: dashboardData.leave || {
          pendingApprovals: 0,
        },
        attendance: dashboardData.attendance || {
          records: 0,
          halfDays: 0,
          lateRecords: 0,
        },
        lifecycle: dashboardData.lifecycle || {
          employeesExiting: 0,
        },
      };
    }

    return {
      workforce: { activeEmployees: 0, onNotice: 0, totalMonthlyCtc: '₹0', newHiresThisMonth: 0 },
      recruitment: { openCandidates: 0, candidatesOver30Days: 0 },
      leave: { pendingApprovals: 0 },
      attendance: { records: 0, halfDays: 0, lateRecords: 0 },
      lifecycle: { employeesExiting: 0 },
    };
  }, [dashboardData]);

  // Filtered Activities by Department
  const filteredActivities = useMemo(() => {
    if (selectedDept === 'All') return activities;
    return activities.filter((a) => !a.department || a.department === selectedDept);
  }, [activities, selectedDept]);

  // Handlers
  const handleRefresh = async () => {
    try {
      const refreshed = await hrApiService.refreshHrDashboard();
      setDashboardData(refreshed);
      if (refreshed.lastUpdated) {
        setLastUpdated(refreshed.lastUpdated);
      }
      if (refreshed.recentActivities) {
        setActivities(refreshed.recentActivities);
      }
      await loadSupplementaryDatasets();
      addToast(
        'success',
        'HR Dashboard Refreshed',
        'Workforce metrics, leaves, and activity logs synchronized with backend.'
      );
    } catch (err: any) {
      addToast(
        'error',
        'Refresh Failed',
        err?.message || 'Could not synchronize dashboard with backend.'
      );
    }
  };

  const handleAddEmployee = async (empData: Omit<EmployeeRecord, 'id'>): Promise<boolean> => {
    try {
      const created = await hrApiService.createEmployee(empData);
      setEmployees((prev) => [created, ...prev]);

      // Optimistically push activity to top
      const nowIso = new Date();
      const formattedDate = nowIso.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const newActivity: RecentActivityItem = {
        id: `act-${Date.now()}`,
        date: formattedDate,
        rawDate: nowIso.toISOString().split('T')[0],
        type: 'Employee',
        typeColor: '#2563EB',
        description: `${created.name} added as ${created.role} in ${created.department}`,
        status: 'Completed',
        department: created.department,
      };
      setActivities((prev) => [newActivity, ...prev]);

      // Refresh live dashboard metrics and activities
      await loadDashboardData(selectedDept, selectedPeriod);

      addToast(
        'success',
        'Employee Added',
        `${created.name} (${created.id}) has been enrolled into the ${created.department} team.`
      );
      return true;
    } catch (err: any) {
      addToast(
        'error',
        'Failed to Add Employee',
        err?.message || 'Could not save employee record to backend database.'
      );
      return false;
    }
  };

  const handleUpdateLeaveStatus = async (leaveId: string, newStatus: 'Approved' | 'Rejected'): Promise<boolean> => {
    try {
      const updated = await hrApiService.updateLeaveStatus(leaveId, newStatus);
      setLeaves((prev) =>
        prev.map((l) => (String(l.id) === String(leaveId) ? (updated || { ...l, status: newStatus }) : l))
      );

      // Refresh live dashboard metrics and activities
      await loadDashboardData(selectedDept, selectedPeriod);

      addToast(
        newStatus === 'Approved' ? 'success' : 'warning',
        `Leave ${newStatus}`,
        `Leave request #${leaveId} has been marked as ${newStatus.toLowerCase()}.`
      );
      return true;
    } catch (err: any) {
      addToast(
        'error',
        'Failed to Update Leave',
        err?.message || 'Could not update leave approval status.'
      );
      return false;
    }
  };

  const handleAddAttendance = async (attData: Omit<AttendanceRecord, 'id'>): Promise<boolean> => {
    try {
      const todayIso = new Date().toISOString().split('T')[0];
      const created = await hrApiService.logAttendance({
        employeeId: attData.employeeId,
        employeeName: attData.employeeName,
        status: attData.status,
        attendanceDate: attData.date || todayIso,
        checkIn: attData.checkIn,
        notes: attData.department,
      });

      setAttendance((prev) => [created, ...prev]);

      // Refresh live dashboard metrics and activities
      await loadDashboardData(selectedDept, selectedPeriod);

      addToast(
        'success',
        'Attendance Logged',
        `${created.employeeName} registered as ${created.status} for ${created.date || created.attendanceDate}.`
      );
      return true;
    } catch (err: any) {
      addToast(
        'error',
        'Failed to Log Attendance',
        err?.message || 'Could not record employee attendance.'
      );
      return false;
    }
  };

  const handleQuickAction = (key: 'add-employee' | 'manage-leaves' | 'view-attendance') => {
    if (key === 'add-employee') setIsAddEmployeeOpen(true);
    if (key === 'manage-leaves') setIsManageLeavesOpen(true);
    if (key === 'view-attendance') setIsViewAttendanceOpen(true);
  };

  return (
    <div
      className="p-4 sm:p-6 lg:p-7 max-w-[1400px] mx-auto w-full min-h-full flex flex-col gap-5"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Toast Notification Hub */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} position="top-right" />

      {/* 1. Header with Title, Period & Department Filters, and Overview/Analytics Tabs */}
      <HrDashboardHeader
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Backend Connection Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between text-xs text-red-700 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Backend Notice:</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => {
              loadDashboardData(selectedDept, selectedPeriod);
              loadSupplementaryDatasets();
            }}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* View Switcher: Overview vs Analytics */}
      {activeTab === 'overview' ? (
        <>
          {/* 2. Workforce Overview (Full width) */}
          <WorkforceOverviewSection
            activeEmployees={metrics.workforce.activeEmployees}
            onNotice={metrics.workforce.onNotice}
            totalMonthlyCtc={metrics.workforce.totalMonthlyCtc}
            newHiresThisMonth={metrics.workforce.newHiresThisMonth}
            onViewClick={() => {
              setEmployeeModalStatus('All');
              setIsViewEmployeesOpen(true);
            }}
          />

          {/* 3 & 4. Recruitment Overview (7 cols) + Leave Management (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 flex flex-col min-w-0">
              <RecruitmentOverviewSection
                openCandidates={metrics.recruitment.openCandidates}
                candidatesOver30Days={metrics.recruitment.candidatesOver30Days}
                onViewClick={() => setIsViewRecruitmentOpen(true)}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col min-w-0">
              <LeaveManagementSection
                pendingApprovals={metrics.leave.pendingApprovals}
                onViewClick={() => setIsManageLeavesOpen(true)}
              />
            </div>
          </div>

          {/* 5 & 6. Attendance Overview (7 cols) + Employee Lifecycle (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 flex flex-col min-w-0">
              <AttendanceOverviewSection
                records={metrics.attendance.records}
                halfDays={metrics.attendance.halfDays}
                lateRecords={metrics.attendance.lateRecords}
                effectiveDate={dashboardData?.attendance?.effectiveDate}
                onViewClick={() => setIsViewAttendanceOpen(true)}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col min-w-0">
              <EmployeeLifecycleSection
                employeesExiting={metrics.lifecycle.employeesExiting}
                onViewClick={() => {
                  setEmployeeModalStatus('On Notice');
                  setIsViewEmployeesOpen(true);
                }}
              />
            </div>
          </div>

          {/* 7 & 8. Recent Activities (7 cols) + Quick Actions (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 flex flex-col min-w-0">
              <RecentActivitiesSection activities={filteredActivities} />
            </div>
            <div className="lg:col-span-5 flex flex-col min-w-0">
              <QuickActionsSection
                actions={INITIAL_QUICK_ACTIONS}
                onActionClick={handleQuickAction}
              />
            </div>
          </div>
        </>
      ) : (
        /* Analytics & Trends Tab using Universal Charts */
        <HrChartsSection
          employees={
            selectedDept === 'All'
              ? employees
              : employees.filter((e) => e.department === selectedDept)
          }
          attendance={
            selectedDept === 'All'
              ? attendance
              : attendance.filter((a) => a.department === selectedDept)
          }
        />
      )}

      {/* Interactive Modals */}
      <HrAddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      <ManageLeavesModal
        isOpen={isManageLeavesOpen}
        onClose={() => setIsManageLeavesOpen(false)}
        leaves={selectedDept === 'All' ? leaves : leaves.filter((l) => l.department === selectedDept)}
        onUpdateStatus={handleUpdateLeaveStatus}
      />

      <ViewAttendanceModal
        isOpen={isViewAttendanceOpen}
        onClose={() => setIsViewAttendanceOpen(false)}
        attendance={attendance}
        employees={employees}
        onAddAttendance={handleAddAttendance}
      />

      <ViewEmployeesModal
        isOpen={isViewEmployeesOpen}
        onClose={() => setIsViewEmployeesOpen(false)}
        employees={employees}
        isLoading={isLoadingEmployees}
        onOpenAddModal={() => setIsAddEmployeeOpen(true)}
        initialStatus={employeeModalStatus}
      />

      <ViewRecruitmentModal
        isOpen={isViewRecruitmentOpen}
        onClose={() => setIsViewRecruitmentOpen(false)}
        candidates={candidates}
      />
    </div>
  );
};
