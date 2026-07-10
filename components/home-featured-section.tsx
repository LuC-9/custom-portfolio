"use client"

import type { CSSProperties } from "react"
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
  /**
   * Optional URL for the image itself. When set, the image slot becomes
   * an external anchor (opens in a new tab) instead of inheriting the
   * card's primary link — useful for pointing at a live demo, a source
   * image on GitHub, etc.
   */
  imageLink?: string
  tags?: string[]
  github?: string
  demo?: string
  /**
   * Present when the item was loaded via getAllContentData("projects").
   * Required by ProjectDialog, which renders the markdown-derived
   * long-form body inside the popup. `content` is the raw markdown
   * string; `contentHtml` is the pre-rendered HTML. Also used by
   * ContentThumbnail as the source for the fallback thumbnail when
   * `image` is absent.
   */
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

type FeaturedCell =
  | { kind: "project"; item: ProjectItem }
  | { kind: "blog"; item: BlogItem }

const streamCards = [
  {
    id: "twitch",
    label: "Twitch",
    href: "https://www.twitch.tv/xrshluc",
    cta: "Follow on Twitch",
    pitch: "Live gameplay, ranked sessions, and community nights every week.",
    // Twitch account (xrshluc) has no custom profile banner uploaded, so
    // use the profile hero (a stadium-floodlight photo) at banner aspect.
    // Swap for a real channel banner once one is uploaded.
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

/**
 * Bento span map for the developer featured grid.
 *
 * With 6 cells and a 3-column grid, this arrangement adds up to exactly
 * 9 units (a 2×2 feature card + five 1×1 cards) so the whole bento snaps
 * into a clean 3×3 rectangle with no empty tiles. Together with
 * `grid-flow-dense` the browser lays it out as:
 *
 *   ┌──────────────┬─────────┐
 *   │              │ cell 1  │
 *   │   cell 0     ├─────────┤
 *   │  (feature)   │ cell 2  │
 *   ├───────┬──────┼─────────┤
 *   │cell 3 │cell 4│ cell 5  │
 *   └───────┴──────┴─────────┘
 *
 * Cell 0 is the byluc.in project card (self-referential portfolio),
 * cells 1/2 are featured blog posts, cells 3/4/5 are the second/third
 * projects and remaining blog posts.
 */
function getDeveloperSpanClass(index: number, total: number) {
  if (total < 4) return ""
  const spanMap = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
  ]
  return spanMap[index] ?? ""
}

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

export function HomeFeaturedSection({
  featuredProjects,
  featuredBlogs,
}: {
  featuredProjects: ProjectItem[]
  featuredBlogs: BlogItem[]
}) {
  const { isDeveloper } = usePersona()

  const projects = featuredProjects.slice(0, 3)
  const blogs = featuredBlogs.slice(0, isDeveloper ? 3 : 3)

  /*
   * Grouped, not interleaved. Projects come first so the byluc.in 2×2
   * feature card in cell 0 (see spanMap) anchors the top-left, the two
   * other projects fill the right column of the first two rows, and all
   * three blog cards sit together across the bottom row.
   *
   *   +-------+-------+
   *   |               | project 2
   *   |   byluc.in    +---------+
   *   |    (2x2)      | project 3
   *   +---+---+---+---+---------+
   *   | blog 1 | blog 2 | blog 3
   */
  const developerCells: FeaturedCell[] = [
    projects[0] ? { kind: "project", item: projects[0] } : null,
    projects[1] ? { kind: "project", item: projects[1] } : null,
    projects[2] ? { kind: "project", item: projects[2] } : null,
    blogs[0] ? { kind: "blog", item: blogs[0] } : null,
    blogs[1] ? { kind: "blog", item: blogs[1] } : null,
    blogs[2] ? { kind: "blog", item: blogs[2] } : null,
  ].filter(Boolean) as FeaturedCell[]

  const gamerBlogs = blogs.slice(0, 3)

  return (
    <section>
      {isDeveloper ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(280px,1fr)] md:grid-flow-dense">
            {developerCells.map((cell, index) => (
              <div
                key={`${cell.kind}-${cell.item.id}`}
                className={cn("reveal-stagger-item", getDeveloperSpanClass(index, developerCells.length))}
                style={{ ["--reveal-index" as string]: index } as CSSProperties}
              >
                <SpotlightBorder className="h-full overflow-hidden rounded-xl">
                  {cell.kind === "project" ? (
                    <ProjectDialog
                      project={{
                        id: cell.item.id,
                        title: cell.item.title,
                        description: cell.item.description ?? "",
                        content: cell.item.content ?? "",
                        contentHtml: cell.item.contentHtml ?? "",
                        image: cell.item.image ?? "",
                        tags: cell.item.tags ?? [],
                        github: cell.item.github,
                        demo: cell.item.demo,
                      }}
                    >
                      <div className="flex h-full cursor-pointer flex-col bg-card/60 p-4">
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                          {cell.item.image ? (
                            <Image
                              src={cell.item.image}
                              alt={cell.item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <ContentThumbnail
                              title={cell.item.title}
                              content={cell.item.content}
                            />
                          )}
                        </div>
                        <h3 className="font-sans text-xl font-semibold">{cell.item.title}</h3>
                        <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                          {cell.item.description ?? "Built for speed, reliability, and meaningful user outcomes."}
                        </p>
                        <div className="mt-4">
                          <Tags tags={cell.item.tags} />
                        </div>
                      </div>
                    </ProjectDialog>
                  ) : (
                    <div className="flex h-full flex-col bg-card/60 p-4">
                      {/*
                        If an imageLink is provided on the blog frontmatter,
                        the image slot becomes an independent external
                        anchor (opens in a new tab). Otherwise it inherits
                        the blog detail link like the rest of the card.
                        Two separate anchors keeps click targets clear
                        without nesting <a> elements.
                      */}
                      {cell.item.imageLink ? (
                        <a
                          href={cell.item.imageLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative mb-4 block aspect-video overflow-hidden rounded-lg"
                          aria-label={`${cell.item.title} — open linked image`}
                        >
                          {cell.item.image ? (
                            <Image
                              src={cell.item.image}
                              alt={cell.item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <ContentThumbnail
                              title={cell.item.title}
                              content={cell.item.content}
                            />
                          )}
                        </a>
                      ) : (
                        <Link
                          href={`/blog/${cell.item.id}`}
                          className="relative mb-4 block aspect-video overflow-hidden rounded-lg"
                          aria-label={cell.item.title}
                        >
                          {cell.item.image ? (
                            <Image
                              src={cell.item.image}
                              alt={cell.item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <ContentThumbnail
                              title={cell.item.title}
                              content={cell.item.content}
                            />
                          )}
                        </Link>
                      )}
                      <Link href={`/blog/${cell.item.id}`} className="flex flex-1 flex-col">
                        <p className="font-mono text-xs text-muted-foreground">{formatDate(cell.item.date)}</p>
                        <h3 className="mt-2 font-sans text-xl font-semibold">{cell.item.title}</h3>
                        <p className="mt-2 overflow-hidden text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                          {cell.item.excerpt ?? "A practical take on engineering, systems, and shipping better software."}
                        </p>
                        <div className="mt-4">
                          <Tags tags={cell.item.tags} />
                        </div>
                      </Link>
                    </div>
                  )}
                </SpotlightBorder>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticHover>
              <Button asChild className="rounded-full">
                <Link href="/projects">View all projects</Link>
              </Button>
            </MagneticHover>
            <MagneticHover>
              <Button
                variant="secondary"
                asChild
                className="rounded-full border border-border/70 bg-card/80 text-foreground hover:bg-card"
              >
                <Link href="/blog">View all articles</Link>
              </Button>
            </MagneticHover>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[minmax(240px,1fr)] md:grid-flow-dense">
            {streamCards.map(({ id, label, href, cta, pitch, banner, Icon }, index) => (
              <div
                key={id}
                className="reveal-stagger-item md:row-span-2"
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
                      {/* Fade the banner into the card so the icon/heading
                          below reads clearly regardless of banner content. */}
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

            {gamerBlogs.map((blog, index) => (
              <div
                key={blog.id}
                className="reveal-stagger-item"
                style={{ ["--reveal-index" as string]: streamCards.length + index } as CSSProperties}
              >
                <SpotlightBorder className="h-full rounded-xl">
                  <div className="flex h-full flex-col bg-card/60 p-4">
                    {blog.imageLink ? (
                      <a
                        href={blog.imageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative mb-4 block aspect-video overflow-hidden rounded-lg"
                        aria-label={`${blog.title} — open linked image`}
                      >
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        ) : (
                          <ContentThumbnail title={blog.title} content={blog.content} />
                        )}
                      </a>
                    ) : (
                      <Link
                        href={`/blog/${blog.id}`}
                        className="relative mb-4 block aspect-video overflow-hidden rounded-lg"
                        aria-label={blog.title}
                      >
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        ) : (
                          <ContentThumbnail title={blog.title} content={blog.content} />
                        )}
                      </Link>
                    )}
                    <Link href={`/blog/${blog.id}`} className="flex flex-1 flex-col">
                      <p className="font-mono text-xs text-muted-foreground">{formatDate(blog.date)}</p>
                      <h3 className="mt-2 font-sans text-xl font-semibold">{blog.title}</h3>
                      <p className="mt-2 overflow-hidden text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                        {blog.excerpt ?? "Stories from matches, community culture, and long-form strategy notes."}
                      </p>
                      <div className="mt-4">
                        <Tags tags={blog.tags} />
                      </div>
                    </Link>
                  </div>
                </SpotlightBorder>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticHover>
              <Button asChild className="rounded-full">
                <Link href="/projects">View all projects</Link>
              </Button>
            </MagneticHover>
            <MagneticHover>
              <Button
                variant="secondary"
                asChild
                className="rounded-full border border-border/70 bg-card/80 text-foreground hover:bg-card"
              >
                <Link href="/blog">View all articles</Link>
              </Button>
            </MagneticHover>
          </div>
        </>
      )}
    </section>
  )
}
