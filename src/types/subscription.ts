export type SubscriptionCategory =
  | 'entertainment'
  | 'software'
  | 'music'
  | 'storage'
  | 'health'
  | 'streaming'

export type SubscriptionStatus = 'active' | 'paused'
export type BillingCycle = 'monthly' | 'yearly'

export interface Subscription {
  id: string
  name: string
  category: SubscriptionCategory
  amount: number
  billingCycle: BillingCycle
  renewalDate: string
  status: SubscriptionStatus
  autoPay: boolean
  recurring: boolean
  iconColor: string
  trialEndsAt?: string
}

export const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  entertainment: 'Entertainment',
  software: 'Software',
  music: 'Music',
  storage: 'Storage',
  health: 'Health',
  streaming: 'Streaming',
}

export const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  entertainment: '#ef4444',
  software: '#3b82f6',
  music: '#22c55e',
  storage: '#60a5fa',
  health: '#10b981',
  streaming: '#f43f5e',
}

export function getSubscriptionMonthlyAmount(subscription: Subscription): number {
  return subscription.billingCycle === 'yearly'
    ? subscription.amount / 12
    : subscription.amount
}
