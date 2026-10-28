import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge } from '@/components/ui/PriorityBadge';

describe('PriorityBadge Component', () => {
  it('renders High priority badge correctly', () => {
    render(<PriorityBadge priority="High" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders Medium priority badge correctly', () => {
    render(<PriorityBadge priority="Medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders Low priority badge correctly', () => {
    render(<PriorityBadge priority="Low" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('normalizes case (e.g. "high" -> "High")', () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });
});

