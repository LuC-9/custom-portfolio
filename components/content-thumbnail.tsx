import { cn } from "@/lib/utils"

type ContentThumbnailProps = {
  title: string
  content?: string
  className?: string
  /** How many characters of the plain-text preview to show. */
  maxChars?: number
}

/**
 * Turn a raw markdown blob into a compact plain-text preview:
 * strips code fences, HTML, image / link markdown, and heading /
 * emphasis / code punctuation so the preview reads as prose. Cheap
 * regex-only pass because the previews are short (~500 chars).
 */
function stripToPreview(content: string, max: number): string {
  return content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`>|]/g, "")
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n\n")
    .trim()
    .slice(0, max)
}

/**
 * Fallback thumbnail rendered whenever a project or blog post has no
 * `image` field set. Shows the title as a small monospace watermark and
 * the first ~500 chars of the actual body content styled like a
 * miniature "wall of text" cover, fading to the card body colour at the
 * bottom so it blends into whatever card wraps it. Uses `aria-hidden`
 * on the decorative layers so screen readers only pick up the real
 * heading later in the card.
 */
export function ContentThumbnail({
  title,
  content,
  className,
  maxChars = 500,
}: ContentThumbnailProps) {
  const preview = content ? stripToPreview(content, maxChars) : ""

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/40 to-card p-4",
        className,
      )}
      aria-hidden
    >
      {/* Subtle dotted grid so the empty area doesn't read as blank. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border) / 0.55) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <p className="relative font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
        {title}
      </p>

      {preview ? (
        <div className="relative mt-2 flex-1 overflow-hidden">
          <p className="whitespace-pre-line font-mono text-[11px] leading-relaxed text-foreground/70">
            {preview}
          </p>
          {/* Fade to the card colour so the truncated text doesn't cut off harshly. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-card" />
        </div>
      ) : null}
    </div>
  )
}
