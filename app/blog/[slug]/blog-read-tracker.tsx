"use client"

import { useEffect } from "react"
import { emitGameEvent } from "@/lib/game/event-bus"

type BlogReadTrackerProps = {
  slug: string
  title: string
}

export function BlogReadTracker({ slug, title }: BlogReadTrackerProps) {
  useEffect(() => {
    emitGameEvent({
      type: "blog_read",
      taskId: `blog:${slug}`.toLowerCase(),
      metadata: {
        slug,
        title,
      },
    })
  }, [slug, title])

  return null
}
