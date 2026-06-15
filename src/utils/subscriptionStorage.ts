import type { Subscription, SubscriptionCategory } from '../types/subscription'

const STORAGE_KEY = 'savemammona_subscriptions'

function addDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const SEED: Omit<Subscription, 'id'>[] = [
  {
    name: 'Spotify Premium',
    category: 'music',
    amount: 19.99,
    renewalDate: addDays(1),
    status: 'active',
    autoPay: true,
    recurring: true,
    iconColor: '#22c55e',
  },
  {
    name: 'iCloud+',
    category: 'storage',
    amount: 3.99,
    renewalDate: addDays(3),
    status: 'active',
    autoPay: true,
    recurring: true,
    iconColor: '#60a5fa',
  },
  {
    name: 'Local Gym',
    category: 'health',
    amount: 120,
    renewalDate: addDays(5),
    status: 'active',
    autoPay: true,
    recurring: true,
    iconColor: '#10b981',
  },
  {
    name: 'Netflix',
    category: 'entertainment',
    amount: 43,
    renewalDate: addDays(2),
    status: 'active',
    autoPay: false,
    recurring: true,
    iconColor: '#ef4444',
    trialEndsAt: addDays(2),
  },
  {
    name: 'Adobe Creative Cloud',
    category: 'software',
    amount: 90,
    renewalDate: addDays(12),
    status: 'active',
    autoPay: true,
    recurring: true,
    iconColor: '#f97316',
  },
  {
    name: 'Equinox Gym',
    category: 'health',
    amount: 180,
    renewalDate: addDays(20),
    status: 'paused',
    autoPay: false,
    recurring: true,
    iconColor: '#8b5cf6',
  },
]

function normalizeSubscription(raw: Subscription): Subscription {
  return {
    ...raw,
    recurring: raw.recurring ?? true,
  }
}

function readAll(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return (parsed as Subscription[]).map(normalizeSubscription)
  } catch {
    return []
  }
}

function writeAll(items: Subscription[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function ensureSeedSubscriptions(): void {
  if (readAll().length > 0) return
  writeAll(SEED.map((item) => ({ ...item, id: crypto.randomUUID() })))
}

export function getSubscriptions(): Subscription[] {
  return readAll()
}

export function addSubscription(
  data: Omit<Subscription, 'id'>,
): Subscription {
  const item: Subscription = { ...data, id: crypto.randomUUID() }
  writeAll([...readAll(), item])
  return item
}

export function updateSubscription(
  id: string,
  patch: Partial<Subscription>,
): Subscription | null {
  const items = readAll()
  const index = items.findIndex((s) => s.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...patch }
  writeAll(items)
  return items[index]
}

export function getActiveMonthlyTotal(): number {
  return readAll()
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0)
}

export function getUpcoming(days = 7): Subscription[] {
  const today = new Date()
  const limit = new Date()
  limit.setDate(limit.getDate() + days)
  return readAll()
    .filter((s) => s.status === 'active')
    .filter((s) => {
      const renewal = new Date(s.renewalDate)
      return renewal >= today && renewal <= limit
    })
    .sort((a, b) => a.renewalDate.localeCompare(b.renewalDate))
}

export function getTopExpenses(limit = 3): Subscription[] {
  return [...readAll()]
    .filter((s) => s.status === 'active')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
}

export function getCategoryBreakdown(): { category: SubscriptionCategory; percent: number }[] {
  const active = readAll().filter((s) => s.status === 'active')
  const total = active.reduce((sum, s) => sum + s.amount, 0)
  if (total === 0) return []

  const sums = new Map<SubscriptionCategory, number>()
  for (const sub of active) {
    sums.set(sub.category, (sums.get(sub.category) ?? 0) + sub.amount)
  }

  return [...sums.entries()]
    .map(([category, amount]) => ({
      category,
      percent: Math.round((amount / total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent)
}
