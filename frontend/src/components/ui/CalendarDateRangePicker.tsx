import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarDateRangePickerProps {
  value: string;
  onChange: (rangeStr: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarDateRangePicker: React.FC<CalendarDateRangePickerProps> = ({
  value,
  onChange,
  isOpen,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial dates from March 2025 by default
  const [startDate, setStartDate] = useState<Date | null>(new Date(2025, 2, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2025, 2, 31));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Month navigation (defaults to March 2025)
  const [viewDate, setViewDate] = useState<Date>(new Date(2025, 2, 1));

  // Close on outside click or scroll anywhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Two-click logic: Click 1 sets "FROM", Click 2 sets "TO"
  const handleDateClick = (day: number) => {
    const clicked = new Date(year, month, day);

    if (!startDate || (startDate && endDate)) {
      // 1st click: set "from" date, clear "to" date
      setStartDate(clicked);
      setEndDate(null);
      setHoverDate(null);
    } else if (startDate && !endDate) {
      // 2nd click: set "to" date and lock in range
      if (clicked < startDate) {
        setEndDate(startDate);
        setStartDate(clicked);
      } else {
        setEndDate(clicked);
      }
      setHoverDate(null);
    }
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.toDateString() === d2.toDateString();
  };

  const isSelectedStart = (day: number) => {
    const current = new Date(year, month, day);
    return isSameDay(current, startDate);
  };

  const isSelectedEnd = (day: number) => {
    const current = new Date(year, month, day);
    if (endDate) {
      return isSameDay(current, endDate);
    }
    if (startDate && !endDate && hoverDate) {
      return isSameDay(current, hoverDate);
    }
    return false;
  };

  const isInBetween = (day: number) => {
    const current = new Date(year, month, day);

    // If both start and end dates are picked
    if (startDate && endDate) {
      return current > startDate && current < endDate;
    }

    // If start is picked and user is hovering over a target end date
    if (startDate && !endDate && hoverDate) {
      const min = startDate < hoverDate ? startDate : hoverDate;
      const max = startDate < hoverDate ? hoverDate : startDate;
      return current > min && current < max;
    }

    return false;
  };

  const formatDateShort = (d: Date) => {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const handleApply = () => {
    if (startDate && endDate) {
      const startStr = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const endStr = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      onChange(`${startStr} - ${endStr}`);
    } else if (startDate && !endDate) {
      const startStr = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      onChange(startStr);
    }
    onClose();
  };

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 w-[310px] animate-fade-in select-none text-slate-800"
    >
      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[13.5px] font-bold text-slate-900 tracking-tight">
          {monthName}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 text-center mb-1 text-[11px] font-semibold text-slate-400">
        {daysOfWeek.map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div
        className="grid grid-cols-7 gap-1 text-center text-xs"
        onMouseLeave={() => setHoverDate(null)}
      >
        {/* Empty cells for month offset */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8" />
        ))}

        {/* Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isStart = isSelectedStart(day);
          const isEnd = isSelectedEnd(day);
          const inBetween = isInBetween(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => {
                if (startDate && !endDate) {
                  setHoverDate(new Date(year, month, day));
                }
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all relative ${
                isStart || isEnd
                  ? 'bg-[#4F46E5] text-white font-bold shadow-xs scale-105 z-10'
                  : inBetween
                  ? 'bg-indigo-50 text-indigo-900 font-semibold rounded-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Footer: Date Range preview & Actions */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-600 font-medium truncate max-w-[170px]">
          {startDate ? formatDateShort(startDate) : 'Select start'}
          {' → '}
          {endDate ? formatDateShort(endDate) : hoverDate ? formatDateShort(hoverDate) : 'Select end'}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-3 py-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg shadow-xs text-xs transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
