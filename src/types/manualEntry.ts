export type ManualEntryCategory = 'food' | 'shopping' | 'services' | 'other'

export interface ManualEntry {
  id: string
  title: string
  amount: number
  date: string
  category: ManualEntryCategory
  notes?: string
  iconColor: string
}

export const MANUAL_ENTRY_LABELS: Record<ManualEntryCategory, string> = {
  food: 'Food',
  shopping: 'Shopping',
  services: 'Services',
  other: 'Other',
}

export const MANUAL_ENTRY_COLORS: Record<ManualEntryCategory, string> = {
  food: '#34d399',
  shopping: '#60a5fa',
  services: '#fca5a5',
  other: '#94a3b8',
}
