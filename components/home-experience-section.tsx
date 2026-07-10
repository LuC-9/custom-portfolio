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

  return (
    <section aria-label="Selected experience" className="relative overflow-x-hidden">
      <div className="relative">
        {/* Spine: sits at left on mobile, centered on desktop. Fades at head + tail. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-border/70 to-transparent left-4 md:left-1/2 md:-translate-x-1/2"
        />

        <ol className="flex flex-col gap-20 md:gap-32">
          {experiences.map((experience, index) => {
            const organization =
              experience.company ??
              experience.team ??
              experience.platform ??
              experience.community ??
              "Independent"
            const isActive = experience.period?.toLowerCase().includes("present")
            const startYear = extractStartYear(experience.period)
            // Newest entry on the right; alternate from there.
            const isRight = index % 2 === 0
            // Horizontal reveal is desktop-only; mobile starts at x=0 to avoid
            // offscreen transforms increasing the document scroll width.
            const enterX = reduce ? 0 : "var(--experience-enter-x)"

            return (
              <li key={experience.id} className="relative md:grid md:grid-cols-2 md:gap-16 lg:gap-24">
                {/* Milestone dot: centered on the spine, pops in after the card enters. */}
                <motion.span
                  aria-hidden
                  initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                  whileInView={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={
                    reduce
                      ? { duration: 0.2 }
                      : { delay: 0.25, duration: 0.5, ease: motionEase.expoOut }
                  }
                  className={cn(
                    "pointer-events-none absolute top-6 z-10 hidden h-3 w-3 rounded-full ring-4 ring-background md:block",
                    "left-1/2 -translate-x-1/2",
                    isActive
                      ? "bg-primary shadow-[0_0_0_5px_hsl(var(--primary)/0.16)]"
                      : "bg-muted-foreground/60",
                  )}
                />

                <motion.article
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: enterX, y: 12 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
                  transition={
                    reduce
                      ? { duration: 0.25 }
                      : { duration: 0.75, ease: motionEase.expoOut }
                  }
                  style={{ willChange: reduce ? undefined : "transform, opacity" }}
                  className={cn(
                    // Mobile: left border acts as spine, single-column body.
                    "border-l border-border/50 pl-6 md:border-0 md:pl-0",
                    isRight
                      ? "[--experience-enter-x:0px] md:[--experience-enter-x:56px]"
                      : "[--experience-enter-x:0px] md:[--experience-enter-x:-56px]",
                    // Desktop: pin card to the side that touches the spine,
                    // constrain width so both sides stay balanced.
                    "md:max-w-[460px]",
                    isRight
                      ? "md:col-start-2 md:justify-self-start"
                      : "md:col-start-1 md:justify-self-end md:text-right",
                  )}
                >
                  <div
                    className={cn(
                      "mb-5 flex flex-col gap-1.5 md:mb-6",
                      !isRight && "md:items-end",
                    )}
                  >
                    <span className="font-sans text-4xl font-black tabular-nums leading-[0.9] tracking-tight md:text-6xl">
                      {startYear || (index + 1).toString()}
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                      {experience.period}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex flex-wrap items-baseline gap-x-3 gap-y-1",
                      !isRight && "md:justify-end",
                    )}
                  >
                    <h3 className="font-sans text-2xl font-semibold tracking-tight md:text-3xl">
                      {experience.title}
                    </h3>
                    <span className="text-lg text-muted-foreground md:text-xl">
                      at {organization}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                        Active
                      </span>
                    ) : null}
                  </div>

                  {/*
                    Description keeps left-aligned text so bulleted markdown
                    still reads naturally on both sides. On left-column cards
                    we push the block itself to the right edge with ml-auto
                    so it stays anchored to the spine like the header above.
                  */}
                  <div className={cn("mt-5 max-w-[62ch] text-left", !isRight && "md:ml-auto")}>
                    {experience.contentHtml ? (
                      <div
                        className="prose prose-invert prose-sm max-w-none text-base leading-relaxed text-muted-foreground prose-p:my-2"
                        dangerouslySetInnerHTML={{ __html: experience.contentHtml }}
                      />
                    ) : (
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {experience.description ??
                          "Experience details are available in the full profile."}
                      </p>
                    )}
                  </div>

                  {experience.skills?.length ? (
                    <ul
                      className={cn(
                        "mt-6 flex flex-wrap gap-2",
                        !isRight && "md:justify-end",
                      )}
                    >
                      {experience.skills.map((skill) => (
                        <li
                          key={`${experience.id}-${skill}`}
                          className="rounded-full border border-border/60 bg-card/40 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </motion.article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
