import React, { useState, useEffect, useCallback } from 'react';
import { X, Users, Search, ChevronLeft, ChevronRight, RotateCw, AlertCircle } from 'lucide-react';
import { EmployeeRecord, Department, PageResponse } from '../types';
import { DEPARTMENTS, formatIndianCurrency } from '../mockData';
import { hrApiService } from '../services/hrApiService';

interface ViewEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees?: EmployeeRecord[] | PageResponse<EmployeeRecord> | { content?: EmployeeRecord[]; totalElements?: number };
  onOpenAddModal: () => void;
  isLoading?: boolean;
  initialStatus?: string;
  modalTitle?: string;
}

export const ViewEmployeesModal: React.FC<ViewEmployeesModalProps> = ({
  isOpen,
  onClose,
  onOpenAddModal,
  initialStatus = 'All',
  modalTitle,
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dept, setDept] = useState<Department>('All');
  const [status, setStatus] = useState<string>(initialStatus);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [pageData, setPageData] = useState<PageResponse<EmployeeRecord>>({
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1,
    isFirst: true,
    isLast: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial status and reset filters whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus(initialStatus || 'All');
      setSearch('');
      setDept('All');
      setPage(0);
    }
  }, [isOpen, initialStatus]);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset to page 0 whenever filter criteria change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, dept, status]);

  // Server-side fetch from hrApiService
  const fetchEmployees = useCallback(async (p: number, s: string, d: Department, st: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await hrApiService.getEmployees({
        search: s.trim() ? s.trim() : undefined,
        department: d !== 'All' ? d : undefined,
        status: st !== 'All' ? st : undefined,
        page: p,
        size: pageSize,
      });
      setPageData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load employees from server.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  // Trigger query on modal open or parameter change
  useEffect(() => {
    if (isOpen) {
      fetchEmployees(page, debouncedSearch, dept, status);
    }
  }, [isOpen, page, debouncedSearch, dept, status, fetchEmployees]);

  if (!isOpen) return null;

  const totalElements = pageData.totalElements ?? (pageData.content?.length || 0);
  const totalPages = Math.max(1, pageData.totalPages ?? 1);
  const isFirst = page === 0 || pageData.isFirst === true;
  const isLast = page >= totalPages - 1 || pageData.isLast === true;
  const startRecord = totalElements === 0 ? 0 : page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

  const isNoticeView = status === 'On Notice';
  const displayTitle = modalTitle || (isNoticeView ? 'Employees Exiting (On Notice)' : 'Employee Master Directory');
  const displaySubtitle = isNoticeView
    ? 'List of employees currently serving notice period and exiting.'
    : 'Full roster of workforce members with live server-side search and pagination.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#E2E8F0] z-10 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-base font-bold text-slate-900 leading-tight m-0">{displayTitle}</h3>
              <p className="text-xs text-slate-500 font-normal leading-normal m-0 mt-1">
                {displaySubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-50/60 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, role, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as Department)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 text-slate-700 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Notice">On Notice</option>
              <option value="Exited">Exited</option>
            </select>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAddModal();
            }}
            className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            + Add Employee
          </button>
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {error ? (
            <div className="py-12 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">Failed to load employee directory</p>
              <p className="text-xs text-red-500 mt-1 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => fetchEmployees(page, debouncedSearch, dept, status)}
                className="mt-3 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="pb-2.5">ID & Name</th>
                  <th className="pb-2.5">Role</th>
                  <th className="pb-2.5">Department</th>
                  <th className="pb-2.5">Monthly CTC</th>
                  <th className="pb-2.5">Joined</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <RotateCw size={15} className="animate-spin text-indigo-600" />
                        <span>Loading employee records...</span>
                      </div>
                    </td>
                  </tr>
                ) : pageData.content.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No employees found matching the selected search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  pageData.content.map((emp) => (
                    <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-2.5">
                        <span className="font-semibold text-slate-800 block">{emp.name}</span>
                        <span className="text-[11px] text-slate-400 block">{emp.id} · {emp.email}</span>
                      </td>
                      <td className="py-2.5 text-slate-600 font-medium">{emp.role}</td>
                      <td className="py-2.5 text-slate-500">{emp.department}</td>
                      <td className="py-2.5 font-semibold text-slate-900">{formatIndianCurrency(emp.monthlyCtc)}</td>
                      <td className="py-2.5 text-slate-500">{emp.joiningDate}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            emp.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : emp.status === 'On Notice'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer with Server Pagination Controls */}
        <div className="sticky bottom-0 z-20 px-6 py-4 bg-slate-50/90 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 rounded-b-2xl">
          <span className="text-xs text-slate-500 font-medium">
            Showing {startRecord} to {endRecord} of {totalElements} employees (Page {page + 1} of {totalPages})
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={isFirst || isLoading}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={isLast || isLoading}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
