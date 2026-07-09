"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { FaSpotify } from "react-icons/fa"
import type { CSSProperties } from "react"

type SpotifyCardProps = {
  song: string
  artist: string
  albumArtUrl: string | null
  startMs: number
  endMs: number
}

export function SpotifyCard({ song, artist, albumArtUrl, startMs, endMs }: SpotifyCardProps) {
  const totalMs = endMs - startMs
  const elapsedMs = Math.max(0, Math.min(totalMs, Date.now() - startMs))

  return (
    <motion.div
      role="status"
      aria-label={`Listening to ${song} by ${artist} on Spotify`}
      className="flex w-full max-w-[320px] flex-col overflow-hidden rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative h-12 w-12 shrink-0">
          {albumArtUrl ? (
            <Image
              src={albumArtUrl}
              alt=""
              width={48}
              height={48}
              className="rounded-lg object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-zinc-900/40">
              <FaSpotify className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            </div>
          )}
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card bg-emerald-500"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{song}</p>
          <p className="truncate text-xs text-muted-foreground">{artist}</p>
        </div>

        <FaSpotify className="mt-0.5 h-4 w-4 shrink-0 self-start text-emerald-500" aria-hidden="true" />
      </div>

      <div className="h-[2px] w-full overflow-hidden bg-border/40">
        <div
          className="spotify-progress-fill h-full origin-left bg-emerald-500"
          style={
            {
              "--total-ms": `${Math.max(totalMs, 1)}ms`,
              "--elapsed-ms": `-${elapsedMs}ms`,
            } as CSSProperties
          }
        />
      </div>
    </motion.div>
  )
}
