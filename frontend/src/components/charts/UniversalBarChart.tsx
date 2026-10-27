import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
  [key: string]: any;
}

interface UniversalBarChartProps {
  data: BarDataPoint[];
  series: BarSeriesConfig[];
  height?: number;
  valueFormatter?: (val: number) => string;
  showLegend?: boolean;
  barWidth?: number;
  yAxisWidth?: number;
}

// Custom Light Theme Tooltip
const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xs text-slate-900 px-3 py-2 rounded-lg text-xs shadow-md border border-slate-200 pointer-events-none z-50">
        <p className="font-bold text-slate-800 pb-1 border-b border-slate-100 mb-1 text-[11px]">{label}</p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 my-0.5">
            <span
              className="w-2 h-2 rounded-sm shrink-0 inline-block"
              style={{ backgroundColor: item.color || item.fill }}
            />
            <span className="text-slate-600 text-[11px] font-medium">{item.name}:</span>
            <span className="font-bold text-slate-900 text-[11px] ml-auto">
              {valueFormatter ? valueFormatter(item.value) : item.value}
            </span>
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
  yAxisWidth = 0
}) => {
  return (
    <div className="w-full flex flex-col select-none">
      {showLegend && (
        <div className="flex items-center gap-4 mb-2 text-[11px] text-slate-500 font-medium">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-sm inline-block"
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
            margin={{ top: 10, right: 8, left: yAxisWidth > 0 ? 0 : -25, bottom: 0 }}
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.7} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 500 }}
              dy={4}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 9 }}
              width={yAxisWidth}
              tickFormatter={(v) => (v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${v}`)}
            />
            <Tooltip
              content={<CustomTooltip valueFormatter={valueFormatter} />}
              cursor={{ fill: '#F1F5F9', opacity: 0.6 }}
              offset={12}
              wrapperStyle={{ outline: 'none', zIndex: 50 }}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                radius={[3, 3, 0, 0]}
                barSize={barWidth}
                animationDuration={800}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
