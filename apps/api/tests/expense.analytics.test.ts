import { describe, expect, it } from 'vitest';

import { calculateMonthlySummary } from '../src/modules/expenses/expense.analytics.js';

describe('calculateMonthlySummary', () => {
  it('calculates totals, categories and trend correctly', () => {
    const currentMonth = [
      {
        id: 'f9225de0-c422-4a68-9f27-6f5e40ceec63',
        amount: 40,
        category: 'food' as const,
        date: '2026-06-01',
        note: 'Groceries',
        createdAt: '2026-06-01T00:00:00.000Z',
        updatedAt: '2026-06-01T00:00:00.000Z',
      },
      {
        id: '03e48236-edf8-44a8-9422-58ef6dc0f573',
        amount: 20,
        category: 'transport' as const,
        date: '2026-06-02',
        note: 'Bus card',
        createdAt: '2026-06-02T00:00:00.000Z',
        updatedAt: '2026-06-02T00:00:00.000Z',
      },
    ];

    const previousMonth = [
      {
        id: '4d9a526f-ef9f-4f61-9ca3-35d9901d6045',
        amount: 30,
        category: 'food' as const,
        date: '2026-05-01',
        note: 'Meal',
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T00:00:00.000Z',
      },
    ];

    const summary = calculateMonthlySummary('2026-06', currentMonth, previousMonth);

    expect(summary.totalAmount).toBe(60);
    expect(summary.count).toBe(2);
    expect(summary.byCategory.food).toBe(40);
    expect(summary.byCategory.transport).toBe(20);
    expect(summary.trendVsPreviousMonth).toBe(30);
  });
});
