import { describe, expect, it } from 'vitest';

import { createExpenseSchema, updateExpenseSchema } from '../src';

describe('shared schemas', () => {
  it('accepts valid create payload', () => {
    const parsed = createExpenseSchema.parse({
      amount: 44.2,
      category: 'food',
      date: '2026-06-05',
      note: 'Groceries',
    });

    expect(parsed.amount).toBe(44.2);
  });

  it('rejects empty update payload', () => {
    const result = updateExpenseSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
