import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Users,
  RefreshCw,
  Plus,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Upload,
  Info,
  MoreVertical,
  CheckCircle2,
  Clock,
  Briefcase,
  IndianRupee,
  UserCheck,
} from 'lucide-react';
import { EmployeeData, EmployeeSummaryData, CreateEmployeePayload } from '@/types/employee';
import { employeeService } from '@/services/employeeService';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { EmployeeDetailModal } from '../components/EmployeeDetailModal';

const formatCurrency = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '₹ 0';
  if (typeof val === 'string' && val.includes('₹')) return val;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '₹ 0';
  return '₹ ' + num.toLocaleString('en-IN');
};

export const EmployeeMasterPage: React.FC = () => {
  // Data state
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [summary, setSummary] = useState<EmployeeSummaryData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('15 Mar 2025, 10:30 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filters & Search controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedDesignation, setSelectedDesignation] = useState('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedReportingManager, setSelectedReportingManager] = useState('All');
  const [selectedTenureStatus, setSelectedTenureStatus] = useState('All');
  const [joiningDateRange, setJoiningDateRange] = useState('');
  const [sortBy, setSortBy] = useState('Joining Date (Newest)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('8 per page');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Fetch live data from backend
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [items, summaryData] = await Promise.all([
        employeeService.getEmployees(),
        employeeService.getSummary().catch(() => null),
      ]);
      setEmployees(items || []);
      if (summaryData) {
        setSummary(summaryData);
      }
      const now = new Date();
      setLastUpdated(
        `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      );
    } catch (err) {
      console.error('Failed to fetch employee data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedDesignation('All');
    setSelectedEmploymentType('All');
    setSelectedStatus('All');
    setSelectedLocation('All');
    setSelectedReportingManager('All');
    setSelectedTenureStatus('All');
    setJoiningDateRange('');
    setCurrentPage(1);
  };

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedDepartment !== 'All') count++;
    if (selectedDesignation !== 'All') count++;
    if (selectedEmploymentType !== 'All') count++;
    if (selectedStatus !== 'All') count++;
    if (selectedLocation !== 'All') count++;
    if (selectedReportingManager !== 'All') count++;
    if (selectedTenureStatus !== 'All') count++;
    if (joiningDateRange) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedDepartment,
    selectedDesignation,
    selectedEmploymentType,
    selectedStatus,
    selectedLocation,
    selectedReportingManager,
    selectedTenureStatus,
    joiningDateRange,
    searchQuery,
  ]);

  // Unique filter option lists from live data
  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set).sort();
  }, [employees]);

  const designations = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.designation) set.add(e.designation);
    });
    return Array.from(set).sort();
  }, [employees]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.location) set.add(e.location);
    });
    return Array.from(set).sort();
  }, [employees]);

  const reportingManagers = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.reportingManager) set.add(e.reportingManager);
    });
    return Array.from(set).sort();
  }, [employees]);

  // Filtered & Sorted employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((e) => {
        if (selectedDepartment !== 'All' && e.department.toLowerCase() !== selectedDepartment.toLowerCase()) {
          return false;
        }
        if (selectedDesignation !== 'All' && e.designation.toLowerCase() !== selectedDesignation.toLowerCase()) {
          return false;
        }
        if (selectedEmploymentType !== 'All' && e.employmentType.toLowerCase() !== selectedEmploymentType.toLowerCase()) {
          return false;
        }
        if (selectedStatus !== 'All' && e.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
        if (selectedLocation !== 'All' && e.location.toLowerCase() !== selectedLocation.toLowerCase()) {
          return false;
        }
        if (selectedReportingManager !== 'All' && e.reportingManager.toLowerCase() !== selectedReportingManager.toLowerCase()) {
          return false;
        }
        if (selectedTenureStatus !== 'All' && e.tenureStatus.toLowerCase() !== selectedTenureStatus.toLowerCase()) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = e.employeeId.toLowerCase().includes(q);
          const matchCode = e.employeeCode.toLowerCase().includes(q);
          const matchName = e.fullName.toLowerCase().includes(q);
          const matchEmail = e.workEmail.toLowerCase().includes(q);
          const matchPhone = e.phone.toLowerCase().includes(q);
          if (!matchId && !matchCode && !matchName && !matchEmail && !matchPhone) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Joining Date (Newest)') {
          return (b.orderIndex || b.id) - (a.orderIndex || a.id);
        }
        if (sortBy === 'Joining Date (Oldest)') {
          return (a.orderIndex || a.id) - (b.orderIndex || b.id);
        }
        if (sortBy === 'Employee ID (Asc)') {
          return a.employeeId.localeCompare(b.employeeId);
        }
        if (sortBy === 'Employee ID (Desc)') {
          return b.employeeId.localeCompare(a.employeeId);
        }
        if (sortBy === 'Name (A-Z)') {
          return a.fullName.localeCompare(b.fullName);
        }
        if (sortBy === 'CTC (High to Low)') {
          return (b.monthlyCtc || 0) - (a.monthlyCtc || 0);
        }
        return (a.orderIndex || a.id) - (b.orderIndex || b.id);
      });
  }, [
    employees,
    selectedDepartment,
    selectedDesignation,
    selectedEmploymentType,
    selectedStatus,
    selectedLocation,
    selectedReportingManager,
    selectedTenureStatus,
    searchQuery,
    sortBy,
  ]);

  // Pagination calculation
  const limit = parseInt(pageSize, 10) || 8;
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / limit));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredEmployees.slice(start, start + limit);
  }, [filteredEmployees, currentPage, limit]);

  // Actions
  const handleCreateEmployee = async (payload: CreateEmployeePayload) => {
    await employeeService.createEmployee(payload);
    await fetchData();
  };

  const handleUpdateEmployee = async (id: number, data: Partial<EmployeeData>) => {
    await employeeService.updateEmployee(id, data);
    await fetchData();
  };

  const handleDeleteEmployee = async (id: number) => {
    await employeeService.deleteEmployee(id);
    await fetchData();
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Employee ID,Employee Code,Full Name,Email,Phone,Department,Designation,Employment Type,Status,Location,Reporting Manager,Joining Date,Monthly CTC',
        ...filteredEmployees.map(
          (e) =>
            `"${e.employeeId}","${e.employeeCode}","${e.fullName}","${e.workEmail}","${e.phone}","${e.department}","${e.designation}","${e.employmentType}","${e.status}","${e.location}","${e.reportingManager}","${e.joiningDate}",${e.monthlyCtc}`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
            Active
          </span>
        );
      case 'on notice':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            On Notice
          </span>
        );
      case 'probation':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            Probation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 space-y-5">
        {/* Page Title & Top Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[10px] bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0D9488] shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-[#0F172A] tracking-tight">Employee Master</h1>
              <p className="text-[12px] text-[#64748B]">
                Manage employee profiles, employment details, organisational information, and compensation records.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <span className="text-[12px] text-[#64748B] mr-1">
              Last Updated: {lastUpdated}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh employee data"
              className="w-8 h-8 rounded-[6px] border border-[#E2E8F0] bg-white text-[#64748B] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
            <button
              onClick={() => alert('Import CSV/Excel functionality')}
              className="h-8 px-3.5 rounded-[6px] border border-[#E2E8F0] bg-white text-[12px] font-medium text-[#334155] flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-[#64748B]" />
              Import
            </button>
            <button
              onClick={handleExport}
              className="h-8 px-3.5 rounded-[6px] border border-[#E2E8F0] bg-white text-[12px] font-medium text-[#334155] flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-8 px-3.5 rounded-[6px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[12px] font-medium flex items-center gap-1 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Section - KPICards (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Employees */}
          <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-4 flex items-center gap-3.5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
            <div className="w-11 h-11 rounded-[8px] bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748B]">Total Employees</p>
              <p className="text-[22px] font-bold text-[#0F172A] leading-tight mt-0.5">
                {summary?.totalEmployees ?? employees.length}
              </p>
              <p className="text-[11px] mt-0.5 flex items-center gap-1">
                <span className="text-[#10B981] font-semibold">
                  {summary?.totalEmployeesTrend ? summary.totalEmployeesTrend.split(' ')[0] + ' ' + summary.totalEmployeesTrend.split(' ')[1] : '↑ 12%'}
                </span>
                <span className="text-[#94A3B8]">vs last month</span>
              </p>
            </div>
          </div>

          {/* Card 2: Active Employees */}
          <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-4 flex items-center gap-3.5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
            <div className="w-11 h-11 rounded-[8px] bg-[#ECFDF5] flex items-center justify-center text-[#059669] flex-shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748B]">Active Employees</p>
              <p className="text-[22px] font-bold text-[#0F172A] leading-tight mt-0.5">
                {summary?.activeEmployees ?? employees.filter((e) => e.status === 'Active').length}
              </p>
              <p className="text-[11px] mt-0.5 flex items-center gap-1">
                <span className="text-[#10B981] font-semibold">
                  {summary?.activeEmployeesTrend ? summary.activeEmployeesTrend.split(' ')[0] + ' ' + summary.activeEmployeesTrend.split(' ')[1] : '↑ 8%'}
                </span>
                <span className="text-[#94A3B8]">vs last month</span>
              </p>
            </div>
          </div>

          {/* Card 3: On Notice */}
          <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-4 flex items-center gap-3.5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
            <div className="w-11 h-11 rounded-[8px] bg-[#FFF7ED] flex items-center justify-center text-[#EA580C] flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748B]">On Notice</p>
              <p className="text-[22px] font-bold text-[#0F172A] leading-tight mt-0.5">
                {summary?.onNoticeEmployees ?? employees.filter((e) => e.status === 'On Notice').length}
              </p>
              <p className="text-[11px] mt-0.5 flex items-center gap-1">
                <span className="text-[#EF4444] font-semibold">
                  {summary?.onNoticeEmployeesTrend ? summary.onNoticeEmployeesTrend.split(' ')[0] + ' ' + summary.onNoticeEmployeesTrend.split(' ')[1] : '↓ 25%'}
                </span>
                <span className="text-[#94A3B8]">vs last month</span>
              </p>
            </div>
          </div>

          {/* Card 4: Total Monthly CTC */}
          <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-4 flex items-center gap-3.5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
            <div className="w-11 h-11 rounded-[8px] bg-[#FAF5FF] flex items-center justify-center text-[#9333EA] flex-shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748B]">Total Monthly CTC</p>
              <p className="text-[22px] font-bold text-[#0F172A] leading-tight mt-0.5">
                {summary?.totalMonthlyCtcFormatted ?? formatCurrency(summary?.totalMonthlyCtc || employees.reduce((acc, e) => acc + (Number(e.monthlyCtc) || 0), 0))}
              </p>
              <p className="text-[11px] mt-0.5 flex items-center gap-1">
                <span className="text-[#10B981] font-semibold">
                  {summary?.totalMonthlyCtcTrend ? summary.totalMonthlyCtcTrend.split(' ')[0] + ' ' + summary.totalMonthlyCtcTrend.split(' ')[1] : '↑ 8%'}
                </span>
                <span className="text-[#94A3B8]">vs last month</span>
              </p>
            </div>
          </div>
        </div>

        {/* Section - FilterContainer */}
        <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] space-y-4">
          {/* Top Row: Search Input + Filter Toggle + Clear */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#3B82F6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by Employee ID, name, employee code, email or phone..."
                className="w-full h-[34px] pl-9 pr-3 text-[12px] border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[#334155] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="h-[34px] px-3.5 rounded-[8px] border border-[#BFDBFE] bg-[#EFF6FF] text-[#4F46E5] text-[12px] font-medium flex items-center gap-1.5 hover:bg-blue-50 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters ({activeFiltersCount})</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={handleClearFilters}
                className="h-[34px] px-2.5 text-[#4F46E5] text-[12px] font-medium flex items-center gap-1 hover:underline transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          {isFiltersOpen && (
            <div className="pt-2 border-t border-[#F1F5F9] space-y-3">
              {/* Filter Row 1 (6 columns) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">Designation</label>
                  <select
                    value={selectedDesignation}
                    onChange={(e) => {
                      setSelectedDesignation(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    {designations.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">Employment Type</label>
                  <select
                    value={selectedEmploymentType}
                    onChange={(e) => {
                      setSelectedEmploymentType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="On Notice">On Notice</option>
                    <option value="Probation">Probation</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">Reporting Manager</label>
                  <select
                    value={selectedReportingManager}
                    onChange={(e) => {
                      setSelectedReportingManager(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    {reportingManagers.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Row 2 (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">Joining Date</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={joiningDateRange}
                      onChange={(e) => {
                        setJoiningDateRange(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Select date range"
                      className="w-full h-8 pl-8 pr-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">Current Tenure Status</label>
                  <select
                    value={selectedTenureStatus}
                    onChange={(e) => {
                      setSelectedTenureStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-8 px-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All</option>
                    <option value="< 1 Year">&lt; 1 Year</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3+ Years">3+ Years</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section - TableContainer */}
        <div className="bg-white rounded-[10px] border border-[#E2E8F0] shadow-[0px_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Table Control Header */}
          <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between flex-wrap gap-3 bg-white">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-[#0F172A]">
                Employees ({filteredEmployees.length})
              </span>
              <Info className="w-3.5 h-3.5 text-[#4F46E5] cursor-pointer" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#64748B]">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 px-2.5 text-[12px] border border-[#E2E8F0] rounded-[6px] bg-white text-[#334155] focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Joining Date (Newest)">Joining Date (Newest)</option>
                <option value="Joining Date (Oldest)">Joining Date (Oldest)</option>
                <option value="Employee ID (Asc)">Employee ID (Asc)</option>
                <option value="Employee ID (Desc)">Employee ID (Desc)</option>
                <option value="Name (A-Z)">Name (A-Z)</option>
                <option value="CTC (High to Low)">CTC (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Horizontal Scrollable Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: '100%' }}>
              <thead>
                <tr className="bg-[#F8FAFC]/80 border-b border-[#E2E8F0] text-[11px] font-bold text-[#475569] uppercase tracking-[0.55px]">
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '120px' }}>
                    <div className="flex items-center gap-1">
                      <span>EMPLOYEE ID</span>
                      <span className="text-[#94A3B8] font-sans">⇅</span>
                    </div>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '140px' }}>
                    <div className="flex items-center gap-1">
                      <span>EMPLOYEE CODE</span>
                      <span className="text-[#94A3B8] font-sans">⇅</span>
                    </div>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '180px' }}>
                    <span>FULL NAME</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '200px' }}>
                    <div className="flex items-center gap-1">
                      <span>WORK EMAIL</span>
                      <span className="text-[#94A3B8] font-sans">⇅</span>
                    </div>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '140px' }}>
                    <div className="flex items-center gap-1">
                      <span>PHONE</span>
                      <span className="text-[#94A3B8] font-sans">⇅</span>
                    </div>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '120px' }}>
                    <span>DEPARTMENT</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '160px' }}>
                    <div className="flex items-center gap-1">
                      <span>DESIGNATION</span>
                      <span className="text-[#94A3B8] font-sans">⇅</span>
                    </div>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '130px' }}>
                    <span>EMPLOYMENT TYPE</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '110px' }}>
                    <span>STATUS</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '120px' }}>
                    <span>LOCATION</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '150px' }}>
                    <span>REPORTING MANAGER</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '120px' }}>
                    <span>JOINING DATE</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '120px' }}>
                    <span>TENURE</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap" style={{ width: '130px' }}>
                    <span>MONTHLY CTC</span>
                  </th>
                  <th className="py-3 px-3.5 whitespace-nowrap text-center" style={{ width: '80px' }}>
                    <span>ACTIONS</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {isLoading ? (
                  <tr>
                    <td colSpan={15} className="py-12 text-center text-[13px] text-[#64748B]">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                        Loading employees from database...
                      </div>
                    </td>
                  </tr>
                ) : paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="py-12 text-center text-[13px] text-[#64748B]">
                      No employees match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-[#F8FAFC] transition-colors text-[12px] group"
                    >
                      {/* Employee ID */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsDetailModalOpen(true);
                          }}
                          className="text-[#2563EB] font-medium hover:underline text-left"
                        >
                          {emp.employeeId}
                        </button>
                      </td>

                      {/* Employee Code */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#64748B]">
                        {emp.employeeCode}
                      </td>

                      {/* Full Name */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{
                              backgroundColor: emp.avatarBg || '#DBEAFE',
                              color: emp.avatarColor || '#1D4ED8',
                            }}
                          >
                            {emp.avatarInitials}
                          </div>
                          <span className="font-medium text-[#0F172A]">{emp.fullName}</span>
                        </div>
                      </td>

                      {/* Work Email */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <a
                          href={`mailto:${emp.workEmail}`}
                          className="text-[#2563EB] hover:underline"
                        >
                          {emp.workEmail}
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#475569]">
                        {emp.phone}
                      </td>

                      {/* Department */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#334155]">
                        {emp.department}
                      </td>

                      {/* Designation */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#475569]">
                        {emp.designation}
                      </td>

                      {/* Employment Type */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#475569]">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {emp.employmentType}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {getStatusBadge(emp.status)}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#475569]">
                        {emp.location}
                      </td>

                      {/* Reporting Manager */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#475569]">
                        {emp.reportingManager}
                      </td>

                      {/* Joining Date */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#475569]">
                        {emp.joiningDate}
                      </td>

                      {/* Tenure */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-[#475569]">
                        {emp.tenureStatus}
                      </td>

                      {/* Monthly CTC */}
                      <td className="py-3 px-3.5 whitespace-nowrap font-medium text-[#0F172A]">
                        {emp.monthlyCtcFormatted || formatCurrency(emp.monthlyCtc)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-center">
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsDetailModalOpen(true);
                          }}
                          className="w-7 h-7 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 inline-flex items-center justify-center transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white text-[12px] text-[#64748B]">
            <div>
              Showing <span className="font-semibold text-slate-800">{filteredEmployees.length === 0 ? 0 : (currentPage - 1) * limit + 1}</span> –{' '}
              <span className="font-semibold text-slate-800">{Math.min(currentPage * limit, filteredEmployees.length)}</span> of{' '}
              <span className="font-semibold text-slate-800">{filteredEmployees.length}</span> employees
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Page number buttons */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded text-[12px] font-medium transition-colors ${
                      currentPage === pg
                        ? 'bg-[#4F46E5] text-white'
                        : 'border border-[#E2E8F0] text-[#334155] hover:bg-slate-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                {totalPages > 5 && (
                  <>
                    <span className="px-1 text-slate-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-7 h-7 rounded text-[12px] font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'bg-[#4F46E5] text-white'
                          : 'border border-[#E2E8F0] text-[#334155] hover:bg-slate-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-7 px-2 border border-[#E2E8F0] rounded text-[12px] text-[#334155] bg-white focus:outline-none"
              >
                <option value="8 per page">8 per page</option>
                <option value="10 per page">10 per page</option>
                <option value="25 per page">25 per page</option>
                <option value="50 per page">50 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEmployee}
      />

      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdate={handleUpdateEmployee}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
};

