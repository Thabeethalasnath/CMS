import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PayrollHeader } from '../components/payroll/PayrollHeader';
import { PayrollKpis } from '../components/payroll/PayrollKpis';
import { PayrollFilterCard } from '../components/payroll/PayrollFilterCard';
import { PayrollTable } from '../components/payroll/PayrollTable';
import { ProcessPayrollModal } from '../components/payroll/ProcessPayrollModal';
import { PayslipModal } from '../components/payroll/PayslipModal';
import { ToastNotification, useToast } from '../../../components/ui/ToastNotification';
import {
  PayrollRecord,
  PayrollKpiData,
  PayrollFilters,
  PayrollSortOption,
  PayrollFilterOptions,
  ProcessPayrollPayload,
} from '../types/payroll';
import { payrollService } from '../services/payrollService';

export const PayrollSalaryPage: React.FC = () => {
  // 1. Records and pagination
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(248);
  const [filteredCount, setFilteredCount] = useState<number>(248);
  const [lastUpdated, setLastUpdated] = useState('15 Oct 2026, 11:30 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Filters
  const defaultFilters: PayrollFilters = {
    search: '',
    payrollMonth: 'Oct 2026',
    employmentType: 'All',
    status: 'All',
    employee: 'All',
  };
  const [filters, setFilters] = useState<PayrollFilters>(defaultFilters);

  // 3. Filter options from DB
  const [filterOptions, setFilterOptions] = useState<PayrollFilterOptions>({
    payrollMonths: ['Oct 2026', 'Sep 2026', 'Aug 2026'],
    employmentTypes: ['Full Time', 'Contract', 'Part Time', 'Intern'],
    statuses: ['Paid', 'Pending', 'Processing', 'Failed'],
    employees: [],
  });

  // 4. Sorting & Pagination
  const [sortOption, setSortOption] = useState<PayrollSortOption>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 5. KPIs
  const [kpiData, setKpiData] = useState<PayrollKpiData>({
    totalEmployees: 248,
    totalEmployeesTrend: '8% vs last month',
    totalEmployeesTrendPositive: true,
    totalPayrollCost: 4820000,
    formattedTotalPayrollCost: '₹ 48,20,000',
    totalPayrollCostTrend: '12% vs last month',
    totalPayrollCostTrendPositive: true,
    netPayDisbursed: 3890000,
    formattedNetPayDisbursed: '₹ 38,90,000',
    netPayDisbursedTrend: '10% vs last month',
    netPayDisbursedTrendPositive: true,
    pendingPayrolls: 12,
    pendingPayrollsTrend: '20% vs last month',
    pendingPayrollsTrendPositive: false,
    lastUpdated: '15 Oct 2026, 11:30 AM',
  });

  // 6. Modal states
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [selectedPayslipRecord, setSelectedPayslipRecord] = useState<PayrollRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 7. Toast notifications
  const { toasts, addToast, removeToast } = useToast();

  // Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.payrollMonth !== 'Oct 2026' && filters.payrollMonth !== 'All') count++;
    if (filters.employmentType !== 'All') count++;
    if (filters.status !== 'All') count++;
    if (filters.employee !== 'All' && filters.employee !== 'All Employees') count++;
    return count;
  }, [filters]);

  // Fetch records from backend
  const fetchRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await payrollService.getPayrollRecords({
        search: filters.search,
        payrollMonth: filters.payrollMonth,
        employmentType: filters.employmentType,
        status: filters.status,
        employee: filters.employee,
        sort: sortOption,
        page: currentPage,
        size: pageSize,
      });

      setRecords(res.content || []);
      setFilteredCount(res.totalElements ?? 0);
      if (filters.payrollMonth === 'All' && !filters.search) {
        setTotalRecords(res.totalElements ?? 0);
      }
    } catch (err: any) {
      console.error('Error fetching payroll records:', err);
      addToast(
        'error',
        'Failed to Load Records',
        err.message || 'Could not fetch payroll records from database.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortOption, currentPage, pageSize, addToast]);

  // Fetch KPIs and filter options
  const fetchMetadata = useCallback(async () => {
    try {
      const [kpiRes, optionsRes] = await Promise.all([
        payrollService.getKpis(filters.payrollMonth),
        payrollService.getFilterOptions(),
      ]);

      if (kpiRes) {
        setKpiData(kpiRes);
        if (kpiRes.lastUpdated) {
          setLastUpdated(kpiRes.lastUpdated);
        }
      }
      if (optionsRes) {
        setFilterOptions(optionsRes);
      }
    } catch (err: any) {
      console.error('Error fetching payroll metadata:', err);
    }
  }, [filters.payrollMonth]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchRecords(), fetchMetadata()]);
    setIsRefreshing(false);
    addToast('success', 'Payroll Refreshed', 'Latest payroll data synced from database.');
  };

  // Handle Export
  const handleExport = async () => {
    try {
      await payrollService.exportPayrollCsv({
        search: filters.search,
        payrollMonth: filters.payrollMonth,
        employmentType: filters.employmentType,
        status: filters.status,
        employee: filters.employee,
        sort: sortOption,
      });
      addToast('success', 'Export Completed', 'Payroll report has been downloaded successfully.');
    } catch (err: any) {
      addToast('error', 'Export Failed', err.message || 'Failed to export payroll report.');
    }
  };

  // Handle Filter Change
  const handleFilterChange = <K extends keyof PayrollFilters>(key: K, value: PayrollFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle Clear Filters
  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    addToast('info', 'Filters Cleared', 'All payroll filter criteria have been reset.');
  };

  // Handle Process Payroll
  const handleProcessPayrollSubmit = async (payload: ProcessPayrollPayload) => {
    try {
      setIsSubmitting(true);
      const created = await payrollService.processPayroll(payload);
      addToast(
        'success',
        'Payroll Processed',
        `Disbursement recorded for ${created.employeeName} (${created.payrollId}).`
      );
      await Promise.all([fetchRecords(), fetchMetadata()]);
    } catch (err: any) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle View Payslip
  const handleViewPayslip = (record: PayrollRecord) => {
    setSelectedPayslipRecord(record);
    setIsPayslipModalOpen(true);
  };

  // Handle Download Payslip
  const handleDownloadPayslip = (record: PayrollRecord) => {
    setSelectedPayslipRecord(record);
    setIsPayslipModalOpen(true);
  };

  // Handle Mark as Paid
  const handleMarkPaid = async (record: PayrollRecord) => {
    try {
      await payrollService.updatePayroll(record.payrollId, {
        paymentStatus: 'Paid',
        paymentDate: new Date().toISOString().slice(0, 10),
      });
      addToast('success', 'Status Updated', `${record.payrollId} marked as Paid.`);
      await Promise.all([fetchRecords(), fetchMetadata()]);
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message || 'Could not update payment status.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto flex flex-col gap-6 w-full">
      {/* Toast Notifications Portal */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      {/* 1. Header with Title, Timestamp, Sync, Export, and Process Payroll Button */}
      <PayrollHeader
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onProcessPayroll={() => setIsProcessModalOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* 2. Four KPI Metric Cards */}
      <PayrollKpis kpiData={kpiData} />

      {/* 3. Filter Bar Card */}
      <PayrollFilterCard
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* 4. Payroll Records Table */}
      <PayrollTable
        records={records}
        totalRecords={totalRecords}
        filteredCount={filteredCount}
        sortOption={sortOption}
        onSortChange={setSortOption}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        onViewPayslip={handleViewPayslip}
        onDownloadPayslip={handleDownloadPayslip}
        onMarkPaid={handleMarkPaid}
      />

      {/* 5. Process Payroll Modal */}
      <ProcessPayrollModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        onSubmit={handleProcessPayrollSubmit}
        filterOptions={filterOptions}
        isSubmitting={isSubmitting}
      />

      {/* 6. Payslip View & Print Modal */}
      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => {
          setIsPayslipModalOpen(false);
          setSelectedPayslipRecord(null);
        }}
        record={selectedPayslipRecord}
      />
    </div>
  );
};
