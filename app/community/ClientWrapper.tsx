"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the client component with suspense
const CommunityAndStreamsClient = dynamic(
  () => import("./CommunityAndStreamsClient"),
  {
    loading: () => <div className="rounded-xl border border-border/60 bg-card/40 p-6 text-sm text-muted-foreground">Loading community content...</div>,
    ssr: false
  }
)

export default function ClientWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading community content...</div>}>
      <CommunityAndStreamsClient />
    </Suspense>
  )
}





