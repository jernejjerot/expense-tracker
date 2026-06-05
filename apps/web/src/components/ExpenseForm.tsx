import { ExpenseCategory, expenseCategoryValues } from '@expense-tracker/shared';
import { FormEvent, useState } from 'react';

type Props = {
  onSubmit: (input: { amount: number; category: ExpenseCategory; date: string; note: string }) => Promise<void>;
};

export function ExpenseForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      amount: Number(amount),
      category: category as ExpenseCategory,
      date,
      note,
    });

    setAmount('');
    setNote('');
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      <label>
        Amount
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          type="number"
          min="0.01"
          step="0.01"
          required
        />
      </label>
      <label>
        Category
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {expenseCategoryValues.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date
        <input
          value={date}
          onChange={(event) => setDate(event.target.value)}
          type="date"
          required
        />
      </label>
      <label>
        Note
        <input value={note} onChange={(event) => setNote(event.target.value)} required maxLength={140} />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
