import { ExpenseCategory, expenseCategoryValues } from '@expense-tracker/shared';

type Filters = {
  category?: ExpenseCategory;
  fromDate?: string;
  toDate?: string;
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function Filters({ filters, onChange }: Props) {
  return (
    <section className="panel filter-grid">
      <h3>Filters</h3>
      <label>
        Category
        <select
          value={filters.category ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              category: (event.target.value || undefined) as ExpenseCategory | undefined,
            })
          }
        >
          <option value="">All</option>
          {expenseCategoryValues.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        From
        <input
          type="date"
          value={filters.fromDate ?? ''}
          onChange={(event) => onChange({ ...filters, fromDate: event.target.value || undefined })}
        />
      </label>
      <label>
        To
        <input
          type="date"
          value={filters.toDate ?? ''}
          onChange={(event) => onChange({ ...filters, toDate: event.target.value || undefined })}
        />
      </label>
    </section>
  );
}
