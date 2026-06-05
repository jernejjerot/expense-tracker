export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR' }).format(value);
}

export function formatTrend(delta: number): string {
  if (delta === 0) return 'No change vs previous month';
  if (delta > 0) return `+${delta.toFixed(2)} vs previous month`;
  return `${delta.toFixed(2)} vs previous month`;
}
