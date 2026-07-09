"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { Menu, X } from "lucide-react"
import { usePersona } from "@/contexts/persona-context"
import { useNavScrolled } from "@/components/motion/use-nav-scrolled"
import { RevealStagger } from "@/components/motion/reveal-stagger"
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const scrolled = useNavScrolled()
  const reduceMotion = useReducedMotionSafe()
  const pathname = usePathname()
  const { isDeveloper, isGamer } = usePersona()

  const links = useMemo(
    () =>
      isDeveloper
        ? [
            { href: "/", label: "Home" },
            { href: "/projects", label: "Projects" },
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
          ]
        : [
            { href: "/", label: "Home" },
            { href: "/community", label: "Community" },
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
          ],
    [isDeveloper],
  )

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-30 w-[100dvw] max-w-full border-b transition-all duration-[var(--dur-base)] ${
          scrolled ? "h-16 bg-background/60 border-border/60 backdrop-blur-md" : "h-[72px] bg-transparent border-transparent"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-4 md:px-6">
          <Link
            href="/"
            className="font-sans text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            {isGamer ? "LuC" : "Aarsh Mishra"}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap text-sm font-medium tracking-tight transition-colors ${
                  pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-2 left-0 block h-0.5 w-full rounded-full bg-primary"
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60 text-foreground transition-colors hover:border-primary/40 hover:text-primary md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="fixed left-0 top-0 z-20 h-[100dvh] w-[100dvw] bg-background/95 px-6 pb-10 pt-28 backdrop-blur-md md:hidden"
          >
            <div className="mx-auto w-full max-w-[1400px]">
              <RevealStagger
                as="ul"
                className="space-y-4"
                delay={0}
                staggerMs={80}
                amount={0.2}
              >
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-xl border px-5 py-4 font-sans text-2xl font-semibold tracking-tight transition-colors ${
                        pathname === link.href
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/60 bg-card/40 text-foreground/90"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </RevealStagger>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
