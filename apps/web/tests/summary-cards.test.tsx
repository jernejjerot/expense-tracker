import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SummaryCards } from '../src/components/SummaryCards';

describe('SummaryCards', () => {
  it('renders fallback when summary is missing', () => {
    render(<SummaryCards summary={null} />);
    expect(screen.getByText(/Summary not loaded yet/i)).toBeTruthy();
  });

  it('renders summary values', () => {
    render(
      <SummaryCards
        summary={{
          month: '2026-06',
          totalAmount: 120,
          count: 4,
          byCategory: {
            food: 30,
            transport: 20,
            housing: 0,
            utilities: 30,
            health: 10,
            education: 10,
            entertainment: 20,
            other: 0,
          },
          trendVsPreviousMonth: 15,
        }}
      />,
    );

    expect(screen.getByText('Entries')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
    expect(screen.getByText('+15.00 vs previous month')).toBeTruthy();
  });
});
