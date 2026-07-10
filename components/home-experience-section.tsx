"use client"

import { motion } from "motion/react"
import { usePersona } from "@/contexts/persona-context"
import { motionEase, useReducedMotionSafe } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

type ExperienceItem = {
  id: string
  title: string
  company?: string
  team?: string
  platform?: string
  community?: string
  period: string
  contentHtml?: string
  description?: string
  skills?: string[]
}

function extractStartYear(period: string): string {
  const [start] = period.split(/\s-\s|\s–\s|\s—\s/)
  const yearMatch = start?.match(/\b(19|20)\d{2}\b/)
  return yearMatch ? yearMatch[0] : ""
}

/**
 * Compact "step" figure that appears next to the card the user is hovering
 * or focusing. Points its right arm toward the card so the visual reads
 * as: "I'm standing on this step of the career staircase, pointing at what
 * I did here". Uses currentColor so it inherits the primary accent.
 */
function StairClimber({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 68"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {/* Head */}
      <circle cx={22} cy={9} r={6} fill="currentColor" stroke="none" />
      {/* Torso */}
      <line x1={22} y1={15} x2={22} y2={38} />
      {/* Left arm — hangs behind, hand at rail */}
      <line x1={22} y1={22} x2={12} y2={32} />
      {/* Right arm — extended forward, pointing at the card */}
      <line x1={22} y1={22} x2={40} y2={18} />
      {/* Pointing finger accent */}
      <circle cx={40} cy={18} r={1.6} fill="currentColor" stroke="none" />
      {/* Front leg (planted on the step) */}
      <line x1={22} y1={38} x2={30} y2={58} />
      {/* Back leg (bent, stepping up) */}
      <polyline points="22,38 15,50 22,58" />
    </svg>
  )
}

export function HomeExperienceSection({
  developerExperiences,
  gamingExperiences,
}: {
  developerExperiences: ExperienceItem[]
  gamingExperiences: ExperienceItem[]
}) {
  const { isDeveloper } = usePersona()
  const reduce = useReducedMotionSafe()
  const experiences = (isDeveloper ? developerExperiences : gamingExperiences).slice(0, 4)

  if (experiences.length === 0) return null

  const total = experiences.length

  return (
    <section aria-label="Selected experience" className="relative overflow-x-clip">
      <ol className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 md:gap-8">
        {experiences.map((experience, index) => {
          const organization =
            experience.company ??
            experience.team ??
            experience.platform ??
            experience.community ??
            "Independent"
          const isActive = experience.period?.toLowerCase().includes("present")
          const startYear = extractStartYear(experience.period)
          /**
           * Career step number. Newest role sits at DOM index 0 and reads as
           * the highest step reached (step `total`), oldest is step 1. The
           * card visually descends left-to-right as we go down the list, so
           * the number reinforces the "these are the rungs I've climbed"
           * metaphor without depending on reading direction.
           */
          const stepNumber = total - index

          /*
           * Explicit per-step margin classes. Tailwind's JIT needs the
           * literal utility strings to emit CSS for them, so we can't
           * compute margin-right from an arbitrary index. Only four steps
           * are ever rendered (`.slice(0, 4)`), so a small lookup covers it.
           */
          const stepOffsetClass =
            index === 0
              ? "md:mr-0"
              : index === 1
                ? "md:mr-12"
                : index === 2
                  ? "md:mr-24"
                  : "md:mr-36"

          return (
            <li key={experience.id} className="relative">
              <motion.article
                tabIndex={0}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3, margin: "0px 0px -8% 0px" }}
                transition={
                  reduce
                    ? { duration: 0.25 }
                    : {
                        duration: 1.1,
                        delay: index * 0.14,
                        ease: motionEase.expoOut,
                      }
                }
                style={{ willChange: reduce ? undefined : "transform, opacity" }}
                className={cn(
                  "group/step relative isolate block rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm outline-none transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out",
                  "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-card/85 hover:shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.45)]",
                  "focus-visible:-translate-y-0.5 focus-visible:border-primary/60 focus-visible:bg-card/85 focus-visible:shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.45)]",
                  // Mobile: single-column, subtle left accent border.
                  "border-l-4 border-l-border/50 hover:border-l-primary/60 focus-visible:border-l-primary/60",
                  // md+: right-align each card and step it inward by --step-index
                  // to form a descending staircase.
                  "md:ml-auto md:max-w-[520px] md:border-l md:border-l-border/60",
                  stepOffsetClass,
                )}
              >
                {/* Stick figure — appears on hover / focus, jumps in from below and points at the card. */}
                <div className="pointer-events-none absolute right-full top-4 mr-3 hidden h-16 w-11 items-end justify-center text-primary md:flex">
                  <StairClimber className="h-full w-full opacity-0 transition-opacity duration-200 group-hover/step:opacity-100 group-hover/step:animate-[stair-climber-hop_600ms_var(--ease-out-expo)_forwards] group-focus-visible/step:opacity-100 group-focus-visible/step:animate-[stair-climber-hop_600ms_var(--ease-out-expo)_forwards]" />
                </div>

                {/* Step badge in the corner: "STEP N / TOTAL" */}
                <span className="pointer-events-none absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="text-primary">▲</span>
                  Step {stepNumber} / {total}
                </span>

                {/* Header row: year + active pill + period */}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-sans text-4xl font-black tabular-nums leading-[0.9] tracking-tight md:text-5xl">
                    {startYear || stepNumber.toString()}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                    {experience.period}
                  </span>
                  {isActive ? (
                    <span className="ml-auto inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                      Active
                    </span>
                  ) : null}
                </div>

                {/* Title + organization */}
                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-sans text-xl font-semibold tracking-tight md:text-2xl">
                    {experience.title}
                  </h3>
                  <span className="text-base text-muted-foreground md:text-lg">at {organization}</span>
                </div>

                {experience.skills?.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {experience.skills.slice(0, 6).map((skill) => (
                      <li
                        key={`${experience.id}-${skill}`}
                        className="rounded-full border border-border/60 bg-card/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/*
                 * Description is hidden by default and expands on hover /
                 * focus-within using the CSS grid-rows [0fr] → [1fr] trick,
                 * which animates height smoothly without a fixed max-height.
                 * `focus-within` covers keyboard navigation and touch (a
                 * tap moves focus to the article via tabIndex=0), so the
                 * description is reachable without a mouse.
                 */}
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover/step:grid-rows-[1fr] group-focus-within/step:grid-rows-[1fr] motion-reduce:transition-none">
                  <div className="min-h-0 overflow-hidden">
                    <div className="mt-5 border-t border-border/40 pt-4 text-left">
                      {experience.contentHtml ? (
                        <div
                          className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed text-muted-foreground prose-p:my-2"
                          dangerouslySetInnerHTML={{ __html: experience.contentHtml }}
                        />
                      ) : (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {experience.description ??
                            "Experience details are available in the full profile."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
