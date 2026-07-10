"use client"

import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { Github, Linkedin, Mail, Twitch, Youtube } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { track } from "@vercel/analytics"
import { Button } from "@/components/ui/button"
import { PersonaToggle } from "@/components/persona-toggle"
import { DiscordStatus } from "@/components/discord-status"
import { XIcon } from "@/components/icons/x-icon"
import { LeetCodeIcon } from "@/components/icons/leetcode-icon"
import { usePersona } from "@/contexts/persona-context"
import { emitGameEvent } from "@/lib/game/event-bus"
import { MagneticHover } from "@/components/motion/magnetic-hover"
import { SpotlightBorder } from "@/components/motion/spotlight-border"
import { RevealWord } from "@/components/motion/reveal-word"
import { PersonaBackground } from "@/components/persona-background"
import { HeroIntro } from "@/components/intro/hero-intro"
import { motionEase, useReducedMotionSafe } from "@/hooks/use-reduced-motion"
import { useIntroGate } from "@/hooks/use-intro-gate"

type PersonaContent = {
  eyebrow: string
  name: string
  subtext: string
  primary: { text: string; href: string; taskId: string }
  secondary: { text: string; href: string; taskId: string }
}

const content: Record<"developer" | "gamer", PersonaContent> = {
  developer: {
    eyebrow: "THE PORTFOLIO",
    name: "Aarsh",
    subtext: "Software Engineer at Nagarro. React, TypeScript, Next.js, Kubernetes. Building fast systems for people who ship.",
    primary: { text: "Contact", href: "/contact", taskId: "hero:contact" },
    secondary: { text: "View my work", href: "/projects", taskId: "hero:projects" },
  },
  gamer: {
    eyebrow: "THE ARENA",
    name: "LuC",
    subtext: "Competitive streamer and community builder. FPS, strategy games, and Discord communities that actually stick.",
    primary: { text: "Watch Streams", href: "/community?tab=streams", taskId: "hero:streams" },
    secondary: { text: "Join Community", href: "/community", taskId: "hero:community" },
  },
}

