"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the client component with suspense
const CommunityAndStreamsClient = dynamic(
  () => import("./CommunityAndStreamsClient"),
  {
    loading: () => <div className="text-center py-8">Loading community content...</div>,
    ssr: false // Disable SSR for this component
  }
)

export default function ClientWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading community content...</div>}>
      <CommunityAndStreamsClient />
    </Suspense>
  )
}





