import React, { useState, useRef } from 'react';
import { DonutChartProps, DonutChartSegment } from './types';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip } from './ChartTooltip';

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 170,
  strokeWidth = 26,
  centerPrimaryText,
  centerSecondaryText,
  showLegend = true,
  activeSegmentId,
  onSegmentHover,
  className,
  style,
  onSegmentClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalHoveredItem, setInternalHoveredItem] = useState<{
    segment: DonutChartSegment;
    x: number;
    y: number;
  } | null>(null);

  // Determine active item (controlled or internal)
  const activeItem = activeSegmentId !== undefined
    ? data.find((d) => d.id === activeSegmentId || d.label === activeSegmentId) ?? null
    : internalHoveredItem?.segment ?? null;

  const activeId = activeItem?.id ?? activeItem?.label ?? null;
  const hasActive = activeId !== null;

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Track cumulative percentage for offset and slice midpoints
  let cumulativePercent = 0;

  const handleSliceMouseEnter = (
    item: DonutChartSegment,
    sliceCenterAngle: number,
    e: React.MouseEvent<SVGCircleElement>
  ) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const circleRect = e.currentTarget.getBoundingClientRect();

    // Position tooltip near slice center
    const relX = circleRect.left + circleRect.width / 2 - containerRect.left;
    const relY = Math.max(10, circleRect.top - containerRect.top);

    setInternalHoveredItem({
      segment: item,
      x: relX,
      y: relY,
    });
    if (onSegmentHover) onSegmentHover(item);
  };

  const handleSliceMouseLeave = () => {
    setInternalHoveredItem(null);
    if (onSegmentHover) onSegmentHover(null);
  };

  const handleLegendItemHover = (legendItem: { id?: string; label: string } | null) => {
    if (!legendItem) {
      setInternalHoveredItem(null);
      if (onSegmentHover) onSegmentHover(null);
      return;
    }
    const match = data.find((d) => (d.id ?? d.label) === (legendItem.id ?? legendItem.label));
    if (match) {
      // Place tooltip at donut center
      setInternalHoveredItem({
        segment: match,
        x: center,
        y: center - 20,
      });
      if (onSegmentHover) onSegmentHover(match);
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        width: '100%',
        position: 'relative',
        ...style,
      }}
    >
      {/* Donut SVG Ring */}
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          margin: '0 auto',
          flexShrink: 0,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
        >
          {/* Base Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {data.map((item) => {
            const isHovered = activeId === (item.id ?? item.label);
            const currentStrokeWidth = isHovered ? strokeWidth + 4 : strokeWidth;

            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);

            const sliceMidPercent = cumulativePercent + item.percentage / 2;
            const sliceCenterAngle = (sliceMidPercent / 100) * 360 - 90;

            cumulativePercent += item.percentage;

            return (
              <circle
                key={item.id ?? item.label}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={currentStrokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${center} ${center})`}
                opacity={isHovered ? 1 : hasActive ? 0.35 : 1}
                onClick={() => onSegmentClick && onSegmentClick(item)}
                onMouseEnter={(e) => handleSliceMouseEnter(item, sliceCenterAngle, e)}
                onMouseLeave={handleSliceMouseLeave}
                tabIndex={0}
                role="button"
                aria-label={`${item.label}: ${item.value} (${item.percentage}%)`}
                onFocus={(e) => handleSliceMouseEnter(item, sliceCenterAngle, e as unknown as React.MouseEvent<SVGCircleElement>)}
                onBlur={handleSliceMouseLeave}
                style={{
                  transition: 'stroke-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, filter 0.25s ease',
                  cursor: 'pointer',
                  filter: isHovered ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.22)) brightness(1.08)' : 'none',
                  outline: 'none',
                }}
              />
            );
          })}
        </svg>

        {/* Center Labels */}
        {(centerPrimaryText !== undefined || centerSecondaryText !== undefined) && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {centerPrimaryText !== undefined && (
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: '28px',
                  transition: 'transform 0.2s ease',
                  transform: hasActive ? 'scale(1.05)' : 'none',
                }}
              >
                {centerPrimaryText}
              </span>
            )}
            {centerSecondaryText !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#64748B',
                  lineHeight: '14px',
                }}
              >
                {centerSecondaryText}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Accompanying Interactive Legend */}
      {showLegend && (
        <div style={{ flex: 1, minWidth: '170px' }}>
          <ChartLegend
            items={data.map((item) => ({
              id: item.id,
              label: item.label,
              value: item.value,
              percentage: item.percentage,
              color: item.color,
            }))}
            layout="vertical"
            showValues={true}
            showPercentages={true}
            activeId={activeId}
            onItemHover={handleLegendItemHover}
            onItemClick={(item) => {
              const match = data.find((d) => (d.id ?? d.label) === (item.id ?? item.label));
              if (match && onSegmentClick) onSegmentClick(match);
            }}
          />
        </div>
      )}

      {/* Floating Tooltip */}
      {internalHoveredItem && (
        <ChartTooltip
          visible={true}
          x={internalHoveredItem.x}
          y={internalHoveredItem.y}
          title={internalHoveredItem.segment.label}
          label="Invoices"
          value={`${internalHoveredItem.segment.value} (${internalHoveredItem.segment.percentage}%)`}
          color={internalHoveredItem.segment.color}
          secondaryInfo={internalHoveredItem.segment.secondaryInfo}
        />
      )}
    </div>
  );
};
