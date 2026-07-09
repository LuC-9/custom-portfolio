"use client"

import Link from "next/link"
import { usePersona } from "@/contexts/persona-context"
import { StickyStack } from "@/components/motion/sticky-stack"

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

export function HomeExperienceSection({
  developerExperiences,
  gamingExperiences,
}: {
  developerExperiences: ExperienceItem[]
  gamingExperiences: ExperienceItem[]
}) {
  const { isDeveloper } = usePersona()
  const experiences = (isDeveloper ? developerExperiences : gamingExperiences).slice(0, 2)

  return (
    <section>
      <StickyStack className="relative">
        {experiences.map((experience) => {
          const organization =
            experience.company ?? experience.team ?? experience.platform ?? experience.community ?? "Gaming Organization"
          const isActive = experience.period?.toLowerCase().includes("present")

          return (
            <article key={experience.id} className="min-h-[100dvh] flex items-center">
              <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start gap-8 px-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                  <p className="font-mono text-xs text-muted-foreground">
                    {experience.period} · {experience.title}
                  </p>
                  {isActive ? (
                    <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      Active
                    </span>
                  ) : null}
                </div>

                <div className="space-y-6 lg:col-span-8">
                  <h2 className="font-sans text-4xl font-bold tracking-tight md:text-6xl">{experience.title}</h2>
                  <p className="text-2xl text-muted-foreground">{organization}</p>

                  {experience.contentHtml ? (
                    <div
                      className="prose prose-invert max-w-none text-base leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: experience.contentHtml }}
                    />
                  ) : (
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {experience.description ?? "Experience details are available in the full profile."}
                    </p>
                  )}

                  {experience.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {experience.skills.map((skill) => (
                        <span
                          key={`${experience.id}-${skill}`}
                          className="rounded-full border border-border/70 px-3 py-1 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </StickyStack>

      {(isDeveloper ? developerExperiences.length : gamingExperiences.length) > 2 ? (
        <div className="mt-8 px-6">
          <Link href="/contact" className="font-mono text-xs uppercase tracking-[0.2em] text-primary hover:text-primary/80">
            View all experience
          </Link>
        </div>
      ) : null}
    </section>
  )
}
