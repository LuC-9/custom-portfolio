"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motionEase, useReducedMotionSafe } from "@/hooks/use-reduced-motion"

type Persona = "developer" | "gamer"

type HeroIntroProps = {
  persona: Persona
  onDone: () => void
}

type PersonaCard = {
  name: string
  label: string
  tagline: string
  image: string
  alt: string
  accent: string
  accentSoft: string
  backdrop: string
}

const PERSONA_INTRO: Record<Persona, PersonaCard> = {
  developer: {
    name: "AARSH",
    label: "DEVELOPER",
    tagline: "Software engineer at Nagarro. Shipping fast systems.",
    image: "/profile.jpg",
    alt: "Aarsh developer portrait",
    accent: "rgb(96, 165, 250)",
    accentSoft: "rgba(96, 165, 250, 0.22)",
    backdrop:
      "radial-gradient(1200px 800px at 30% 20%, rgba(96,165,250,0.28), transparent 65%), radial-gradient(1000px 700px at 82% 68%, rgba(56,189,248,0.16), transparent 70%), linear-gradient(180deg, #050914 0%, #030510 100%)",
  },
  gamer: {
    name: "LUC",
    label: "GAMER",
    tagline: "Competitive streamer. Community builder.",
    image: "/gamer-profile.gif?v=1",
    alt: "LuC gamer portrait",
    accent: "rgb(244, 63, 94)",
    accentSoft: "rgba(244, 63, 94, 0.24)",
    backdrop:
      "radial-gradient(1100px 800px at 70% 30%, rgba(244,63,94,0.30), transparent 65%), radial-gradient(900px 600px at 20% 80%, rgba(190,24,93,0.18), transparent 65%), linear-gradient(180deg, #05020a 0%, #010004 100%)",
  },
}

const HOLD_MS = 1750
const EXIT_MS = 720

const noiseSvg =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.75'/></svg>\")"

