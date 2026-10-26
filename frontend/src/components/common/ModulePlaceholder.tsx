import React from 'react';
import { useLocation } from 'react-router-dom';
import { colors, badges, typography } from '../../constants/theme';

interface ModulePlaceholderProps {
  title?: string;
  category?: string;
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ title, category }) => {
  const location = useLocation();

  const displayTitle =
    title ||
    location.pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ||
    'Dashboard';
  const displayCategory =
    category ||
    location.pathname.split('/').filter(Boolean)[0]?.toUpperCase() ||
    'MODULE';

  return (
    <div
      style={{
        padding: '36px 40px',
        color: colors.primaryText,
        fontFamily: typography.fontFamily,
        maxWidth: '1280px',
      }}
    >
      {/* Category / Eyebrow: Field Label hierarchy (13px, Medium 500) */}
      <div
        style={{
          marginBottom: '8px',
          fontSize: typography.fieldLabels.fontSize,
          lineHeight: typography.fieldLabels.lineHeight,
          fontWeight: typography.fieldLabels.fontWeight,
          color: colors.secondaryBrand,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
        }}
      >
        {displayCategory}
      </div>

      {/* Dashboard / Module Title (28px Bold 700 / 40px) */}
      <h1
        style={{
          fontSize: typography.dashboardTitle.fontSize,
          lineHeight: typography.dashboardTitle.lineHeight,
          fontWeight: typography.dashboardTitle.fontWeight,
          color: colors.primaryText,
          marginBottom: '28px',
          textTransform: 'capitalize',
          letterSpacing: '-0.5px',
        }}
      >
        {displayTitle}
      </h1>

      {/* Card Surface: White (#FFFFFF) with Slate 200 (#E2E8F0) border */}
      <div
        style={{
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.borders}`,
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          maxWidth: '680px',
        }}
      >
        {/* Card Heading (16px SemiBold 600 / 24px) */}
        <h2
          style={{
            fontSize: typography.cardHeading.fontSize,
            lineHeight: typography.cardHeading.lineHeight,
            fontWeight: typography.cardHeading.fontWeight,
            color: colors.primaryText,
            marginBottom: '16px',
          }}
        >
          Module Overview
        </h2>

        {/* Semantic Badges: Exact foundations specification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: badges.completed.bg,
              color: badges.completed.text,
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid #BBF7D0',
            }}
          >
            ● Active Route
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: badges.inProgress.bg,
              color: badges.inProgress.text,
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid #BFDBFE',
            }}
          >
            Connected to Sidebar
          </span>
        </div>

        {/* Body Text (14px Regular 400 / 22px) */}
        <p
          style={{
            fontSize: typography.bodyText.fontSize,
            lineHeight: typography.bodyText.lineHeight,
            fontWeight: typography.bodyText.fontWeight,
            color: colors.secondaryText,
            marginBottom: '20px',
          }}
        >
          This module is part of the Kalpanaaa CMS enterprise workspace. Navigation route:{' '}
          <code
            style={{
              color: colors.secondaryBrand,
              backgroundColor: colors.appBackground,
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13px',
              border: `1px solid ${colors.borders}`,
            }}
          >
            {location.pathname}
          </code>
        </p>

        {/* Supporting Information (12px Regular 400 / 18px) */}
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: colors.appBackground,
            border: `1px dashed ${colors.borders}`,
            color: colors.secondaryText,
            fontSize: typography.supportingInfo.fontSize,
            lineHeight: typography.supportingInfo.lineHeight,
            fontWeight: typography.supportingInfo.fontWeight,
          }}
        >
          Shared visual foundations for 28 modules. Ready for feature implementation.
        </div>
      </div>
    </div>
  );
};
