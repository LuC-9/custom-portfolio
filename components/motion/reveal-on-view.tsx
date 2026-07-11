import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Fade-and-rise reveal for a single element as it scrolls into view.
 *
 * Uses CSS scroll-driven animations (animation-timeline: view()) so the
 * animation is driven by the browser off the main thread — no JS scroll
 * handlers, no IntersectionObserver, no re-renders. See
 * https://www.builder.io/blog/scroll-driven-animations for the underlying
 * technique.
 *
 * Browsers without support (Firefox stable, Safari) fall back to the
 * element's static state via the `@supports` guard in `globals.css`. The
 * reduced-motion preference is also honored there.
 */
type SupportedTag = "div" | "section" | "article" | "aside"

type RevealOnViewProps = {
  children: ReactNode
  as?: SupportedTag
  className?: string
  /** Distance in px the element rises from as it enters view. Defaults to 24. */
  distance?: number
  style?: CSSProperties
}

export function RevealOnView({
  children,
  as = "div",
  className,
  distance,
  style,
}: RevealOnViewProps) {
  const composed = cn("reveal-on-view", className)
  const composedStyle: CSSProperties | undefined =
    distance !== undefined
      ? { ...style, ["--reveal-distance" as string]: `${distance}px` }
      : style

  switch (as) {
    case "section":
      return (
        <section className={composed} style={composedStyle}>
          {children}
        </section>
      )
    case "article":
      return (
        <article className={composed} style={composedStyle}>
          {children}
        </article>
      )
    case "aside":
      return (
        <aside className={composed} style={composedStyle}>
          {children}
        </aside>
      )
    case "div":
    default:
      return (
        <div className={composed} style={composedStyle}>
          {children}
        </div>
      )
  }
}
