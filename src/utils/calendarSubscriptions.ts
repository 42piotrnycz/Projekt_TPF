import type { Subscription } from '../types/subscription'

export function getRenewalDayOfMonth(renewalDate: string): number {
  return new Date(`${renewalDate}T00:00:00`).getDate()
}

export function subscriptionOccursOnDay(
  sub: Subscription,
  viewYear: number,
  viewMonth: number,
  day: number,
): boolean {
  if (sub.recurring) {
    const renewalDay = getRenewalDayOfMonth(sub.renewalDate)
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const effectiveDay = Math.min(renewalDay, daysInMonth)
    return day === effectiveDay
  }

  const renewal = new Date(`${sub.renewalDate}T00:00:00`)
  return (
    renewal.getFullYear() === viewYear &&
    renewal.getMonth() === viewMonth &&
    renewal.getDate() === day
  )
}

export function getSubscriptionsForDay(
  subscriptions: Subscription[],
  viewYear: number,
  viewMonth: number,
  day: number,
): Subscription[] {
  return subscriptions.filter((sub) =>
    sub.status === 'active' && subscriptionOccursOnDay(sub, viewYear, viewMonth, day),
  )
}
