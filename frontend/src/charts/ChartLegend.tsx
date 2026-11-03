import React from 'react';
import { ChartLegendProps, ChartLegendItem } from './types';

export const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  layout = 'vertical',
  showValues = true,
  showPercentages = true,
  activeId,
  onItemHover,
  className,
  style,
  onItemClick,
}) => {
  const isHorizontal = layout === 'horizontal';
  const hasActive = activeId !== undefined && activeId !== null && activeId !== '';

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        flexWrap: isHorizontal ? 'wrap' : 'nowrap',
        gap: isHorizontal ? '8px' : '3px',
        width: '100%',
        ...style,
      }}
    >
      {items.map((item: ChartLegendItem) => {
        const itemId = item.id ?? item.label;
        const isActive = hasActive && (activeId === item.id || activeId === item.label);

        return (
          <div
            key={itemId}
            role="button"
            tabIndex={0}
            onClick={() => onItemClick && onItemClick(item)}
            onMouseEnter={() => onItemHover && onItemHover(item)}
            onMouseLeave={() => onItemHover && onItemHover(null)}
            onFocus={() => onItemHover && onItemHover(item)}
            onBlur={() => onItemHover && onItemHover(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isHorizontal ? 'flex-start' : 'space-between',
              fontSize: '12px',
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: isActive ? '#F0F5FF' : 'transparent',
              opacity: hasActive && !isActive ? 0.45 : 1,
              transition: 'background-color 0.2s ease, opacity 0.2s ease, transform 0.15s ease',
              cursor: 'pointer',
              userSelect: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              transform: isActive ? 'translateX(2px)' : 'none',
            }}
          >
            {/* Color Dot + Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span
                style={{
                  width: isActive ? '9px' : '7px',
                  height: isActive ? '9px' : '7px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  flexShrink: 0,
                  display: 'inline-block',
                  transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isActive ? `0 0 0 3px ${item.color}33` : 'none',
                }}
              />
              <span
                style={{
                  color: isActive ? '#0F172A' : '#334155',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'color 0.2s ease, font-weight 0.2s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.label}
              </span>
            </div>

            {/* Value and Percentage columns */}
            {(showValues || showPercentages) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginLeft: isHorizontal ? '6px' : '16px',
                  flexShrink: 0,
                }}
              >
                {showValues && item.value !== undefined && (
                  <span
                    style={{
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? '#0F172A' : '#334155',
                      minWidth: '18px',
                      textAlign: 'right',
                      transition: 'color 0.2s ease, font-weight 0.2s ease',
                    }}
                  >
                    {item.value}
                  </span>
                )}
                {showPercentages && item.percentage !== undefined && (
                  <span
                    style={{
                      color: isActive ? '#0F172A' : '#64748B',
                      fontWeight: isActive ? 700 : 500,
                      minWidth: '28px',
                      textAlign: 'right',
                      transition: 'color 0.2s ease, font-weight 0.2s ease',
                    }}
                  >
                    {item.percentage}%
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
