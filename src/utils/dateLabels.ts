export function formatRenewalLabel(dateStr: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff > 1 && diff <= 7) return `In ${diff} days`
  return target.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function formatRenewalDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}
