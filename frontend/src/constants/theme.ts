/**
 * Design System / Foundations (v1.0)
 * 12 core color tokens, single type family (Inter), and purposeful semantic rules.
 */

export const colors = {
  // Brand & Surfaces
  primaryBrand: '#0D172E', // Midnight Navy: Sidebar & brand identity
  midnightNavyAlt: '#172554',
  secondaryBrand: '#4F46E5', // Indigo: Primary actions and active states
  accent: '#0D9488', // Teal: Highlights and secondary actions
  appBackground: '#F8FAFC', // Cool Gray: Main workspace
  cardBackground: '#FFFFFF', // White: Cards, tables and forms

  // Content & Typography
  primaryText: '#0F172A', // Slate 900: Headings and important content
  secondaryText: '#64748B', // Slate 500: Supporting text and labels
  borders: '#E2E8F0', // Slate 200: Dividers and component boundaries

  // Semantics
  success: '#16A34A', // Green: Completed and successful states
  warning: '#D97706', // Amber: Pending actions and warnings
  error: '#DC2626', // Red: Failed actions and critical issues
  information: '#2563EB', // Blue: Informational notifications
  chartViolet: '#7C3AED', // Violet: Chart extension

  // Sidebar specifics
  sidebarBg: '#0D172E',
  sidebarBorderRight: '#152347',
  sidebarHeaderBorder: '#142144',
  sidebarActivePill: '#152755',
  sidebarActiveAccent: '#4F46E5',
} as const;

export const badges = {
  completed: {
    bg: '#F0FDF4',
    text: '#166534',
  },
  pending: {
    bg: '#FFFBEB',
    text: '#92400E',
  },
  failed: {
    bg: '#FEF2F2',
    text: '#991B1B',
  },
  inProgress: {
    bg: '#EFF6FF',
    text: '#1E40AF',
  },
} as const;

export const typography = {
  fontFamily: "'Inter', sans-serif",
  dashboardTitle: {
    fontSize: '28px',
    lineHeight: '40px',
    fontWeight: 700, // Bold
  },
  modulePageTitle: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 600, // SemiBold
  },
  sectionHeading: {
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: 600, // SemiBold
  },
  cardHeading: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 600, // SemiBold
  },
  bodyText: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: 400, // Regular
  },
  tableContent: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400, // Regular
  },
  fieldLabels: {
    fontSize: '13px',
    lineHeight: '20px',
    fontWeight: 500, // Medium
  },
  buttons: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 500, // Medium
  },
  supportingInfo: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400, // Regular
  },
} as const;
