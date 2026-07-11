"use client"

import type { CSSProperties, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Twitch, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePersona } from "@/contexts/persona-context"
import { cn, formatDate } from "@/lib/utils"
import { SpotlightBorder } from "@/components/motion/spotlight-border"
import { MagneticHover } from "@/components/motion/magnetic-hover"
import { ProjectDialog } from "@/components/project-dialog"
import { ContentThumbnail } from "@/components/content-thumbnail"

type ProjectItem = {
  id: string
  title: string
  description?: string
  image?: string
  imageLink?: string
  tags?: string[]
  github?: string
  demo?: string
  content?: string
  contentHtml?: string
}

type BlogItem = {
  id: string
  title: string
  date: string
  excerpt?: string
  image?: string
  imageLink?: string
  tags?: string[]
  content?: string
}

const streamCards = [
  {
    id: "twitch",
    label: "Twitch",
    href: "https://www.twitch.tv/xrshluc",
    cta: "Follow on Twitch",
    pitch: "Live gameplay, ranked sessions, and community nights every week.",
    banner: "/twitch-avatar.png",
    Icon: Twitch,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@LuC-Throws",
    cta: "Subscribe on YouTube",
    pitch: "Guides, VOD highlights, and tactical breakdowns from recent streams.",
    banner: "/youtube-banner.jpg",
    Icon: Youtube,
  },
]

function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, 4).map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

/**
 * Reusable image slot that:
 * - Renders `post.image` if provided, else falls back to a ContentThumbnail
 *   built from the post's raw markdown.
 * - When `imageLink` is set, the slot is its own external anchor
 *   (`target="_blank"`); otherwise the caller wraps it in whatever
 *   primary link makes sense for the surrounding card.
 */
type MediaSlotProps = {
  title: string
  image?: string
  imageLink?: string
  content?: string
  aspect: string
  sizes: string
  /**
   * Primary link URL for the slot when no `imageLink` is set. Kept
   * separate from the surrounding card body link so blog / project
   * grid layouts can still wrap the whole card in a single anchor
   * if they want.
   */
  fallbackHref: string
}

function MediaSlot({
  title,
  image,
  imageLink,
  content,
  aspect,
  sizes,
  fallbackHref,
}: MediaSlotProps) {
  const inner = image ? (
    <Image
      src={image}
      alt={title}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  ) : (
    <ContentThumbnail title={title} content={content} />
  )

  const wrapperClass = `relative block ${aspect} overflow-hidden rounded-lg bg-secondary/30`

  if (imageLink) {
    return (
      <a
        href={imageLink}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClass}
        aria-label={`${title} — open linked image`}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link href={fallbackHref} className={wrapperClass} aria-label={title}>
      {inner}
    </Link>
  )
}

function ProjectCard({
  project,
  index,
  className,
}: {
  project: ProjectItem
  index: number
  className?: string
}) {
  return (
    <div
      className={cn("reveal-stagger-item group", className)}
      style={{ ["--reveal-index" as string]: index } as CSSProperties}
    >
      <SpotlightBorder className="h-full overflow-hidden rounded-xl">
        <ProjectDialog
          project={{
            id: project.id,
            title: project.title,
            description: project.description ?? "",
            content: project.content ?? "",
            contentHtml: project.contentHtml ?? "",
            image: project.image ?? "",
            tags: project.tags ?? [],
            github: project.github,
            demo: project.demo,
          }}
        >
          <div className="flex h-full cursor-pointer flex-col bg-card/60 p-4">
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-secondary/30">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <ContentThumbnail title={project.title} content={project.content} />
              )}
            </div>
            <h3 className="font-sans text-xl font-semibold">{project.title}</h3>
            <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
              {project.description ?? "Built for speed, reliability, and meaningful user outcomes."}
            </p>
            <div className="mt-4">
              <Tags tags={project.tags} />
            </div>
          </div>
        </ProjectDialog>
      </SpotlightBorder>
    </div>
  )
}

