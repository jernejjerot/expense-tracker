import {
  CreateExpenseInput,
  Expense,
  ExpenseCategory,
  ExpenseFilterInput,
  MonthlySummary,
  UpdateExpenseInput,
} from '@expense-tracker/shared';
import { PrismaClient } from '@prisma/client';

import { ApiError } from '../../errors/api-error.js';
import { calculateMonthlySummary } from './expense.analytics.js';

export class ExpenseService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateExpenseInput): Promise<Expense> {
    const created = await this.prisma.expense.create({
      data: {
        amount: input.amount,
        category: input.category,
        date: new Date(input.date),
        note: input.note,
      },
    });

    return this.toExpense(created);
  }

  async list(filters: ExpenseFilterInput): Promise<Expense[]> {
    const expenses = await this.prisma.expense.findMany({
      where: {
        category: filters.category,
        date: {
          gte: filters.fromDate ? new Date(filters.fromDate) : undefined,
          lte: filters.toDate ? new Date(filters.toDate) : undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return expenses.map((item) => this.toExpense(item));
  }

  async update(id: string, input: UpdateExpenseInput): Promise<Expense> {
    const existing = await this.prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'EXPENSE_NOT_FOUND', `Expense with id ${id} was not found`);
    }

    const updated = await this.prisma.expense.update({
      where: { id },
      data: {
        amount: input.amount,
        category: input.category,
        date: input.date ? new Date(input.date) : undefined,
        note: input.note,
      },
    });

    return this.toExpense(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.prisma.expense.deleteMany({ where: { id } });
    if (!deleted.count) {
      throw new ApiError(404, 'EXPENSE_NOT_FOUND', `Expense with id ${id} was not found`);
    }
  }

  async monthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const currentMonthStart = new Date(Date.UTC(year, month - 1, 1));
    const nextMonthStart = new Date(Date.UTC(year, month, 1));
    const previousMonthStart = new Date(Date.UTC(year, month - 2, 1));

    const [currentMonthExpenses, previousMonthExpenses] = await Promise.all([
      this.prisma.expense.findMany({
        where: {
          date: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          },
        },
      }),
      this.prisma.expense.findMany({
        where: {
          date: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
    ]);

    return calculateMonthlySummary(
      `${year}-${String(month).padStart(2, '0')}`,
      currentMonthExpenses.map((item) => this.toExpense(item)),
      previousMonthExpenses.map((item) => this.toExpense(item)),
    );
  }

  private toExpense(raw: {
    id: string;
    amount: number;
    category: string;
    date: Date;
    note: string;
    createdAt: Date;
    updatedAt: Date;
  }): Expense {
    return {
      id: raw.id,
      amount: Number(raw.amount.toFixed(2)),
      category: raw.category as ExpenseCategory,
      date: raw.date.toISOString().slice(0, 10),
      note: raw.note,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };
  }
}
