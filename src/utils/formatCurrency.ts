const formatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
})

export function formatCurrency(amount: number): string {
  return formatter.format(amount)
}
