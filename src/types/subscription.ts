export type SubscriptionCategory =
  | 'entertainment'
  | 'software'
  | 'music'
  | 'storage'
  | 'health'
  | 'streaming'

export type SubscriptionStatus = 'active' | 'paused'

export interface Subscription {
  id: string
  name: string
  category: SubscriptionCategory
  amount: number
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
