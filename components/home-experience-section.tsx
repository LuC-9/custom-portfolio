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
 * Chibi-style anime climber standing on the hovered step. Original SVG
 * inspired by the "young swordsman in a checkered haori" archetype —
 * oversized head, cartoon eyes with a shine, faint blush, a small
 * diagonal scar accent, a checker-pattern top, dark hakama, and a
 * katana slung across the back. All shapes and colors are original;
 * this is not a portrait of any specific character.
 */
function TanjiroClimber({ className }: { className?: string }) {
  const skin = "#f5d5a8"
  const hair = "#241512"
  const scar = "#c53030"
  const haoriDark = "#0e1a10"
  const haoriAccent = "#3a7a3a"
  const obi = "#e2e6dd"
  const hakama = "#141013"
  const blade = "#e5ebf1"
  const handle = "#8a2b2b"
  const eye = "#3a1810"
  const cheek = "#f0a5a5"
  const sandal = "#c9a26a"
  return (
    <svg
      viewBox="0 0 44 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      {/* Katana strapped across the back — visible past the right shoulder */}
      <line x1={30} y1={26} x2={35} y2={20} stroke={handle} strokeWidth={2.4} strokeLinecap="round" />
      <line x1={35} y1={20} x2={43} y2={4} stroke={blade} strokeWidth={1.9} strokeLinecap="round" />

      {/* Hair silhouette behind the head (chibi proportion — head takes ~40% of the figure) */}
      <path
        d="M 10 15 Q 9 4 22 3.5 Q 35 4 34 15 L 34 22 Q 28 24 22 24 Q 16 24 10 22 Z"
        fill={hair}
      />

      {/* Face circle */}
      <circle cx={22} cy={16} r={9} fill={skin} />

      {/* Hair front — layered bangs falling over the forehead */}
      <path
        d="M 11 13 Q 12 4 22 3.5 Q 32 4 33 13 Q 30 15 27.5 13 L 26.5 15.5 Q 24.5 13.5 22.5 15 Q 20.5 13.5 18.5 15.5 L 17.5 13 Q 14 15 11 13 Z"
        fill={hair}
      />
      {/* Hair strand accents at the sides */}
      <path d="M 11 13 L 9 19 Q 10 21 12 19 Z" fill={hair} />
      <path d="M 33 13 L 35 19 Q 34 21 32 19 Z" fill={hair} />

      {/* Small diagonal scar accent over the right brow */}
      <path d="M 17 10 L 19.5 13.5" stroke={scar} strokeWidth={1.2} strokeLinecap="round" fill="none" />

      {/* Blush marks (chibi trope) */}
      <circle cx={15.5} cy={19.5} r={1.6} fill={cheek} opacity={0.55} />
      <circle cx={28.5} cy={19.5} r={1.6} fill={cheek} opacity={0.55} />

      {/* Oversized cartoon eyes */}
      <ellipse cx={17.5} cy={18} rx={1.3} ry={2} fill={eye} />
      <ellipse cx={26.5} cy={18} rx={1.3} ry={2} fill={eye} />
      {/* Eye shine */}
      <circle cx={17.8} cy={17.3} r={0.55} fill="#ffffff" />
      <circle cx={26.8} cy={17.3} r={0.55} fill="#ffffff" />

      {/* Haori base — dark green-black */}
      <path d="M 14 25 L 30 25 L 29 41 L 15 41 Z" fill={haoriDark} />
      {/* Alternating checker squares approximated in a 2-row grid */}
      <g fill={haoriAccent}>
        <rect x={14} y={25} width={4} height={4} />
        <rect x={22} y={25} width={4} height={4} />
        <rect x={18} y={29} width={4} height={4} />
        <rect x={26} y={29} width={3} height={4} />
        <rect x={14} y={33} width={4} height={4} />
        <rect x={22} y={33} width={4} height={4} />
        <rect x={18} y={37} width={4} height={4} />
        <rect x={26} y={37} width={3} height={4} />
      </g>
      {/* White obi belt across the waist */}
      <rect x={14} y={35} width={16} height={1.5} fill={obi} />

      {/* Arms — resting at the sides with rounded hands */}
      <path d="M 14 27 Q 10 32 10 37" stroke={skin} strokeWidth={2.8} strokeLinecap="round" fill="none" />
      <path d="M 30 27 Q 34 32 34 37" stroke={skin} strokeWidth={2.8} strokeLinecap="round" fill="none" />
      <circle cx={10} cy={37} r={1.6} fill={skin} />
      <circle cx={34} cy={37} r={1.6} fill={skin} />

      {/* Legs — dark hakama */}
      <path d="M 17 41 L 15 54" stroke={hakama} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M 27 41 L 29 54" stroke={hakama} strokeWidth={3.6} strokeLinecap="round" />

      {/* Simple sandals */}
      <ellipse cx={14} cy={55.5} rx={2.6} ry={1.1} fill={sandal} />
      <ellipse cx={30} cy={55.5} rx={2.6} ry={1.1} fill={sandal} />
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
                  Tanjiro-inspired climber. Only visible on the hovered /
                  focused step. Outer wrapper handles the "jump onto the
                  step" appear animation (opacity + translate + scale);
                  inner wrapper runs a slow idle bob so the character
                  breathes while standing. Both animations pause under
                  reduced-motion so the character just fades in.
                */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 left-1/2 z-10 hidden h-20 w-14 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/step:opacity-100 group-focus-within/step:opacity-100 group-hover/step:animate-[tanjiro-hop_500ms_var(--ease-out-expo)_forwards] group-focus-within/step:animate-[tanjiro-hop_500ms_var(--ease-out-expo)_forwards] motion-reduce:animate-none md:block"
                >
                  <div className="h-full w-full animate-[tanjiro-idle_2.2s_ease-in-out_infinite] motion-reduce:animate-none">
                    <TanjiroClimber className="h-full w-full" />
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
