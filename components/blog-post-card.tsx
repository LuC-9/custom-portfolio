import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

type BlogPost = {
  id: string
  title: string
  excerpt?: string
  image?: string
  date: string
  readingTime?: string
  tags?: string[]
}

type BlogPostCardProps = {
  post: BlogPost
  variant?: "featured" | "compact"
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function BlogPostCard({ post, variant = "featured" }: BlogPostCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.id}`}
        className="group block space-y-3 py-5 transition-colors first:pt-1 last:pb-1 hover:text-primary"
      >
        <h3 className="font-sans text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime || "5 min read"}
          </span>
        </div>
        {post.tags && post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.id}`} className="group block overflow-hidden rounded-xl border border-border/60 bg-card/70">
      {post.image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/40">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      ) : null}
      <div className="space-y-3 p-5 md:p-6">
        <h3 className="font-sans text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
          {post.title}
        </h3>
        {post.excerpt ? <p className="line-clamp-3 text-sm text-muted-foreground md:text-base">{post.excerpt}</p> : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime || "5 min read"}
          </span>
        </div>
      </div>
    </Link>
  )
}