function BlogCard({
  blog,
  index,
  className,
}: {
  blog: BlogItem
  index: number
  className?: string
}) {
  return (
    <div
      className={cn("reveal-stagger-item group", className)}
      style={{ ["--reveal-index" as string]: index } as CSSProperties}
    >
      <SpotlightBorder className="h-full rounded-xl">
        <div className="flex h-full flex-col bg-card/60 p-4">
          <div className="mb-4">
            <MediaSlot
              title={blog.title}
              image={blog.image}
              imageLink={blog.imageLink}
              content={blog.content}
              aspect="aspect-video"
              sizes="(max-width: 768px) 100vw, 33vw"
              fallbackHref={`/blog/${blog.id}`}
            />
          </div>
          <Link href={`/blog/${blog.id}`} className="flex flex-1 flex-col">
            <p className="font-mono text-xs text-muted-foreground">{formatDate(blog.date)}</p>
            <h3 className="mt-2 font-sans text-xl font-semibold">{blog.title}</h3>
            <p className="mt-2 overflow-hidden text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {blog.excerpt ?? "A practical take on engineering, systems, and shipping better software."}
            </p>
            <div className="mt-4">
              <Tags tags={blog.tags} />
            </div>
          </Link>
        </div>
      </SpotlightBorder>
    </div>
  )
}

function SectionShell({
  eyebrow,
  title,
  ctas,
  children,
}: {
  eyebrow: string
  title: string
  ctas?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="space-y-6 md:space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        <h2 className="font-sans text-3xl font-extrabold tracking-tighter md:text-5xl">{title}</h2>
      </div>
      {children}
      {ctas ? <div className="flex flex-wrap gap-3 pt-2">{ctas}</div> : null}
    </section>
  )
}

/**
 * "Selected projects" section for the home page.
 *
 * Developer persona: 3 project cards in a 2-row × 3-col grid — byluc.in
 * anchors the top-left as a 2×2 feature; the other two projects fill
 * the right column of both rows.
 *
 * Gamer persona: swaps in the Twitch + YouTube channel cards as the
 * "community & streams" equivalent, since the gamer profile doesn't
 * feature software projects.
 */
export function HomeFeaturedProjects({ featuredProjects }: { featuredProjects: ProjectItem[] }) {
  const { isDeveloper } = usePersona()
  const projects = featuredProjects.slice(0, 3)

  if (isDeveloper) {
    const feature = projects[0]
    const rest = projects.slice(1)
    return (
      <SectionShell
        eyebrow="Selected work"
        title="Projects"
        ctas={
          <MagneticHover>
            <Button asChild className="rounded-full">
              <Link href="/projects">View all projects</Link>
            </Button>
          </MagneticHover>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(260px,1fr)]">
          {feature ? (
            <ProjectCard project={feature} index={0} className="md:col-span-2 md:row-span-2" />
          ) : null}
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell
      eyebrow="Watch & follow"
      title="Streams & community"
      ctas={
        <MagneticHover>
          <Button asChild className="rounded-full">
            <Link href="/community">Community hub</Link>
          </Button>
        </MagneticHover>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[minmax(360px,1fr)]">
        {streamCards.map(({ id, label, href, cta, pitch, banner, Icon }, index) => (
          <div
            key={id}
            className="reveal-stagger-item"
            style={{ ["--reveal-index" as string]: index } as CSSProperties}
          >
            <SpotlightBorder className="h-full overflow-hidden rounded-xl">
              <div className="flex h-full flex-col bg-card/60">
                <div className="relative aspect-video w-full overflow-hidden bg-background">
                  <Image
                    src={banner}
                    alt={`${label} channel banner`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-card/90"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="space-y-4">
                    <Icon className="h-12 w-12 text-primary" />
                    <h3 className="font-sans text-3xl font-semibold tracking-tight">{label}</h3>
                    <p className="text-sm text-muted-foreground">{pitch}</p>
                  </div>
                  <MagneticHover>
                    <Button asChild className="mt-6 rounded-full">
                      <Link href={href} target="_blank" rel="noopener noreferrer">
                        {cta}
                      </Link>
                    </Button>
                  </MagneticHover>
                </div>
              </div>
            </SpotlightBorder>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

/**
 * "Latest writing" section for the home page. Works for both personas —
 * shows three featured blog cards in a 3-column grid. Persona filtering
 * happens upstream (blogs feed comes from the persona-tagged filter).
 */
export function HomeFeaturedBlogs({ featuredBlogs }: { featuredBlogs: BlogItem[] }) {
  const blogs = featuredBlogs.slice(0, 3)

  if (blogs.length === 0) return null

  return (
    <SectionShell
      eyebrow="Recent writing"
      title="From the blog"
      ctas={
        <MagneticHover>
          <Button
            variant="secondary"
            asChild
            className="rounded-full border border-border/70 bg-card/80 text-foreground hover:bg-card"
          >
            <Link href="/blog">View all articles</Link>
          </Button>
        </MagneticHover>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(320px,1fr)]">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.id} blog={blog} index={index} />
        ))}
      </div>
    </SectionShell>
  )
}
