'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function FeaturedEventsTracker({ eventCount }: { eventCount: number }) {
  useEffect(() => {
    // This useEffect syncs with an external system (PostHog analytics)
    posthog.capture('featured_events_viewed', {
      event_count: eventCount,
    })
  }, [eventCount])

  return null
}
