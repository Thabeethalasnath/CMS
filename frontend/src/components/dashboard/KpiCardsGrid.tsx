import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Users,
  Target,
  Clock,
  PieChart,
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { DashboardKpiCard } from '../../types/dashboard';

interface KpiCardsGridProps {
  cards: DashboardKpiCard[];
  onCardClick?: (card: DashboardKpiCard) => void;
}

export const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({ cards, onCardClick }) => {
  if (!cards || cards.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs w-full">
        No active metrics configured
      </div>
    );
  }
  const renderIcon = (type: string, color: string) => {
    const iconProps = { className: 'w-4 h-4' };
    let iconComp = <Activity {...iconProps} />;

    switch (type) {
      case 'DollarSign':
        iconComp = <DollarSign {...iconProps} />;
        break;
      case 'Briefcase':
        iconComp = <Briefcase {...iconProps} />;
        break;
      case 'Users':
        iconComp = <Users {...iconProps} />;
        break;
      case 'Target':
        iconComp = <Target {...iconProps} />;
        break;
      case 'Clock':
        iconComp = <Clock {...iconProps} />;
        break;
      case 'PieChart':
        iconComp = <PieChart {...iconProps} />;
        break;
      case 'Layers':
        iconComp = <Layers {...iconProps} />;
        break;
      case 'TrendingUp':
        iconComp = <TrendingUp {...iconProps} />;
        break;
      default:
        iconComp = <Activity {...iconProps} />;
    }

    const themeMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600' },
      emerald: { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600' },
      violet: { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-600' },
      amber: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600' },
      rose: { bg: 'bg-rose-50 border-rose-100', text: 'text-rose-600' },
      indigo: { bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-600' }
    };

    const { bg, text } = themeMap[color] || { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-600' };

    return (
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mb-3 ${bg} ${text}`}>
        {iconComp}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 w-full">
      {(cards || []).map((card: any, idx: number) => {
        const changePercent = card.change_percentage ?? card.changePercentage ?? 0;
        const isPositive = changePercent >= 0;
        const isDanger = (card.change_type ?? card.changeType) === 'negative';

        // Pills: green for positive business metric, red for negative
        const pillBg = isDanger ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600';
        const cardKey = card.card_key ?? card.cardKey ?? `kpi_${card.id || idx}`;
        const formattedVal = card.formatted_value ?? card.formattedValue ?? '0';
        const compText = card.comparison_text ?? card.comparisonText ?? 'vs last month';

        return (
          <div
            key={cardKey}
            onClick={onCardClick ? () => onCardClick(card) : undefined}
            className={`bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 group ${
              onCardClick ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <div>
              {/* Colored Icon Tile */}
              {renderIcon(card.icon_type ?? card.iconType, card.color_theme ?? card.colorTheme)}

              {/* Metric Label */}
              <h4 className="text-[11.5px] font-medium text-slate-500 leading-tight min-h-[26px] flex items-center">
                {card.title}
              </h4>

              {/* Big Metric Value */}
              <div className="mt-1.5 mb-2.5">
                <span className="text-[19px] font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  {formattedVal}
                </span>
              </div>
            </div>

            {/* Bottom Change Pill */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${pillBg}`}>
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(changePercent)}%
              </span>
              <span className="text-[10px] font-medium text-slate-500 truncate">
                {compText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
