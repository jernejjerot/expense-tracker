import { Expense, ExpenseCategory, MonthlySummary } from '@expense-tracker/shared';

type CategoryTotals = Record<ExpenseCategory, number>;

function createCategoryTotals(): CategoryTotals {
  return {
    food: 0,
    transport: 0,
    housing: 0,
    utilities: 0,
    health: 0,
    education: 0,
    entertainment: 0,
    other: 0,
  };
}

export function calculateMonthlySummary(
  month: string,
  currentMonthExpenses: Expense[],
  previousMonthExpenses: Expense[],
): MonthlySummary {
  const byCategory = createCategoryTotals();

  let currentTotal = 0;
  for (const expense of currentMonthExpenses) {
    byCategory[expense.category] += expense.amount;
    currentTotal += expense.amount;
  }

  const previousTotal = previousMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  return {
    month,
    totalAmount: Number(currentTotal.toFixed(2)),
    count: currentMonthExpenses.length,
    byCategory,
    trendVsPreviousMonth: Number((currentTotal - previousTotal).toFixed(2)),
  };
}
