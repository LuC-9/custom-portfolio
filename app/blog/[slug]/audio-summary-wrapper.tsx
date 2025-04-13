"use client"

import { AudioSummary } from "@/components/audio-summary"

export function AudioSummaryWrapper({ audioSrc, title }: { audioSrc: string, title?: string }) {
  return <AudioSummary audioSrc={audioSrc} title={title || "Listen it as a podcast"} />
}


