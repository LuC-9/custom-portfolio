"use client"

import Image from "next/image"
import { useEffect, useState, type CSSProperties, type JSX } from "react"
import { FaCode } from "react-icons/fa"

type ActivityAssets = {
  large_image?: string
  large_text?: string
  small_image?: string
  small_text?: string
}

type ActivityTimestamps = { start: number; end?: number }

type Activity = {
  name: string
  type?: number
  details?: string
  state?: string
  application_id?: string
  timestamps?: ActivityTimestamps
  assets?: ActivityAssets
}

type ActivityCardProps = { activity: Activity }

function resolveActivityImageUrl(
  assets: ActivityAssets | undefined,
  applicationId: string | undefined,
): string | null {
  const imageKey = assets?.large_image
  if (!imageKey) return null
  if (imageKey.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${imageKey.slice("mp:external/".length)}`
  }
  if (imageKey.startsWith("spotify:")) {
    return null
  }
  if (applicationId) {
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${imageKey}.png`
  }
  return null
}

function formatElapsed(startMs: number): string {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000))
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function ActivityCard({ activity }: ActivityCardProps): JSX.Element {
  const [elapsed, setElapsed] = useState<string>("")
  const startMs = activity.timestamps?.start
  const endMs = activity.timestamps?.end
  const totalMs = startMs && endMs ? Math.max(endMs - startMs, 1) : 0
  const elapsedMs = startMs ? Math.max(0, Date.now() - startMs) : 0
  const largeUrl = resolveActivityImageUrl(activity.assets, activity.application_id)
  const smallUrl = activity.assets?.small_image
    ? activity.assets.small_image.startsWith("spotify:")
      ? activity.application_id
        ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`
        : null
      : resolveActivityImageUrl({ large_image: activity.assets.small_image }, activity.application_id)
    : null

  useEffect(() => {
    if (!startMs) {
      setElapsed("")
      return
    }
    const updateElapsed = () => setElapsed(formatElapsed(startMs))
    updateElapsed()
    const intervalId = window.setInterval(updateElapsed, 1000)
    return () => window.clearInterval(intervalId)
  }, [startMs])

  return (
    <div
      role="status"
      aria-label={`Active in ${activity.name}`}
      className="w-full max-w-[320px] flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative h-12 w-12 shrink-0">
          {largeUrl ? (
            <Image src={largeUrl} alt="" width={48} height={48} className="rounded-lg object-cover" unoptimized />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-zinc-900/40">
              <FaCode className="h-5 w-5 text-muted-foreground" aria-hidden />
            </div>
          )}
          {largeUrl && smallUrl ? (
            <div className="absolute -bottom-1 -right-1 h-5 w-5 overflow-hidden rounded-full border-2 border-card">
              <Image
                src={smallUrl}
                alt={activity.assets?.small_text ?? ""}
                width={20}
                height={20}
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Playing</p>
          <p className="truncate text-sm font-medium text-foreground">{activity.name}</p>
          {activity.details ? <p className="truncate text-xs text-muted-foreground">{activity.details}</p> : null}
          {activity.state ? <p className="truncate text-xs text-muted-foreground/70">{activity.state}</p> : null}
        </div>

        <FaCode className="mt-0.5 h-4 w-4 shrink-0 self-start text-muted-foreground" aria-hidden />
      </div>

      {startMs ? (
        <div className="flex items-center justify-end px-3 pb-1">
          <span className="font-mono text-[10px] text-muted-foreground/80">{elapsed}</span>
        </div>
      ) : null}

      {startMs && endMs ? (
        <div className="h-[2px] w-full overflow-hidden bg-border/40">
          <div
            className="spotify-progress-fill h-full w-full bg-primary"
            style={
              {
                "--total-ms": `${totalMs}ms`,
                "--elapsed-ms": `-${elapsedMs}ms`,
              } as CSSProperties
            }
          />
        </div>
      ) : null}
    </div>
  )
}
