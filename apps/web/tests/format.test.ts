import { describe, expect, it } from 'vitest';

import { formatCurrency, formatTrend } from '../src/utils/format';

describe('format utilities', () => {
  it('formats currency in EUR', () => {
    expect(formatCurrency(123.4)).toContain('123');
  });

  it('formats trend labels', () => {
    expect(formatTrend(0)).toBe('No change vs previous month');
    expect(formatTrend(12.5)).toBe('+12.50 vs previous month');
    expect(formatTrend(-3.25)).toBe('-3.25 vs previous month');
  });
});
