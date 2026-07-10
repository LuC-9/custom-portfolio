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
 * Small stick figure standing on top of a career step.
 *
 * Pose matches the user's sketch: head circle, torso, arms raised in a
 * "V" (reaching for the next step / celebrating that this one was
 * reached), legs planted on the step below. Rendered with a transparent
 * head interior so the primary accent lines show cleanly against the
 * dark background.
 */
function StepClimber({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 44"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {/* Head — outline only, matches the sketch */}
      <circle cx={16} cy={8} r={5} />
      {/* Torso */}
      <line x1={16} y1={13} x2={16} y2={27} />
      {/* Arms raised in V, reaching upward */}
      <line x1={16} y1={17} x2={7} y2={9} />
      <line x1={16} y1={17} x2={25} y2={9} />
      {/* Legs */}
      <line x1={16} y1={27} x2={9} y2={41} />
      <line x1={16} y1={27} x2={23} y2={41} />
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
      {/* Bottom padding keeps the last (leftmost) step from bumping into the
          next section since the leftward offset makes the ol taller than a
          flush-right column would be. */}
      <ol className="relative mx-auto flex w-full max-w-4xl flex-col gap-14 pb-6 md:gap-16">
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
           * Newest role sits at DOM index 0 and reads as the highest step
           * reached (step `total`). The card visually is placed at the
           * top-right (no offset); older roles step down and left in the
           * list, so reading the layout from bottom-left → top-right
           * traces the career climb like the user's staircase sketch.
           */
          const stepNumber = total - index

          /*
           * Explicit per-step margin classes. Tailwind's JIT needs the
           * literal utility strings to emit CSS for them. Only four
           * steps are ever rendered (`.slice(0, 4)`).
           */
          const stepOffsetClass =
            index === 0
              ? "md:mr-0"
              : index === 1
                ? "md:mr-24"
                : index === 2
                  ? "md:mr-48"
                  : "md:mr-72"

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
                  // Compact "step" card: shorter than the old zigzag article
                  // so it reads as a flat rung rather than a full content block.
                  "group/step relative isolate block rounded-2xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm outline-none transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out",
                  "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-card/85 hover:shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.45)]",
                  "focus-visible:-translate-y-0.5 focus-visible:border-primary/60 focus-visible:bg-card/85 focus-visible:shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.45)]",
                  // Mobile: single-column with a subtle left accent border.
                  "border-l-4 border-l-border/50 hover:border-l-primary/60 focus-visible:border-l-primary/60",
                  // md+: right-align each card at a fixed 19.5rem (312px)
                  // width so all steps look identical and the staircase
                  // reads cleanly from the offset alone.
                  "md:ml-auto md:w-[19.5rem] md:border-l md:border-l-border/60",
                  stepOffsetClass,
                )}
              >
                {/*
                  Stick figure standing on top of the step, centered.
                  Always visible on md+ (the whole point of the sketch
                  was a climber on each rung). Because it lives inside
                  the article, it inherits the card's hover translate so
                  the figure appears to bounce with the step it stands on.
                */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-11 left-1/2 hidden h-10 w-8 -translate-x-1/2 text-primary md:block"
                >
                  <StepClimber className="h-full w-full" />
                </div>

                {/* Compact header row: everything on a single line so the
                    collapsed card is a proper step shape. */}
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-sans text-2xl font-black tabular-nums leading-none tracking-tight">
                    {startYear || stepNumber.toString()}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {experience.period}
                  </span>
                  {isActive ? (
                    <span className="ml-auto inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-primary">
                      Active
                    </span>
                  ) : null}
                </div>

                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h3 className="font-sans text-base font-semibold tracking-tight md:text-lg">
                    {experience.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">at {organization}</span>
                </div>

                {/* "Step N / total" badge lives at the bottom-right corner
                    of the card so it reads like a rung label. */}
                <span className="pointer-events-none absolute -bottom-2 right-4 inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="text-primary">▲</span>
                  Step {stepNumber} / {total}
                </span>

                {/*
                 * Description is hidden by default and expands on
                 * hover / focus-within via the CSS grid-rows [0fr] →
                 * [1fr] trick — no fixed max-height, no JS state.
                 * `tabIndex={0}` on the article lets keyboard / touch
                 * reach the description via focus-within.
                 */}
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover/step:grid-rows-[1fr] group-focus-within/step:grid-rows-[1fr] motion-reduce:transition-none">
                  <div className="min-h-0 overflow-hidden">
                    <div className="mt-3 border-t border-border/40 pt-3 text-left">
                      {experience.skills?.length ? (
                        <ul className="mb-3 flex flex-wrap gap-1.5">
                          {experience.skills.slice(0, 6).map((skill) => (
                            <li
                              key={`${experience.id}-${skill}`}
                              className="rounded-full border border-border/60 bg-card/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground"
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {experience.contentHtml ? (
                        <div
                          className="prose prose-invert prose-sm max-w-none text-xs leading-relaxed text-muted-foreground prose-p:my-1.5"
                          dangerouslySetInnerHTML={{ __html: experience.contentHtml }}
                        />
                      ) : (
                        <p className="text-xs leading-relaxed text-muted-foreground">
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
