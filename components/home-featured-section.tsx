"use client"

import Image from "next/image"
import Link from "next/link"
import { Twitch, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePersona } from "@/contexts/persona-context"
import { formatDate } from "@/lib/utils"
import { RevealStagger } from "@/components/motion/reveal-stagger"
import { SpotlightBorder } from "@/components/motion/spotlight-border"
import { MagneticHover } from "@/components/motion/magnetic-hover"

type ProjectItem = {
  id: string
  title: string
  description?: string
  image?: string
  tags?: string[]
  demo?: string
}

type BlogItem = {
  id: string
  title: string
  date: string
  excerpt?: string
  image?: string
  tags?: string[]
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
    Icon: Twitch,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@LuC-Throws",
    cta: "Subscribe on YouTube",
    pitch: "Guides, VOD highlights, and tactical breakdowns from recent streams.",
    Icon: Youtube,
  },
]

function getDeveloperSpanClass(index: number, total: number) {
  if (total < 4) return ""
  const spanMap = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-2",
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

  const developerCells: FeaturedCell[] = [
    projects[0] ? { kind: "project", item: projects[0] } : null,
    blogs[0] ? { kind: "blog", item: blogs[0] } : null,
    projects[1] ? { kind: "project", item: projects[1] } : null,
    blogs[1] ? { kind: "blog", item: blogs[1] } : null,
    projects[2] ? { kind: "project", item: projects[2] } : null,
    blogs[2] ? { kind: "blog", item: blogs[2] } : null,
  ].filter(Boolean) as FeaturedCell[]

  const gamerBlogs = blogs.slice(0, 3)

  return (
    <section>
      {isDeveloper ? (
        <>
          <RevealStagger
            as="div"
            className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(280px,1fr)] md:grid-flow-dense"
            staggerMs={35}
            amount={0.05}
          >
            {developerCells.map((cell, index) => (
              <div key={`${cell.kind}-${cell.item.id}`} className={getDeveloperSpanClass(index, developerCells.length)}>
                <SpotlightBorder className="h-full overflow-hidden rounded-xl">
                  {cell.kind === "project" ? (
                    <Link href={cell.item.demo ?? "/projects"} className="flex h-full flex-col bg-card/60 p-4">
                      {cell.item.image ? (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                          <Image
                            src={cell.item.image}
                            alt={cell.item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <h3 className="font-sans text-xl font-semibold">{cell.item.title}</h3>
                      <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                        {cell.item.description ?? "Built for speed, reliability, and meaningful user outcomes."}
                      </p>
                      <div className="mt-4">
                        <Tags tags={cell.item.tags} />
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/blog/${cell.item.id}`} className="flex h-full flex-col bg-card/60 p-4">
                      {cell.item.image ? (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                          <Image
                            src={cell.item.image}
                            alt={cell.item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <p className="font-mono text-xs text-muted-foreground">{formatDate(cell.item.date)}</p>
                      <h3 className="mt-2 font-sans text-xl font-semibold">{cell.item.title}</h3>
                      <p className="mt-2 overflow-hidden text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                        {cell.item.excerpt ?? "A practical take on engineering, systems, and shipping better software."}
                      </p>
                      <div className="mt-4">
                        <Tags tags={cell.item.tags} />
                      </div>
                    </Link>
                  )}
                </SpotlightBorder>
              </div>
            ))}
          </RevealStagger>

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
          <RevealStagger
            as="div"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[minmax(240px,1fr)] md:grid-flow-dense"
            staggerMs={35}
            amount={0.05}
          >
            {streamCards.map(({ id, label, href, cta, pitch, Icon }) => (
              <div key={id} className="md:row-span-2">
                <SpotlightBorder className="h-full rounded-xl">
                  <div className="flex h-full flex-col justify-between bg-card/60 p-6">
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
                </SpotlightBorder>
              </div>
            ))}

            {gamerBlogs.map((blog) => (
              <div key={blog.id}>
                <SpotlightBorder className="h-full rounded-xl">
                  <Link href={`/blog/${blog.id}`} className="flex h-full flex-col bg-card/60 p-4">
                    {blog.image ? (
                      <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <p className="font-mono text-xs text-muted-foreground">{formatDate(blog.date)}</p>
                    <h3 className="mt-2 font-sans text-xl font-semibold">{blog.title}</h3>
                    <p className="mt-2 overflow-hidden text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {blog.excerpt ?? "Stories from matches, community culture, and long-form strategy notes."}
                    </p>
                    <div className="mt-4">
                      <Tags tags={blog.tags} />
                    </div>
                  </Link>
                </SpotlightBorder>
              </div>
            ))}
          </RevealStagger>

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
