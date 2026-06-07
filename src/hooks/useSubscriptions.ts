import { useCallback, useEffect, useState } from 'react'
import type { Subscription } from '../types/subscription'
import {
  addSubscription,
  getSubscriptions,
  updateSubscription,
} from '../utils/subscriptionStorage'

function notify() {
  window.dispatchEvent(new Event('subscriptions-updated'))
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() =>
    getSubscriptions(),
  )

  useEffect(() => {
    function refresh() {
      setSubscriptions(getSubscriptions())
    }

    window.addEventListener('subscriptions-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('subscriptions-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const create = useCallback((data: Omit<Subscription, 'id'>) => {
    const item = addSubscription(data)
    setSubscriptions(getSubscriptions())
    notify()
    return item
  }, [])

  const update = useCallback((id: string, patch: Partial<Subscription>) => {
    const item = updateSubscription(id, patch)
    setSubscriptions(getSubscriptions())
    notify()
    return item
  }, [])

  return { subscriptions, create, update }
}
