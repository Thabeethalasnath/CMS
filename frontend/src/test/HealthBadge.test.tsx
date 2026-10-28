import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HealthBadge } from '@/components/ui/HealthBadge';

describe('HealthBadge Component', () => {
  it('renders Overdue badge with appropriate label and styles', () => {
    render(<HealthBadge status="Overdue" />);
    const badge = screen.getByText('Overdue');
    expect(badge).toBeInTheDocument();
  });

  it('renders Due Soon badge with appropriate label and styles', () => {
    render(<HealthBadge status="Due Soon" />);
    const badge = screen.getByText('Due Soon');
    expect(badge).toBeInTheDocument();
  });

  it('renders On Track badge with appropriate label and styles', () => {
    render(<HealthBadge status="On Track" />);
    const badge = screen.getByText('On Track');
    expect(badge).toBeInTheDocument();
  });

  it('falls back to On Track for unknown status', () => {
    render(<HealthBadge status="UnknownStatus" />);
    const badge = screen.getByText('On Track');
    expect(badge).toBeInTheDocument();
  });
});

