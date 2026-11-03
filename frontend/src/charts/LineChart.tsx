import React, { useState } from 'react';
import { LineChartProps } from './types';

export const LineChart: React.FC<LineChartProps> = ({
  series,
  height = 240,
  yAxisTicks = [
    { label: '100k', value: 100000 },
    { label: '75k', value: 75000 },
    { label: '50k', value: 50000 },
    { label: '25k', value: 25000 },
    { label: '0', value: 0 },
  ],
  className,
  style,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    seriesName: string;
    xLabel: string;
    value: number;
    cx: number;
    cy: number;
  } | null>(null);

  const svgWidth = 480;
  const svgHeight = height;
  const chartTop = 24;
  const chartBottom = svgHeight - 34;
  const chartLeft = 40;
  const chartRight = svgWidth - 10;
  const availableWidth = chartRight - chartLeft;
  const availableHeight = chartBottom - chartTop;

  const max = Math.max(...yAxisTicks.map((t) => t.value), 1);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {/* Horizontal Gridlines */}
        {yAxisTicks.map((tick) => {
          const y = chartBottom - (tick.value / max) * availableHeight;
          return (
            <g key={tick.label}>
              <line
                x1={chartLeft}
                y1={y}
                x2={chartRight}
                y2={y}
                stroke="#F1F5F9"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={chartLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#94A3B8"
                fontFamily="inherit"
              >
                {tick.label}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={chartLeft}
          y1={chartBottom}
          x2={chartRight}
          y2={chartBottom}
          stroke="#E2E8F0"
          strokeWidth="1"
        />

        {/* Series Lines */}
        {series.map((s) => {
          if (!s.data.length) return null;
          const stepX = availableWidth / Math.max(1, s.data.length - 1);

          const points = s.data.map((pt, i) => {
            const x = chartLeft + i * stepX;
            const y = chartBottom - (pt.y / max) * availableHeight;
            return { x, y, pt };
          });

          const pathD = points.reduce((acc, curr, idx) => {
            return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
          }, '');

          return (
            <g key={s.id}>
              {/* Stroke line */}
              <path
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#FFFFFF"
                  stroke={s.color}
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() =>
                    setHoveredPoint({
                      seriesName: s.name,
                      xLabel: String(p.pt.x),
                      value: p.pt.y,
                      cx: p.x,
                      cy: p.y,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${hoveredPoint.cx}px`,
            top: `${hoveredPoint.cy}px`,
            transform: 'translate(-50%, -100%)',
            marginBottom: '6px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {hoveredPoint.seriesName} ({hoveredPoint.xLabel}): {hoveredPoint.value}
        </div>
      )}
    </div>
  );
};
