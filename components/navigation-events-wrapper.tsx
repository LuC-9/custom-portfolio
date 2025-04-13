'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import NavigationEvents with no SSR
const NavigationEvents = dynamic(
  () => import('@/components/navigation-events').then(mod => ({ default: mod.NavigationEvents })),
  { ssr: false }
)

export function NavigationEventsWrapper() {
  return (
    <Suspense fallback={null}>
      <NavigationEvents />
    </Suspense>
  )
}