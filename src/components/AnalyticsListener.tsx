import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { logEvent } from 'firebase/analytics'
import { analytics } from '../lib/firebase'

export function AnalyticsListener() {
  const location = useLocation()

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
    })
  }, [location])

  return null
}
