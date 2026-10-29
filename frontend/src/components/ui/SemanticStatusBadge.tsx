import React from 'react';
import { ChevronDown } from 'lucide-react';

export type SemanticStatusCategory = 'completed' | 'pending' | 'failed' | 'in-progress';

export interface SemanticStatusBadgeProps {
  status: string;
  label?: string;
  showChevron?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const getSemanticCategory = (status: string): SemanticStatusCategory => {
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'completed':
    case 'paid':
    case 'approved':
      return 'completed';

    case 'pending':
    case 'due soon':
      return 'pending';

    case 'failed':
    case 'overdue':
    case 'rejected':
      return 'failed';

    case 'in progress':
    case 'in-progress':
    case 'sent':
    case 'partially paid':
    case 'in review':
    case 'open':
    default:
      return 'in-progress';
  }
};

const SEMANTIC_STYLES: Record<
  SemanticStatusCategory,
  { bg: string; text: string; border: string; dot: string }
> = {
  completed: {
    bg: '#F0FDF4',
    text: '#166534',
    border: '#BBF7D0',
    dot: '#16A34A',
  },
  pending: {
    bg: '#FFFBEB',
    text: '#92400E',
    border: '#FDE68A',
    dot: '#D97706',
  },
  failed: {
    bg: '#FEF2F2',
    text: '#991B1B',
    border: '#FECACA',
    dot: '#DC2626',
  },
  'in-progress': {
    bg: '#EFF6FF',
    text: '#1E40AF',
    border: '#BFDBFE',
    dot: '#2563EB',
  },
};

export const SemanticStatusBadge: React.FC<SemanticStatusBadgeProps> = ({
  status,
  label,
  showChevron = false,
  className = '',
  style,
}) => {
  const category = getSemanticCategory(status);
  const theme = SEMANTIC_STYLES[category];
  const displayText = label || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '9999px',
        backgroundColor: theme.bg,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '18px',
        fontFamily: "'Inter', sans-serif",
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: theme.dot,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      <span>{displayText}</span>
      {showChevron && (
        <ChevronDown
          size={12}
          color={theme.text}
          style={{ opacity: 0.75, marginLeft: '2px', flexShrink: 0 }}
        />
      )}
    </span>
  );
};