export function HeroIntro({ persona, onDone }: HeroIntroProps) {
  const reduce = useReducedMotionSafe()
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [initialPersona] = useState<Persona>(persona)
  const cfg = PERSONA_INTRO[initialPersona]
  const other = initialPersona === "developer" ? PERSONA_INTRO.gamer : PERSONA_INTRO.developer

  useEffect(() => {
    setMounted(true)
  }, [])

  const finish = useCallback(() => setVisible(false), [])

  useEffect(() => {
    const hold = reduce ? 900 : HOLD_MS
    const t = window.setTimeout(finish, hold)
    return () => window.clearTimeout(t)
  }, [reduce, finish])

  useEffect(() => {
    if (visible) return
    const t = window.setTimeout(onDone, EXIT_MS)
    return () => window.clearTimeout(t)
  }, [visible, onDone])

  useEffect(() => {
    if (typeof document === "undefined") return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [finish])

  const nameLetters = useMemo(() => cfg.name.split(""), [cfg.name])

  if (!mounted || typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hero-intro"
          role="dialog"
          aria-modal="true"
          aria-label={`Persona intro: ${cfg.name}, ${cfg.label}`}
          className="fixed left-0 top-0 flex h-[100dvh] w-[100dvw] items-center overflow-hidden"
          initial={{ opacity: reduce ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.4, ease: motionEase.expoOut } }
              : {
                  clipPath: "inset(0 0 100% 0)",
                  opacity: 1,
                  transition: {
                    clipPath: { duration: EXIT_MS / 1000, ease: motionEase.expoOut },
                    opacity: { duration: 0.28, ease: "easeOut", delay: (EXIT_MS - 220) / 1000 },
                  },
                }
          }
          style={{ background: cfg.backdrop, zIndex: 2147483000, isolation: "isolate" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{ backgroundImage: noiseSvg }}
          />

          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: 0.9, ease: motionEase.expoOut }}
              style={{
                background: `radial-gradient(1200px 900px at 68% 50%, ${cfg.accentSoft}, transparent 70%)`,
              }}
            />
          )}

          <motion.div
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 0 100%)", opacity: 1, scale: 1.06 }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)", scale: 1 }}
            transition={
              reduce
                ? { duration: 0.45, ease: motionEase.expoOut }
                : {
                    clipPath: { duration: 1.1, delay: 0.12, ease: motionEase.expoOut },
                    scale: { duration: 2.4, ease: "linear" },
                  }
            }
            className="absolute inset-y-0 right-0 h-full w-full md:w-[62%] lg:w-[58%]"
            style={{ willChange: "clip-path, transform" }}
          >
            <div className="relative h-full w-full">
              <Image
                src={cfg.image}
                alt={cfg.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-center"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(3,5,16,0.88) 0%, rgba(3,5,16,0.30) 32%, rgba(3,5,16,0) 62%, rgba(3,5,16,0.20) 100%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
                style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.5))" }}
              />
            </div>
          </motion.div>

          <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-center gap-6 px-6 py-16 md:px-10 md:gap-8 lg:px-14">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: motionEase.expoOut }}
              className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.32em] text-white/70 md:text-[11px]"
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: cfg.accent, boxShadow: `0 0 12px ${cfg.accent}` }}
              />
              BYLUC · LOADING PERSONA
            </motion.div>

            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.95, ease: motionEase.expoOut }}
              className="font-mono text-[11px] uppercase tracking-[0.34em]"
              style={{ color: cfg.accent }}
            >
              SELECTED · {cfg.label}
            </motion.p>

            <h1
              aria-label={cfg.name}
              className="font-sans font-black leading-[0.88] tracking-tighter text-white text-[19vw] md:text-[14vw] lg:text-[12vw]"
            >
              <span className="sr-only">{cfg.name}</span>
              <span aria-hidden className="inline-flex overflow-hidden pb-2">
                {nameLetters.map((ch, i) => (
                  <motion.span
                    key={`${ch}-${i}`}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: "68%" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0.4 : 0.9,
                      delay: reduce ? 0.15 : 0.4 + i * 0.06,
                      ease: motionEase.expoOut,
                    }}
                    className="inline-block will-change-transform"
                  >
                    {ch === " " ? "\u00a0" : ch}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.15, ease: motionEase.expoOut }}
              className="max-w-[36ch] text-sm text-white/75 md:text-base"
            >
              {cfg.tagline}
            </motion.p>
          </div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: motionEase.expoOut }}
            className="pointer-events-none absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
            aria-hidden
          >
            <Thumbnail image={cfg.image} accent={cfg.accent} isActive />
            <Thumbnail image={other.image} accent={other.accent} />
            <div className="mt-1 h-4 w-px bg-white/20" />
            <span
              className="font-mono text-[9px] uppercase tracking-[0.28em]"
              style={{ color: cfg.accent }}
            >
              {"01 / 02"}
            </span>
          </motion.div>

          <button
            type="button"
            onClick={finish}
            className="absolute right-3 top-3 z-30 inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border border-white/30 bg-black/50 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.22em] text-white backdrop-blur-md transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:right-4 md:top-4 md:min-h-0 md:min-w-0 md:bg-black/45 md:px-3 md:py-1.5 md:text-[11px]"
            aria-label="Skip intro"
          >
            <X className="h-3.5 w-3.5 md:h-3 md:w-3" aria-hidden />
            SKIP
          </button>

          {!reduce && (
            <motion.div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
              style={{ background: cfg.accent }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Thumbnail({
  image,
  accent,
  isActive = false,
}: {
  image: string
  accent: string
  isActive?: boolean
}) {
  return (
    <div
      className={cn(
        "relative h-11 w-11 overflow-hidden rounded-full border-2 transition-shadow",
        isActive ? "scale-110" : "opacity-70",
      )}
      style={{
        borderColor: accent,
        boxShadow: isActive
          ? `0 0 0 3px ${accent}55, 0 10px 24px rgba(0,0,0,0.5)`
          : "0 4px 10px rgba(0,0,0,0.35)",
      }}
    >
      <Image src={image} alt="" fill sizes="44px" className="object-cover" />
    </div>
  )
}
