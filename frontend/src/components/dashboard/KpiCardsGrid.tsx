import React from 'react';
import { KpiCard } from '../../types/dashboard';
import {
  Receipt,
  FileText,
  DollarSign,
  TrendingUp,
  BarChart3,
  Briefcase,
  Users,
  CreditCard,
  Shield,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface KpiCardsGridProps {
  cards: KpiCard[];
  onCardClick?: (card: KpiCard) => void;
}

export const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({
  cards,
  onCardClick = () => {}
}) => {
  // Pastel icon tiles styling
  const getThemeStyles = (theme: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      emerald: { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600' },
      sky: { bg: 'bg-sky-50 border-sky-100', text: 'text-sky-600' },
      purple: { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-600' },
      rose: { bg: 'bg-rose-50 border-rose-100', text: 'text-rose-600' },
      amber: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600' },
      indigo: { bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-600' },
      violet: { bg: 'bg-violet-50 border-violet-100', text: 'text-violet-600' },
      teal: { bg: 'bg-teal-50 border-teal-100', text: 'text-teal-600' },
      pink: { bg: 'bg-pink-50 border-pink-100', text: 'text-pink-600' },
      blue: { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600' }
    };
    return styles[theme] || { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-600' };
  };

  const renderIcon = (type: string, theme: string) => {
    const iconSize = 17;
    const { bg, text } = getThemeStyles(theme);

    let iconComp = <Receipt size={iconSize} />;
    switch (type) {
      case 'receipt': iconComp = <Receipt size={iconSize} />; break;
      case 'document': iconComp = <FileText size={iconSize} />; break;
      case 'dollar': iconComp = <DollarSign size={iconSize} />; break;
      case 'invoice': iconComp = <FileText size={iconSize} />; break;
      case 'profit': iconComp = <TrendingUp size={iconSize} />; break;
      case 'pipeline': iconComp = <BarChart3 size={iconSize} />; break;
      case 'briefcase': iconComp = <Briefcase size={iconSize} />; break;
      case 'users': iconComp = <Users size={iconSize} />; break;
      case 'cash': iconComp = <CreditCard size={iconSize} />; break;
      case 'shield': iconComp = <Shield size={iconSize} />; break;
    }

    return (
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mb-3 ${bg} ${text}`}>
        {iconComp}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 w-full">
      {(cards || []).map((card: any) => {
        const changePercent = card.change_percentage ?? card.changePercentage ?? 0;
        const isPositive = changePercent >= 0;
        const isDanger = (card.change_type ?? card.changeType) === 'negative';

        // Pills: green for positive business metric, red for negative
        const pillBg = isDanger ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600';
        const cardKey = card.card_key ?? card.cardKey ?? `kpi_${card.id}`;
        const formattedVal = card.formatted_value ?? card.formattedValue ?? '0';
        const compText = card.comparison_text ?? card.comparisonText ?? 'vs last month';

        return (
          <div
            key={cardKey}
            onClick={() => onCardClick(card)}
            className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 cursor-pointer group"
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
                {isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {compText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
