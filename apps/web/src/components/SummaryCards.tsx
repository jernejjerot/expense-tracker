import { MonthlySummary } from '@expense-tracker/shared';

import { formatCurrency, formatTrend } from '../utils/format';

type Props = {
  summary: MonthlySummary | null;
};

export function SummaryCards({ summary }: Props) {
  if (!summary) {
    return <p className="panel">Summary not loaded yet.</p>;
  }

  return (
    <section className="summary-grid">
      <article className="panel">
        <h3>Total</h3>
        <p>{formatCurrency(summary.totalAmount)}</p>
      </article>
      <article className="panel">
        <h3>Entries</h3>
        <p>{summary.count}</p>
      </article>
      <article className="panel">
        <h3>Trend</h3>
        <p>{formatTrend(summary.trendVsPreviousMonth)}</p>
      </article>
    </section>
  );
}
