import { CreateExpenseInput, Expense, ExpenseFilterInput, MonthlySummary } from '@expense-tracker/shared';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Request failed');
  }

  return payload.data as T;
}

export async function listExpenses(filters: ExpenseFilterInput): Promise<Expense[]> {
  const query = new URLSearchParams();
  if (filters.category) query.set('category', filters.category);
  if (filters.fromDate) query.set('fromDate', filters.fromDate);
  if (filters.toDate) query.set('toDate', filters.toDate);

  const response = await fetch(`${API_BASE}/expenses?${query.toString()}`);
  return parseResponse<Expense[]>(response);
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const response = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseResponse<Expense>(response);
}

export async function deleteExpense(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.error?.message ?? 'Delete failed');
  }
}

export async function getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
  const query = new URLSearchParams({ year: String(year), month: String(month) });
  const response = await fetch(`${API_BASE}/expenses/summary/monthly?${query.toString()}`);
  return parseResponse<MonthlySummary>(response);
}
