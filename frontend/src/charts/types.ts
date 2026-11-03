import React from 'react';

/**
 * Universal Chart System Types for KALPANAAA Business OS CMS
 */

export interface YAxisTick {
  label: string;
  value: number;
}

export interface BarChartItem {
  id?: string;
  label: string;
  subLabel?: string; // e.g. "days"
  value: number;
  displayValue?: string | number;
  unit?: string; // e.g. "₹"
  color: string;
  metricLabel?: string;
  secondaryValue?: string | number;
}

export interface BarChartProps {
  data: BarChartItem[];
  maxValue?: number;
  yAxisTicks?: YAxisTick[];
  height?: number;
  barWidth?: number;
  showBarLabels?: boolean;
  metricLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  activeBarId?: string | null;
  onBarHover?: (item: BarChartItem | null, index: number | null) => void;
  onBarClick?: (item: BarChartItem, index: number) => void;
}

export interface DonutChartSegment {
  id?: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  secondaryInfo?: string;
}

export interface DonutChartProps {
  data: DonutChartSegment[];
  size?: number;
  strokeWidth?: number;
  centerPrimaryText?: string | number;
  centerSecondaryText?: string;
  showLegend?: boolean;
  legendPosition?: 'right' | 'bottom';
  className?: string;
  style?: React.CSSProperties;
  activeSegmentId?: string | null;
  onSegmentHover?: (segment: DonutChartSegment | null) => void;
  onSegmentClick?: (segment: DonutChartSegment) => void;
}

export interface LineChartPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface LineChartSeries {
  id: string;
  name: string;
  color: string;
  data: LineChartPoint[];
}

export interface LineChartProps {
  series: LineChartSeries[];
  height?: number;
  yAxisTicks?: YAxisTick[];
  className?: string;
  style?: React.CSSProperties;
}

export interface FunnelChartStep {
  id: string;
  label: string;
  value: number;
  percentage?: number;
  color: string;
  subLabel?: string;
}

export interface FunnelChartProps {
  steps: FunnelChartStep[];
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface ChartLegendItem {
  id?: string;
  label: string;
  value?: string | number;
  percentage?: number;
  color: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  layout?: 'horizontal' | 'vertical';
  showValues?: boolean;
  showPercentages?: boolean;
  activeId?: string | null;
  onItemHover?: (item: ChartLegendItem | null) => void;
  onItemClick?: (item: ChartLegendItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface ChartTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  title?: string;
  label?: string;
  value: string | number;
  color?: string;
  secondaryInfo?: string;
}
