import type { ManualEntry } from '../types/manualEntry'

const STORAGE_KEY = 'savemammona_manual_entries'

function readAll(): ManualEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ManualEntry[]) : []
  } catch {
    return []
  }
}

function writeAll(items: ManualEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getManualEntries(): ManualEntry[] {
  return readAll()
}

export function addManualEntry(data: Omit<ManualEntry, 'id'>): ManualEntry {
  const item: ManualEntry = { ...data, id: crypto.randomUUID() }
  writeAll([...readAll(), item])
  return item
}
