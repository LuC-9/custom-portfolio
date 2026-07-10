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
 * Small Tanjiro-inspired climber standing on the hovered step.
 *
 * Not a portrait — a stylised mascot that borrows the show's recognisable
 * silhouette so a 40x60px SVG still reads: dark spiky hair, skin-tone
 * face, the diagonal scar on the forehead, black-and-green checker
 * haori, dark hakama, and a katana slung across the back. Uses inline
 * hex colours rather than currentColor because the character wants its
 * own palette regardless of the surrounding accent.
 */
function TanjiroClimber({ className }: { className?: string }) {
  const skin = "#f5d5a8"
  const hair = "#231613"
  const scar = "#c53030"
  const haoriDark = "#0e1a10"
  const haoriGreen = "#2d5a2d"
  const hakama = "#141013"
  const blade = "#dfe7f0"
  const handle = "#8a2b2b"
  return (
    <svg
      viewBox="0 0 40 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      {/* Katana slung across the back — handle + blade poking up behind head */}
      <line x1={26} y1={26} x2={30} y2={22} stroke={handle} strokeWidth={2.2} strokeLinecap="round" />
      <line x1={30} y1={22} x2={39} y2={4} stroke={blade} strokeWidth={1.8} strokeLinecap="round" />

      {/* Hair back — dark silhouette behind the head */}
      <ellipse cx={20} cy={11} rx={7.2} ry={7} fill={hair} />

      {/* Face */}
      <circle cx={20} cy={12} r={5.6} fill={skin} />

      {/* Hair front — layered spiky bangs */}
      <path
        d="M 14.5 12 Q 15 5.5, 20 4.5 Q 25 5.5, 25.5 12 L 24 14 Q 22.5 12.5, 21 13.5 Q 19 12.5, 17 14 L 14.5 12 Z"
        fill={hair}
      />

      {/* Iconic scar over the right eye */}
      <line x1={17} y1={8.5} x2={19.5} y2={11.5} stroke={scar} strokeWidth={0.9} strokeLinecap="round" />

      {/* Eyes */}
      <circle cx={17.8} cy={13} r={0.7} fill={hair} />
      <circle cx={22.2} cy={13} r={0.7} fill={hair} />

      {/* Haori base */}
      <path d="M 14 18 L 26 18 L 25.4 36 L 14.6 36 Z" fill={haoriDark} />
      {/* Checker squares — approximated so a small render still reads as pattern */}
      <g fill={haoriGreen}>
        <rect x={14} y={18} width={3} height={3} />
        <rect x={20} y={18} width={3} height={3} />
        <rect x={17} y={21} width={3} height={3} />
        <rect x={23} y={21} width={2.4} height={3} />
        <rect x={14} y={24} width={3} height={3} />
        <rect x={20} y={24} width={3} height={3} />
        <rect x={17} y={27} width={3} height={3} />
        <rect x={23} y={27} width={2.4} height={3} />
        <rect x={14} y={30} width={3} height={3} />
        <rect x={20} y={30} width={3} height={3} />
        <rect x={17} y={33} width={3} height={3} />
        <rect x={23} y={33} width={2.4} height={3} />
      </g>

      {/* Arms — skin, one relaxed at the side, one raised */}
      <path d="M 14.5 20 Q 11 25, 10 32" stroke={skin} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <path d="M 25.5 20 Q 28 17, 30 12" stroke={skin} strokeWidth={2.4} strokeLinecap="round" fill="none" />

      {/* Hakama / legs */}
      <line x1={17} y1={36} x2={15} y2={54} stroke={hakama} strokeWidth={3.2} strokeLinecap="round" />
      <line x1={23} y1={36} x2={25} y2={54} stroke={hakama} strokeWidth={3.2} strokeLinecap="round" />

      {/* Feet */}
      <line x1={13} y1={54.5} x2={17} y2={54.5} stroke="#3a2820" strokeWidth={2.4} strokeLinecap="round" />
      <line x1={23} y1={54.5} x2={27} y2={54.5} stroke="#3a2820" strokeWidth={2.4} strokeLinecap="round" />
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
      <ol className="relative mx-auto flex w-full max-w-4xl flex-col gap-20 pb-6 md:gap-24">
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
                  Staircase connector — a small L-shape that hangs off the
                  bottom-left corner of this card and reaches down-and-
                  left to the top-right corner of the next lower step.
                  The `border-t` visualises the tread of this step (the
                  horizontal edge you'd stand on), the `border-l` is the
                  riser dropping down to the step below. Rendered only
                  when there's a following step, and only at md+ where
                  the staircase offset applies.
                */}
                {index < experiences.length - 1 ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-full top-full hidden h-20 w-24 rounded-tl-md border-l border-t border-border/60 md:block"
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
