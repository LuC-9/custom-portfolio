"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Route, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useGame } from "@/contexts/game-context"
import { type HintItem, useFloatingHints } from "@/hooks/use-floating-hint"

type BubblePosition = { left: string; top: string }

type BubbleProps = {
  hint: HintItem
  index: number
  position: BubblePosition
  onDismiss: (id: string) => void
  reduceMotion: boolean
}

const ANCHORS: ReadonlyArray<{ left: string; top: string }> = [
  { left: "12%", top: "15%" },
  { left: "48%", top: "45%" },
  { left: "20%", top: "75%" },
]

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function Bubble({ hint, index, position, onDismiss, reduceMotion }: BubbleProps) {
  const router = useRouter()
  const [bursting, setBursting] = useState(false)
  const particleOffsetsRef = useRef<Array<{ x: number; y: number }> | null>(null)
  const isPill = hint.label.split(" ").length <= 3

  if (particleOffsetsRef.current === null) {
    const baseAngle = randomInRange(0, 45)
    particleOffsetsRef.current = Array.from({ length: 8 }, (_, particleIndex) => {
      const angle = baseAngle + particleIndex * 45
      const radians = (angle * Math.PI) / 180
      return {
        x: Math.cos(radians) * 40,
        y: Math.sin(radians) * 40,
      }
    })
  }

  const handleActivate = () => {
    if (bursting) return
    if (hint.route) router.push(hint.route)
    setBursting(true)
    window.setTimeout(() => onDismiss(hint.id), 500)
  }

  return (
    <div
      style={{
        position: "absolute",
        left: position.left,
        top: position.top,
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
      }}
    >
      <motion.button
        type="button"
        aria-label={hint.label}
        title={hint.label}
        onClick={handleActivate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            handleActivate()
          }
        }}
        className={
          isPill
            ? "relative flex items-center gap-2 rounded-full border border-border/60 bg-card/90 px-3 py-2 text-foreground shadow-kinetic backdrop-blur"
            : "relative flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card/90 text-foreground shadow-kinetic backdrop-blur"
        }
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          reduceMotion
            ? bursting
              ? { opacity: 0 }
              : { opacity: 1, scale: 1 }
            : bursting
              ? { opacity: 0, scale: 1.2 }
              : { opacity: 1, scale: 1, y: [0, -6, 0] }
        }
        transition={
          reduceMotion
            ? bursting
              ? { duration: 0.15 }
              : { duration: 0.2 }
            : bursting
              ? { duration: 0.35, ease: "easeOut" }
              : {
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                  y: { duration: 4, ease: "easeInOut", repeat: Infinity, delay: index * 1.3 },
                }
        }
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        whileHover={{ scale: reduceMotion ? 1 : isPill ? 1.02 : 1.05 }}
      >
        {hint.icon === "route" ? (
          <Route className={isPill ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        ) : (
          <Sparkles className={isPill ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        )}

        {isPill ? (
          <span className="font-mono text-xs font-medium tracking-tight whitespace-nowrap">{hint.label}</span>
        ) : (
          <span className="sr-only">{hint.label}</span>
        )}
      </motion.button>

      {bursting && !reduceMotion ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {particleOffsetsRef.current.map((particle, particleIndex) => (
            <motion.div
              key={`${hint.id}-particle-${particleIndex}`}
              className="h-2 w-2 rounded-full bg-primary"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: particle.x, y: particle.y, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          ))}
        </span>
      ) : null}
    </div>
  )
}

export function FloatingHint() {
  const { state } = useGame()
  const { hints, dismissHint } = useFloatingHints(state.completedTaskIds, { max: 3 })
  const reduceMotion = useReducedMotion()
  const positionsRef = useRef<Map<string, BubblePosition>>(new Map())

  useEffect(() => {
    const activeHintIds = new Set(hints.map((hint) => hint.id))
    for (const id of Array.from(positionsRef.current.keys())) {
      if (!activeHintIds.has(id)) {
        positionsRef.current.delete(id)
      }
    }
  }, [hints])

  const positionedHints = hints.map((hint, index) => {
    const existingPosition = positionsRef.current.get(hint.id)
    if (existingPosition) {
      return { hint, position: existingPosition }
    }

    const anchor = ANCHORS[index] ?? ANCHORS[index % ANCHORS.length]
    const jitterX = Math.round((Math.random() - 0.5) * 16)
    const jitterY = Math.round((Math.random() - 0.5) * 16)
    const position = {
      left: `calc(${anchor.left} + ${jitterX}px)`,
      top: `calc(${anchor.top} + ${jitterY}px)`,
    }

    positionsRef.current.set(hint.id, position)
    return { hint, position }
  })

  if (state.focusMode || hints.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed left-4 top-20 z-30 h-[240px] w-full max-w-md max-w-[calc(100vw-180px)] md:max-w-md"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence>
        {positionedHints.map(({ hint, position }, index) => (
          <Bubble
            key={hint.id}
            hint={hint}
            index={index}
            position={position}
            onDismiss={dismissHint}
            reduceMotion={reduceMotion ?? false}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
