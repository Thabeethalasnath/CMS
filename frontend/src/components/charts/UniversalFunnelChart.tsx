import React, { useState } from 'react';

export interface FunnelStageItem {
  stage_name: string;
  lead_count: number;
  conversion_rate: number;
  color_hex: string;
}

interface UniversalFunnelChartProps {
  data: FunnelStageItem[];
  height?: number;
}

export const UniversalFunnelChart: React.FC<UniversalFunnelChartProps> = ({
  data,
  height = 145
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Width percentages from top to bottom
  const widthSteps = [
    { top: 100, bottom: 84 },
    { top: 82, bottom: 66 },
    { top: 64, bottom: 48 },
    { top: 46, bottom: 32 }
  ];

  return (
    <div className="flex items-center gap-4 w-full select-none">
      {/* Visual Trapezoid Funnel */}
      <div
        className="flex flex-col items-center justify-center gap-1 shrink-0"
        style={{ width: '130px', height: `${height}px` }}
      >
        {data.map((stage, idx) => {
          const step = widthSteps[idx] || { top: 30 - idx * 5, bottom: 20 - idx * 5 };
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={stage.stage_name}
              className="w-full flex justify-center cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                style={{
                  width: `${step.top}%`,
                  height: '24px',
                  backgroundColor: stage.color_hex,
                  clipPath: `polygon(0 0, 100% 0, ${100 - (step.top - step.bottom) / 2}% 100%, ${(step.top - step.bottom) / 2}% 100%)`,
                }}
                className={`transition-all duration-200 rounded-sm ${
                  isHovered ? 'scale-105 brightness-110 shadow-lg' : 'hover:opacity-90'
                } ${hoveredIdx !== null && !isHovered ? 'opacity-60' : 'opacity-100'}`}
              />
            </div>
          );
        })}
      </div>

      {/* Legend & Stats Column */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.map((stage, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={stage.stage_name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-colors ${
                isHovered ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: stage.color_hex }}
                />
                <span className={`text-xs ${isHovered ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                  {stage.stage_name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-slate-900">{stage.lead_count}</span>
                <span className="text-[11px] text-slate-400 font-medium">({stage.conversion_rate}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
