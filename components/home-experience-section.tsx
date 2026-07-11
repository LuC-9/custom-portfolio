"use client"

import Image from "next/image"
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
      <ol className="relative mx-auto flex w-full max-w-full flex-col gap-20 pb-6 md:gap-24">
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
           * Staircase offset is computed in CSS from --step-idx via a
           * calc() that spans the full container width regardless of
           * viewport size. See .staircase-step in globals.css.
           */
          const stepOffsetClass = "staircase-step"

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
                style={{
                  willChange: reduce ? undefined : "transform, opacity",
                  /*
                   * --step-idx feeds the staircase offset calc in
                   * globals.css so every step lands at
                   * `(container_width - card_width) * idx / (total-1)`.
                   * That means step 0 hugs the right edge, the final
                   * step hugs the left edge, and the middle steps
                   * distribute evenly — regardless of viewport width.
                   */
                  ["--step-idx" as string]: index,
                  ["--step-max" as string]: Math.max(1, total - 1),
                }}
                className={cn(
                  // Compact "step" card: shorter than the old zigzag article
                  // so it reads as a flat rung rather than a full content block.
                  "group/step relative isolate block rounded-2xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm outline-none transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out",
                  "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-card/85 hover:shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.45)]",
                  "focus-visible:-translate-y-0.5 focus-visible:border-primary/60 focus-visible:bg-card/85 focus-visible:shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.45)]",
                  // Mobile: single-column with a subtle left accent border.
                  "border-l-4 border-l-border/50 hover:border-l-primary/60 focus-visible:border-l-primary/60",
                  // md+: right-align each card at a fixed 19.5rem (312px)
                  // width so all steps look identical; the staircase
                  // reads cleanly from the offset alone.
                  "md:ml-auto md:w-[19.5rem] md:border-l md:border-l-border/60",
                  stepOffsetClass,
                )}
              >
                {/*
                  Tanjiro climber standing on the hovered / focused step.
                  The image comes from `public/tanjiro.png` (asset added
                  by the site owner). Only visible on the active card.
                  Outer wrapper runs the "jump onto the step" appear
                  animation (opacity + translate + scale); inner wrapper
                  runs a slow idle bob so the character breathes while
                  standing. Both animations respect motion-reduce.
                */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-28 left-1/2 z-10 hidden h-28 w-20 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/step:opacity-100 group-focus-within/step:opacity-100 group-hover/step:animate-[tanjiro-hop_500ms_var(--ease-out-expo)_forwards] group-focus-within/step:animate-[tanjiro-hop_500ms_var(--ease-out-expo)_forwards] motion-reduce:animate-none md:block"
                >
                  <div className="relative h-full w-full animate-[tanjiro-idle_2.2s_ease-in-out_infinite] motion-reduce:animate-none">
                    <Image
                      src="/tanjiro.png"
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain object-bottom"
                      priority={false}
                    />
                  </div>
                </div>

                {/*
                  Tread line — visualises the horizontal edge of this
                  stair step, extending leftward toward where the next
                  (lower) step begins. Rendered only for cards that have
                  a following step, and only on md+ where the staircase
                  offset applies.
                */}
                {/*
                  Staircase connector — an L-shape hanging off this
                  card's bottom-left corner. Top border is the tread of
                  this step; left border is the riser dropping to the
                  step below. Width matches the horizontal distance to
                  the next step (`(container - card) / step_max` — the
                  same increment used by .staircase-step's margin) so it
                  visually spans the gap between consecutive steps at
                  any viewport width. Height matches the ol gap.
                */}
                {index < experiences.length - 1 ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-full top-full hidden h-20 rounded-tl-md border-l border-t border-border/60 md:block md:h-24"
                    style={{
                      width: "calc((100% - 19.5rem) / var(--step-max))",
                    }}
                  />
                ) : null}

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
