import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export interface BarSeriesConfig {
  key: string;
  name: string;
  color: string;
}

export interface BarDataPoint {
  label: string;
  color?: string;
  subLabel?: string;
  secondaryInfo?: string;
  [key: string]: any;
}

interface UniversalBarChartProps {
  data: BarDataPoint[];
  series: BarSeriesConfig[];
  height?: number;
  valueFormatter?: (val: number) => string;
  showLegend?: boolean;
  barWidth?: number;
  barRadius?: [number, number, number, number];
  yAxisWidth?: number;
  ticks?: number[];
  domain?: [number | string, number | string];
  useEntryColors?: boolean;
}

// Custom Light Theme Tooltip matching CEO Dashboard & Collections standard
const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0]?.payload;
    return (
      <div className="bg-white/95 backdrop-blur-xs text-slate-900 px-3.5 py-2.5 rounded-xl text-xs shadow-md border border-slate-200 pointer-events-none z-50 min-w-[130px]">
        <p className="font-bold text-slate-800 pb-1.5 border-b border-slate-100 mb-1.5 text-xs">
          {dataItem?.subLabel ? `${label} ${dataItem.subLabel}` : label}
        </p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex flex-col gap-1 my-0.5">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0 inline-block"
                style={{ backgroundColor: dataItem?.color || item.color || item.fill }}
              />
              <span className="text-slate-600 text-[11px] font-medium">{item.name}:</span>
              <span className="font-extrabold text-slate-900 text-xs ml-auto">
                {valueFormatter ? valueFormatter(item.value) : item.value}
              </span>
            </div>
            {dataItem?.secondaryInfo && (
              <span className="text-[10px] text-slate-400 font-medium pl-4.5">
                {dataItem.secondaryInfo}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const UniversalBarChart: React.FC<UniversalBarChartProps> = ({
  data,
  series,
  height = 145,
  valueFormatter = (v) => `${v}`,
  showLegend = false,
  barWidth = 8,
  barRadius = [4, 4, 0, 0],
  yAxisWidth = 0,
  ticks,
  domain,
  useEntryColors = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col select-none">
      {showLegend && (
        <div className="flex items-center gap-4 mb-2 text-[11px] text-slate-500 font-medium">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-xs inline-block"
                style={{ backgroundColor: s.color }}
              />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 8, left: yAxisWidth > 0 ? 0 : -25, bottom: 8 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.7} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={(props: any) => {
                const { x, y, payload, index } = props;
                const isHovered = hoveredIndex === index;
                const item = data[index];
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={4}
                      dy={10}
                      textAnchor="middle"
                      fill={isHovered ? '#0F172A' : '#94A3B8'}
                      fontSize={isHovered ? 11 : 10}
                      fontWeight={isHovered ? 700 : 500}
                    >
                      {payload.value}
                    </text>
                    {item?.subLabel && (
                      <text
                        x={0}
                        y={16}
                        dy={10}
                        textAnchor="middle"
                        fill={isHovered ? '#2563EB' : '#94A3B8'}
                        fontSize={9}
                        fontWeight={isHovered ? 700 : 500}
                      >
                        {item.subLabel}
                      </text>
                    )}
                  </g>
                );
              }}
              height={36}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 9 }}
              width={yAxisWidth}
              ticks={ticks}
              domain={domain}
              tickFormatter={(v) => (v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${v}`)}
            />
            <Tooltip
              content={<CustomTooltip valueFormatter={valueFormatter} />}
              cursor={{ fill: '#F1F5F9', opacity: 0.65, rx: 6 }}
              offset={12}
              wrapperStyle={{ outline: 'none', zIndex: 50 }}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                radius={barRadius}
                barSize={barWidth}
                animationDuration={600}
                animationEasing="ease-out"
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {data.map((entry, idx) => {
                  const isHovered = hoveredIndex === idx;
                  const isAnyHovered = hoveredIndex !== null;
                  const barColor = (useEntryColors && entry.color) ? entry.color : s.color;

                  return (
                    <Cell
                      key={`cell-${idx}`}
                      fill={barColor}
                      style={{
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease, filter 0.2s ease',
                        opacity: isAnyHovered && !isHovered ? 0.38 : 1,
                        filter: isHovered
                          ? 'brightness(1.12) drop-shadow(0 6px 12px rgba(0,0,0,0.22))'
                          : 'none',
                      }}
                    />
                  );
                })}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
