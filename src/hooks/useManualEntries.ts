import { useCallback, useEffect, useState } from 'react'
import type { ManualEntry } from '../types/manualEntry'
import { addManualEntry, getManualEntries } from '../utils/manualEntryStorage'

function notify() {
  window.dispatchEvent(new Event('manual-entries-updated'))
}

export function useManualEntries() {
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>(() =>
    getManualEntries(),
  )

  useEffect(() => {
    function refresh() {
      setManualEntries(getManualEntries())
    }

    window.addEventListener('manual-entries-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('manual-entries-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const create = useCallback((data: Omit<ManualEntry, 'id'>) => {
    const item = addManualEntry(data)
    setManualEntries(getManualEntries())
    notify()
    return item
  }, [])

  return { manualEntries, create }
}
