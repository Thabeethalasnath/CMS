import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { AttendanceRecord, AttendanceSortOption } from '../types/attendance';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  sortBy: AttendanceSortOption;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (sort: AttendanceSortOption) => void;
  onViewRecord: (record: AttendanceRecord) => void;
  onEditRecord: (record: AttendanceRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  totalCount,
  currentPage,
  pageSize,
  sortBy,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Present':
        return {
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#059669',
        };
      case 'Leave':
        return {
          backgroundColor: '#FAF5FF',
          border: '1px solid #E9D5FF',
          color: '#9333EA',
        };
      case 'Half Day':
        return {
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          color: '#D97706',
        };
      case 'Absent':
        return {
          backgroundColor: '#FEF2F2',
          border: '1px solid #FECDD3',
          color: '#DC2626',
        };
      case 'Holiday':
        return {
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          color: '#0284C7',
        };
      default:
        return {
          backgroundColor: '#F1F5F9',
          border: '1px solid #E2E8F0',
          color: '#64748B',
        };
    }
  };

  const getAvatarStyle = (color?: string, initials?: string) => {
    switch (color) {
      case 'purple':
        return { backgroundColor: '#F3E8FF', color: '#9333EA' };
      case 'amber':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'pink':
        return { backgroundColor: '#FCE7F3', color: '#DB2777' };
      case 'rose':
        return { backgroundColor: '#FFE4E6', color: '#E11D48' };
      case 'orange':
        return { backgroundColor: '#FFEDD5', color: '#EA580C' };
      case 'teal':
        return { backgroundColor: '#CCFBF1', color: '#0D9488' };
      case 'emerald':
        return { backgroundColor: '#D1FAE5', color: '#059669' };
      case 'blue':
      default:
        return { backgroundColor: '#E0F2FE', color: '#0284C7' };
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startRange = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalCount);

  // Pagination page numbers generator: 1, 2, 3, 4, 5, ..., 125
  const renderPaginationButtons = () => {
    const buttons: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 4) {
        buttons.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        buttons.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        buttons.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return buttons;
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Table Header: Title and Sort By */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 20px 16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '24px',
            letterSpacing: '-0.4px',
            color: '#0F172A',
            margin: 0,
          }}
        >
          Attendance Records ({totalCount.toLocaleString()})
        </h2>

        {/* Sort By Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              color: '#64748B',
              whiteSpace: 'nowrap',
            }}
          >
            Sort by
          </span>
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as AttendanceSortOption)}
              style={{
                height: '32px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '4px 28px 4px 12px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: '#1E293B',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="employee-asc">Employee Name (A - Z)</option>
              <option value="employee-desc">Employee Name (Z - A)</option>
              <option value="id-desc">Attendance ID (Newest)</option>
              <option value="id-asc">Attendance ID (Oldest)</option>
              <option value="overtime-desc">Highest Overtime</option>
              <option value="workhours-desc">Highest Work Hours</option>
            </select>
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <ChevronDown size={14} color="#94A3B8" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container with Overflow Horizontal */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          position: 'relative',
        }}
      >
        <table
          style={{
            width: '100%',
            minWidth: '940px',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Header Row */}
          <thead>
            <tr
              style={{
                height: '42px',
                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                borderBottom: '1px solid #E2E8F0',
              }}
            >
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                ATTENDANCE ID
              </th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                DATE
              </th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                EMPLOYEE ID
              </th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                EMPLOYEE NAME
              </th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                STATUS
              </th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                CHECK IN
              </th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                CHECK OUT
              </th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                WORK HOURS
              </th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.55px' }}>
                OVERTIME HOURS
              </th>
              <th style={{ width: '48px', padding: '12px 16px', textAlign: 'center' }}></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                  No attendance records found matching current criteria.
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const badgeStyle = getStatusBadgeStyle(rec.status);
                const avatarStyle = getAvatarStyle(rec.avatarColor, rec.avatarInitials);
                const isMenuOpen = activeMenuId === rec.id;

                return (
                  <tr
                    key={rec.id}
                    style={{
                      height: '52px',
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background-color 0.15s ease',
                    }}
                    className="hover:bg-slate-50/70"
                  >
                    {/* ATTENDANCE ID */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span
                        onClick={() => onViewRecord(rec)}
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 500,
                          lineHeight: '19px',
                          color: '#2563EB',
                          cursor: 'pointer',
                        }}
                        className="hover:underline"
                      >
                        {rec.id}
                      </span>
                    </td>

                    {/* DATE */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '12.5px', color: '#475569' }}>
                      {rec.attendanceDate}
                    </td>

                    {/* EMPLOYEE ID */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 500, color: '#2563EB' }}>
                        {rec.employeeId}
                      </span>
                    </td>

                    {/* EMPLOYEE NAME with Initial Badge */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 700,
                            ...avatarStyle,
                          }}
                        >
                          {rec.avatarInitials}
                        </div>
                        <span
                          onClick={() => onViewRecord(rec)}
                          style={{
                            fontSize: '12.5px',
                            fontWeight: 500,
                            color: '#0F172A',
                            cursor: 'pointer',
                          }}
                          className="hover:underline"
                        >
                          {rec.employeeName}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          height: '22px',
                          fontSize: '11px',
                          fontWeight: 500,
                          lineHeight: '16px',
                          ...badgeStyle,
                        }}
                      >
                        {rec.status}
                      </div>
                    </td>

                    {/* CHECK IN */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '12.5px', color: '#475569' }}>
                      {rec.checkIn}
                    </td>

                    {/* CHECK OUT */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '12.5px', color: '#475569' }}>
                      {rec.checkOut}
                    </td>

                    {/* WORK HOURS */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '12.5px', color: '#475569' }}>
                      {rec.workHours}
                    </td>

                    {/* OVERTIME HOURS */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontSize: '12.5px', color: '#475569' }}>
                      {rec.overtimeHours}
                    </td>

                    {/* ACTION MENU */}
                    <td style={{ padding: '14px 16px', textAlign: 'center', position: 'relative' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : rec.id);
                        }}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#94A3B8',
                        }}
                        className="hover:bg-slate-100"
                        title="Actions"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {isMenuOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '20px',
                            top: '40px',
                            width: '130px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            zIndex: 50,
                            padding: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewRecord(rec);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              color: '#334155',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '100%',
                              textAlign: 'left',
                            }}
                            className="hover:bg-slate-50"
                          >
                            <Eye size={13} color="#64748B" />
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditRecord(rec);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              color: '#334155',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '100%',
                              textAlign: 'left',
                            }}
                            className="hover:bg-slate-50"
                          >
                            <Edit size={13} color="#2563EB" />
                            <span>Edit Record</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (window.confirm(`Delete attendance record ${rec.id}?`)) {
                                onDeleteRecord(rec.id);
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              color: '#DC2626',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '100%',
                              textAlign: 'left',
                            }}
                            className="hover:bg-red-50"
                          >
                            <Trash2 size={13} color="#DC2626" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif",
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: Showing Range */}
        <div style={{ fontSize: '12px', color: '#64748B' }}>
          Showing <span style={{ fontWeight: 600, color: '#1E293B' }}>{startRange} – {endRange}</span> of{' '}
          <span style={{ fontWeight: 600, color: '#1E293B' }}>{totalCount.toLocaleString()}</span> records
        </div>

        {/* Center / Right: Page Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Page Buttons: < 1 2 3 4 5 ... 125 > */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: currentPage <= 1 ? '#CBD5E1' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={14} />
            </button>

            {renderPaginationButtons().map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    style={{
                      width: '24px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#94A3B8',
                    }}
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: isActive ? 'none' : '1px solid #E2E8F0',
                    backgroundColor: isActive ? '#4F46E5' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: currentPage >= totalPages ? '#CBD5E1' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Page Size Select */}
          <div style={{ position: 'relative' }}>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                height: '30px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '4px 26px 4px 10px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                color: '#475569',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <ChevronDown size={14} color="#94A3B8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
