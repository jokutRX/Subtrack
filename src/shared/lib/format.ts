export function formatCurrency(
  value: number,
  currency: 'RUB' | 'USD' | 'EUR',
): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}