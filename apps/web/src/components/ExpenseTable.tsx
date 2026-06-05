import { Expense } from '@expense-tracker/shared';

import { formatCurrency } from '../utils/format';

type Props = {
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
};

export function ExpenseTable({ expenses, onDelete }: Props) {
  if (expenses.length === 0) {
    return <p className="panel">No expenses for selected filter.</p>;
  }

  return (
    <div className="panel">
      <h3>Expenses</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Note</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.date}</td>
              <td>{expense.category}</td>
              <td>{expense.note}</td>
              <td>{formatCurrency(expense.amount)}</td>
              <td>
                <button className="danger" type="button" onClick={() => onDelete(expense.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