export function HomeContent() {
  const { isDeveloper, persona } = usePersona()
  const reduceMotion = useReducedMotionSafe()
  const { shouldPlay: introShouldPlay, markPlayed: markIntroPlayed } = useIntroGate()
  const active = isDeveloper ? content.developer : content.gamer
  const personaSectionMotionProps = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
    animate: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: -8, transition: { duration: 0.18, ease: motionEase.expoOut } },
    transition: reduceMotion ? { duration: 0.2 } : { duration: 0.45, ease: motionEase.expoOut },
  }

  const onHeroCta = (taskId: string, href: string) => {
    emitGameEvent({ type: "link_click", taskId, metadata: { href } })
    track("hero_cta_click", {
      taskId,
      href,
      persona: isDeveloper ? "developer" : "gamer",
    })
  }

  const trackCuratedLink = (taskId: string, href: string) => {
    emitGameEvent({
      type: "link_click",
      taskId,
      metadata: { href },
    })
  }

  return (
    <section id="top" className="relative isolate flex min-h-[100dvh] w-full items-center overflow-hidden pt-20 pb-12 lg:pt-24 lg:pb-16">
      {introShouldPlay ? <HeroIntro persona={persona} onDone={markIntroPlayed} /> : null}
      <AnimatePresence mode="wait" initial={false}>
        <PersonaBackground key={persona} persona={persona} />
      </AnimatePresence>
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-4 lg:grid-cols-12 lg:gap-12 lg:px-6">
        <div className="order-1 lg:order-2 lg:col-span-5">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: motionEase.expoOut }}
            className="mx-auto w-full max-w-sm lg:max-w-none"
          >
            <SpotlightBorder className="overflow-hidden rounded-xl" size={240}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={persona}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : { clipPath: "inset(0 100% 0 0)", scale: 1.04, filter: "blur(6px)", opacity: 1 }
                    }
                    animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)", scale: 1, filter: "blur(0px)" }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : {
                            clipPath: "inset(0 0 0 0)",
                            scale: 0.96,
                            filter: "blur(6px)",
                            opacity: 0,
                            transition: { duration: 0.35, ease: motionEase.expoOut },
                          }
                    }
                    transition={reduceMotion ? { duration: 0.2 } : { duration: 0.7, ease: motionEase.expoOut, delay: 0.05 }}
                    className="relative h-full w-full"
                    style={
                      reduceMotion
                        ? undefined
                        : { transformOrigin: "center", willChange: "transform, clip-path, filter" }
                    }
                  >
                    <Image
                      src={isDeveloper ? "/profile.jpg" : "/gamer-profile.gif?v=1"}
                      alt={isDeveloper ? "Aarsh profile photo" : "LuC gamer profile"}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </SpotlightBorder>
          </motion.div>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={persona}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeOut" } }
              }
              transition={reduceMotion ? { duration: 0.2 } : { duration: 0.45, ease: motionEase.expoOut }}
              className="space-y-8"
            >
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: motionEase.expoOut }}
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary"
              >
                {active.eyebrow}
              </motion.p>

              <h1
                aria-label={`Hi, I'm ${active.name}.`}
                className="font-sans text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl"
              >
                <RevealWord text="Hi, I'm" />
                <span className="text-primary">
                  {" "}
                  <RevealWord text={active.name} delay={0.18} />
                </span>
                .
              </h1>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.12, ease: motionEase.expoOut }}
                className="max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {active.subtext}
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.18, ease: motionEase.expoOut }}
                className="flex flex-wrap items-center gap-3"
              >
                <MagneticHover>
                  <Button asChild className="rounded-full">
                    <Link href={active.primary.href} onClick={() => onHeroCta(active.primary.taskId, active.primary.href)}>
                      {active.primary.text}
                    </Link>
                  </Button>
                </MagneticHover>
                <MagneticHover>
                  <Button variant="outline" asChild className="rounded-full">
                    <Link
                      href={active.secondary.href}
                      onClick={() => onHeroCta(active.secondary.taskId, active.secondary.href)}
                    >
                      {active.secondary.text}
                    </Link>
                  </Button>
                </MagneticHover>
              </motion.div>

              <div className="space-y-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`actions-${persona}`}
                    {...personaSectionMotionProps}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <PersonaToggle />
                    {isDeveloper ? (
                      <Button
                        variant="outline"
                        className="rounded-full"
                        asChild
                      >
                        <Link
                          href="/resume.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            emitGameEvent({
                              type: "resume_download",
                              taskId: "resume:download",
                              metadata: { file: "/resume.pdf" },
                            })
                            track("resume_download", { persona: "developer", resumeVersion: "latest" })
                          }}
                        >
                          Resume
                        </Link>
                      </Button>
                    ) : null}
                  </motion.div>
                </AnimatePresence>

                <DiscordStatus />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={`social-${persona}`} {...personaSectionMotionProps} className="flex flex-wrap items-center gap-3">
                    {isDeveloper ? (
                      <>
                        <Link
                          href="https://github.com/LuC-9"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          onClick={() => trackCuratedLink("link:github", "https://github.com/LuC-9")}
                          className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Github className="h-5 w-5" />
                        </Link>
                        <Link
                          href="https://www.linkedin.com/in/aarsh-mishra09/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          onClick={() => trackCuratedLink("link:linkedin", "https://www.linkedin.com/in/aarsh-mishra09/")}
                          className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Linkedin className="h-5 w-5" />
                        </Link>
                        <Link
                          href="https://twitter.com/xrshLuC"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="X"
                          onClick={() => trackCuratedLink("link:twitter", "https://twitter.com/xrshLuC")}
                          className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                        >
                          <XIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          href="https://leetcode.com/u/LuC9/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LeetCode"
                          onClick={() => trackCuratedLink("link:leetcode", "https://leetcode.com/u/LuC9/")}
                          className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                        >
                          <LeetCodeIcon className="h-5 w-5" />
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="https://www.twitch.tv/xrshluc"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitch"
                          onClick={() => trackCuratedLink("link:twitch", "https://www.twitch.tv/xrshluc")}
                          className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Twitch className="h-5 w-5" />
                        </Link>
                        <Link
                          href="https://www.youtube.com/@LuC-Throws"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="YouTube"
                          onClick={() => trackCuratedLink("link:youtube", "https://www.youtube.com/@LuC-Throws")}
                          className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Youtube className="h-5 w-5" />
                        </Link>
                        <Link
                          href="https://twitter.com/xrshLuC"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="X"
                          onClick={() => trackCuratedLink("link:twitter", "https://twitter.com/xrshLuC")}
                          className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                        >
                          <XIcon className="h-5 w-5" />
                        </Link>
                      </>
                    )}
                    <Link
                      href="https://discord.gg/Sd8Uq73FeK"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Discord server"
                      onClick={() => trackCuratedLink("link:discord", "https://discord.gg/Sd8Uq73FeK")}
                      className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                    >
                      <FaDiscord className="h-5 w-5" />
                    </Link>
                    <Link
                      href="mailto:aarshmail@gmail.com"
                      aria-label="Email"
                      onClick={() => trackCuratedLink("link:email", "mailto:aarshmail@gmail.com")}
                      className="rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Mail className="h-5 w-5" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
