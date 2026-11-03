import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PriorityCard } from '@/components/ui/PriorityCard';

describe('PriorityCard Component', () => {
  it('renders title, subtitle, count, and fires click handler', () => {
    const handleClick = vi.fn();
    render(
      <PriorityCard
        level="high"
        title="High Priority"
        subtitle="Critical items"
        count={25}
        icon={<span data-testid="icon">icon</span>}
        onClick={handleClick}
      />
    );

    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Critical items')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();

    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders active selection state when isActive is true', () => {
    render(
      <PriorityCard
        level="medium"
        title="Medium Priority"
        subtitle="Action required soon"
        count={17}
        icon={<span>icon</span>}
        isActive={true}
      />
    );

    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
  });
});

