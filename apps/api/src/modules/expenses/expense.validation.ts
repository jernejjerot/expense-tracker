import { z } from 'zod';

import {
  createExpenseSchema,
  expenseFilterSchema,
  updateExpenseSchema,
} from '@expense-tracker/shared';

export const createExpenseRequestSchema = z.object({
  body: createExpenseSchema,
});

export const updateExpenseRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: updateExpenseSchema,
});

export const deleteExpenseRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const listExpenseRequestSchema = z.object({
  query: expenseFilterSchema,
});

export const summaryRequestSchema = z.object({
  query: z.object({
    year: z.coerce.number().int().min(2000).max(2100),
    month: z.coerce.number().int().min(1).max(12),
  }),
});
