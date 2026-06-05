import { z } from 'zod';

export const expenseCategoryValues = [
  'food',
  'transport',
  'housing',
  'utilities',
  'health',
  'education',
  'entertainment',
  'other',
] as const;

export const expenseCategorySchema = z.enum(expenseCategoryValues);

export const expenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  category: expenseCategorySchema,
  date: z.string().date(),
  note: z.string().trim().min(1).max(140),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createExpenseSchema = z.object({
  amount: z.number().positive(),
  category: expenseCategorySchema,
  date: z.string().date(),
  note: z.string().trim().min(1).max(140),
});

export const updateExpenseSchema = createExpenseSchema.partial().refine(
  (val) => Object.keys(val).length > 0,
  'At least one field is required',
);

export const expenseFilterSchema = z.object({
  category: expenseCategorySchema.optional(),
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
});

export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseFilterInput = z.infer<typeof expenseFilterSchema>;

export type MonthlySummary = {
  month: string;
  totalAmount: number;
  count: number;
  byCategory: Record<ExpenseCategory, number>;
  trendVsPreviousMonth: number;
};

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
