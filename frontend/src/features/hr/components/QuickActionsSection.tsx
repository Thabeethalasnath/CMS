import React from 'react';
import { ChevronRight } from 'lucide-react';
import { QuickActionItem } from '../types';
import { INITIAL_QUICK_ACTIONS } from '../mockData';

interface QuickActionsSectionProps {
  actions?: QuickActionItem[];
  onActionClick?: (key: 'add-employee' | 'manage-leaves' | 'view-attendance') => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions = INITIAL_QUICK_ACTIONS,
  onActionClick,
}) => {
  return (
    <div className="bg-white rounded-[12px] border border-[#E2E8F0]/90 pt-5 px-5 pb-[78px] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-start h-full min-h-[369px] min-w-0">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h2 className="text-[17px] font-bold text-slate-900 m-0 leading-tight">Quick Actions</h2>
        <p className="text-xs text-slate-500 m-0 mt-0.5">Common HR tasks.</p>
      </div>

      {/* Action Cards List */}
      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const key = action.actionKey || (
            action.id === 'qa-1' ? 'add-employee' : action.id === 'qa-2' ? 'manage-leaves' : 'view-attendance'
          );

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onActionClick && onActionClick(key)}
              className="w-full text-left flex items-center justify-between p-3.5 bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-xs rounded-2xl transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${action.iconBg} ${action.iconBorder} ${action.iconColor}`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {action.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                    {action.description}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
