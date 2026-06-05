import {
  CreateExpenseInput,
  Expense,
  ExpenseFilterInput,
  ExpenseCategory,
  MonthlySummary,
} from '@expense-tracker/shared';
import { useEffect, useMemo, useState } from 'react';

import { createExpense, deleteExpense, getMonthlySummary, listExpenses } from '../api/client';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseTable } from '../components/ExpenseTable';
import { Filters } from '../components/Filters';
import { SummaryCards } from '../components/SummaryCards';

export function App() {
  const [filters, setFilters] = useState<ExpenseFilterInput>({});
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [error, setError] = useState('');

  const selectedMonth = useMemo(() => {
    const base = filters.toDate ? new Date(filters.toDate) : new Date();
    return { year: base.getFullYear(), month: base.getMonth() + 1 };
  }, [filters.toDate]);

  async function loadData(activeFilters: ExpenseFilterInput) {
    try {
      setError('');
      const [expenseItems, monthlySummary] = await Promise.all([
        listExpenses(activeFilters),
        getMonthlySummary(selectedMonth.year, selectedMonth.month),
      ]);
      setExpenses(expenseItems);
      setSummary(monthlySummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }
  }

  useEffect(() => {
    loadData(filters);
  }, [filters, selectedMonth.year, selectedMonth.month]);

  async function handleCreate(input: {
    amount: number;
    category: ExpenseCategory;
    date: string;
    note: string;
  }) {
    const payload: CreateExpenseInput = {
      amount: input.amount,
      category: input.category,
      date: input.date,
      note: input.note,
    };
    await createExpense(payload);
    await loadData(filters);
  }

  async function handleDelete(id: string) {
    await deleteExpense(id);
    await loadData(filters);
  }

  return (
    <main className="app-shell">
      <header>
        <h1>Mini Expense Tracker</h1>
        <p>Real business flow with filters, summary and trend.</p>
      </header>

      {error ? <div className="error-banner">{error}</div> : null}

      <SummaryCards summary={summary} />
      <Filters filters={filters} onChange={setFilters} />
      <ExpenseForm onSubmit={handleCreate} />
      <ExpenseTable expenses={expenses} onDelete={handleDelete} />
    </main>
  );
}
