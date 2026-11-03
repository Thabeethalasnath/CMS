import React, { useState, useRef } from 'react';
import { BarChartProps, BarChartItem } from './types';
import { ChartTooltip } from './ChartTooltip';

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  yAxisTicks = [
    { label: '20L', value: 2000000 },
    { label: '15L', value: 1500000 },
    { label: '10L', value: 1000000 },
    { label: '5L', value: 500000 },
    { label: '0', value: 0 },
  ],
  height = 240,
  barWidth = 40,
  showBarLabels = false,
  metricLabel = 'Expenses',
  activeBarId,
  onBarHover,
  className,
  style,
  onBarClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalHoveredItem, setInternalHoveredItem] = useState<{
    item: BarChartItem;
    x: number;
    y: number;
  } | null>(null);

  // SVG Coordinate space
  const svgWidth = 480;
  const svgHeight = height;
  const chartTop = 26;
  const chartBottom = svgHeight - 44; // Room for 2-line category labels
  const chartLeft = 40;
  const chartRight = svgWidth - 10;
  const availableHeight = chartBottom - chartTop;

  // Max value calculation
  const max = maxValue ?? Math.max(...yAxisTicks.map((t) => t.value), 1);

  const totalSlots = data.length;
  const slotWidth = totalSlots > 0 ? (chartRight - chartLeft) / totalSlots : 1;

  // Determine active item (controlled or internal)
  const activeItem = activeBarId !== undefined
    ? data.find((d) => d.id === activeBarId || d.label === activeBarId) ?? null
    : internalHoveredItem?.item ?? null;

  const activeId = activeItem?.id ?? activeItem?.label ?? null;
  const hasActive = activeId !== null;

  const handleBarMouseEnter = (item: BarChartItem, index: number, e: React.MouseEvent<SVGGElement>) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const barRect = e.currentTarget.getBoundingClientRect();

    // Calculate relative center of the bar within the container
    const relX = barRect.left + barRect.width / 2 - containerRect.left;
    const relY = Math.max(10, barRect.top - containerRect.top);

    setInternalHoveredItem({
      item,
      x: relX,
      y: relY,
    });
    if (onBarHover) onBarHover(item, index);
  };

  const handleBarMouseLeave = () => {
    setInternalHoveredItem(null);
    if (onBarHover) onBarHover(null, null);
  };

  return (
    <div
      ref={containerRef}
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
        {/* Horizontal grid lines and Y-axis labels */}
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

        {/* Baseline (0 level) */}
        <line
          x1={chartLeft}
          y1={chartBottom}
          x2={chartRight}
          y2={chartBottom}
          stroke="#E2E8F0"
          strokeWidth="1"
        />

        {/* Vertical Bars and Column Highlights */}
        {data.map((item, index) => {
          const barHeight = Math.max(3, Math.min(availableHeight, (item.value / max) * availableHeight));
          const x = chartLeft + index * slotWidth + (slotWidth - barWidth) / 2;
          const y = chartBottom - barHeight;
          const isCurrentHovered = activeId === (item.id ?? item.label);

          const currentBarWidth = isCurrentHovered ? barWidth + 2 : barWidth;
          const currentX = isCurrentHovered ? x - 1 : x;

          const unitText = item.unit !== undefined ? item.unit : '₹';
          const valText = item.displayValue !== undefined ? item.displayValue : item.value;

          return (
            <g
              key={item.id ?? item.label}
              role="button"
              tabIndex={0}
              aria-label={`${item.label} ${item.subLabel ?? ''}: ${valText}`}
              onClick={() => onBarClick && onBarClick(item, index)}
              onMouseEnter={(e) => handleBarMouseEnter(item, index, e)}
              onMouseLeave={handleBarMouseLeave}
              onFocus={(e) => handleBarMouseEnter(item, index, e as unknown as React.MouseEvent<SVGGElement>)}
              onBlur={handleBarMouseLeave}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              {/* Hover Column Background Highlight */}
              {isCurrentHovered && (
                <rect
                  x={x - 8}
                  y={chartTop}
                  width={barWidth + 16}
                  height={availableHeight}
                  rx="8"
                  ry="8"
                  fill="#F8FAFC"
                  opacity="0.9"
                />
              )}

              {/* Optional Static Number above Bar (when showBarLabels is enabled) */}
              {showBarLabels && !isCurrentHovered && (
                <>
                  {unitText && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 18}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="500"
                      fill="#64748B"
                      fontFamily="inherit"
                    >
                      {unitText}
                    </text>
                  )}
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#0F172A"
                    fontFamily="inherit"
                  >
                    {valText}
                  </text>
                </>
              )}

              {/* Prominent Displayed Amount above Bar on Hover */}
              {isCurrentHovered && (
                <g style={{ transition: 'opacity 0.2s ease' }}>
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(chartTop + 14, y - 8)}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill="#0F172A"
                    fontFamily="inherit"
                    style={{
                      filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.95))',
                    }}
                  >
                    {valText}
                  </text>
                </g>
              )}

              {/* Bar Rectangle with Highlight and Reduced Emphasis on Non-Hovered Bars */}
              <rect
                x={currentX}
                y={y}
                width={currentBarWidth}
                height={barHeight}
                rx="5"
                ry="5"
                fill={item.color}
                opacity={isCurrentHovered ? 1 : hasActive ? 0.38 : 1}
                style={{
                  transition: 'opacity 0.2s ease, filter 0.2s ease, width 0.2s ease, x 0.2s ease',
                  filter: isCurrentHovered
                    ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.22)) brightness(1.12)'
                    : 'none',
                }}
              />

              {/* Prominent Ageing Bucket Label Highlight Pill */}
              {isCurrentHovered && (
                <rect
                  x={x + barWidth / 2 - 28}
                  y={chartBottom + 5}
                  width="56"
                  height="34"
                  rx="6"
                  fill="#EFF6FF"
                  stroke="#BFDBFE"
                  strokeWidth="1"
                />
              )}

              {/* Category Label below Baseline (Line 1) */}
              <text
                x={x + barWidth / 2}
                y={chartBottom + 18}
                textAnchor="middle"
                fontSize={isCurrentHovered ? '12' : '11'}
                fill={isCurrentHovered ? '#0F172A' : hasActive ? '#94A3B8' : '#64748B'}
                fontWeight={isCurrentHovered ? '700' : '500'}
                fontFamily="inherit"
                style={{ transition: 'fill 0.2s ease, font-size 0.2s ease' }}
              >
                {item.label}
              </text>

              {/* Category SubLabel below Baseline (Line 2, e.g. "days") */}
              {item.subLabel && (
                <text
                  x={x + barWidth / 2}
                  y={chartBottom + 31}
                  textAnchor="middle"
                  fontSize={isCurrentHovered ? '11' : '10'}
                  fill={isCurrentHovered ? '#2563EB' : hasActive ? '#94A3B8' : '#64748B'}
                  fontWeight={isCurrentHovered ? '700' : '500'}
                  fontFamily="inherit"
                  style={{ transition: 'fill 0.2s ease, font-size 0.2s ease' }}
                >
                  {item.subLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {internalHoveredItem && (
        <ChartTooltip
          visible={true}
          x={internalHoveredItem.x}
          y={internalHoveredItem.y}
          title={internalHoveredItem.item.subLabel ? `${internalHoveredItem.item.label} ${internalHoveredItem.item.subLabel}` : internalHoveredItem.item.label}
          label={internalHoveredItem.item.metricLabel ?? metricLabel}
          value={
            internalHoveredItem.item.unit
              ? `${internalHoveredItem.item.unit} ${internalHoveredItem.item.displayValue ?? internalHoveredItem.item.value}`
              : String(internalHoveredItem.item.displayValue ?? internalHoveredItem.item.value)
          }
          color={internalHoveredItem.item.color}
          secondaryInfo={internalHoveredItem.item.secondaryValue ? String(internalHoveredItem.item.secondaryValue) : undefined}
        />
      )}
    </div>
  );
};
