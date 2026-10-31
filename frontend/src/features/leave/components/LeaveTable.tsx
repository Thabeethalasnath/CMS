import React, { useState } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Eye, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { LeaveRecord } from '../types/leave';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';

interface LeaveTableProps {
  records: LeaveRecord[];
  totalRecords: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (sortBy: string) => void;
  onViewDetails: (record: LeaveRecord) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LeaveTable: React.FC<LeaveTableProps> = ({
  records,
  totalRecords,
  loading,
  currentPage,
  pageSize,
  sortBy,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onViewDetails,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIdx = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalRecords);

  const renderBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200">
            Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
    }
  };

  // Generate pagination buttons
  const renderPageButtons = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages.map((page, idx) => {
      if (page === '...') {
        return (
          <span key={`dots-${idx}`} className="px-2 text-xs text-slate-400 select-none">
            ...
          </span>
        );
      }
      const pageNum = Number(page);
      const isActive = pageNum === currentPage;
      return (
        <button
          key={pageNum}
          type="button"
          onClick={() => onPageChange(pageNum)}
          className={`min-w-[28px] h-7 px-2 text-xs font-medium rounded-md transition-colors ${
            isActive
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
      {/* Top Header of the table card */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Leave Requests ({loading ? '...' : totalRecords})
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort Leave Requests"
            className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium cursor-pointer"
          >
            <option value="From Date (Newest)">From Date (Newest)</option>
            <option value="From Date (Oldest)">From Date (Oldest)</option>
            <option value="Days (High-Low)">Days (High-Low)</option>
            <option value="Days (Low-High)">Days (Low-High)</option>
          </select>
        </div>
      </div>

      {/* Horizontal Scroll Table Container */}
      <div className="overflow-x-auto min-h-[300px]" onClick={() => setActiveMenuId(null)}>
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">LEAVE ID</th>
              <th className="py-3 px-4 font-semibold">EMPLOYEE ID</th>
              <th className="py-3 px-4 font-semibold">EMPLOYEE NAME</th>
              <th className="py-3 px-4 font-semibold">LEAVE TYPE</th>
              <th className="py-3 px-4 font-semibold">FROM DATE</th>
              <th className="py-3 px-4 font-semibold">TO DATE</th>
              <th className="py-3 px-4 font-semibold">DAYS</th>
              <th className="py-3 px-4 font-semibold">REASON</th>
              <th className="py-3 px-4 font-semibold">APPROVAL STATUS</th>
              <th className="py-3 px-4 font-semibold">APPROVED BY</th>
              <th className="py-3 px-4 font-semibold">CALCULATED DAYS</th>
              <th className="py-3 px-4 font-semibold">LEAVE STATUS</th>
              <th className="py-3 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: pageSize }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3.5 px-4"><Skeleton width={70} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={65} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={100} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={80} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={75} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={75} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={30} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={110} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={70} height={20} className="rounded-full" /></td>
                  <td className="py-3.5 px-4"><Skeleton width={80} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={30} height={14} /></td>
                  <td className="py-3.5 px-4"><Skeleton width={70} height={20} className="rounded-full" /></td>
                  <td className="py-3.5 px-4 text-center"><Skeleton width={20} height={14} className="mx-auto" /></td>
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12">
                  <EmptyState
                    title="No leave requests found"
                    description="No leave requests match your search and filter criteria."
                  />
                </td>
              </tr>
            ) : (
              records.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* LEAVE ID */}
                  <td className="py-3.5 px-4 font-medium text-blue-600 hover:underline cursor-pointer">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(row);
                      }}
                      className="text-left font-medium text-blue-600 hover:text-blue-700"
                    >
                      {row.id}
                    </button>
                  </td>

                  {/* EMPLOYEE ID */}
                  <td className="py-3.5 px-4 font-medium text-blue-600">
                    {row.employeeId}
                  </td>

                  {/* EMPLOYEE NAME */}
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(row);
                      }}
                      className="text-left font-medium text-slate-800 hover:text-indigo-600 transition-colors"
                    >
                      {row.employeeName}
                    </button>
                  </td>

                  {/* LEAVE TYPE */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.leaveType}
                  </td>

                  {/* FROM DATE */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.fromDate}
                  </td>

                  {/* TO DATE */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.toDate}
                  </td>

                  {/* DAYS */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.days}
                  </td>

                  {/* REASON */}
                  <td className="py-3.5 px-4 text-slate-600 max-w-[160px] truncate" title={row.reason}>
                    {row.reason || '—'}
                  </td>

                  {/* APPROVAL STATUS */}
                  <td className="py-3.5 px-4">
                    {renderBadge(row.approvalStatus)}
                  </td>

                  {/* APPROVED BY */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.approvedBy || '-'}
                  </td>

                  {/* CALCULATED DAYS */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.calculatedDays}
                  </td>

                  {/* LEAVE STATUS */}
                  <td className="py-3.5 px-4">
                    {renderBadge(row.leaveStatus)}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3.5 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === row.id && (
                      <div className="absolute right-4 top-10 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 text-left">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onViewDetails(row);
                          }}
                          className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Details</span>
                        </button>

                        {row.approvalStatus === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onApprove(row.id);
                              }}
                              className="w-full px-3 py-2 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onReject(row.id);
                              }}
                              className="w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onDelete(row.id);
                          }}
                          className="w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing {startIdx}–{endIdx} of {totalRecords} records
        </div>

        {/* Page Nav */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous Page"
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {renderPageButtons()}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next Page"
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page Size Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Records per page"
            className="border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

