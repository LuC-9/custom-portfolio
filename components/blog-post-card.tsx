import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { ContentThumbnail } from "@/components/content-thumbnail"

type BlogPost = {
  id: string
  title: string
  excerpt?: string
  image?: string
  /**
   * Optional URL to open when the image is clicked. When present, the
   * image is rendered as its own external link (opens in a new tab)
   * instead of inheriting the card's blog-detail link.
   */
  imageLink?: string
  /**
   * Raw markdown body. Used by ContentThumbnail as the fallback source
   * when the post has no `image` set.
   */
  content?: string
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
        className="group flex items-start gap-4 py-5 transition-colors first:pt-1 last:pb-1 hover:text-primary"
      >
        {/*
          Small square thumbnail on the left when the blog frontmatter
          includes an image. Falls back to no-thumbnail layout (title +
          meta + tags stack) when the blog has no image so nothing looks
          empty. The text column uses min-w-0 so long titles wrap
          instead of pushing the thumbnail out of the row.
        */}
        {post.image ? (
          <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-secondary/40 sm:h-24 sm:w-24">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              sizes="96px"
            />
          </div>
        ) : (
          <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border/60 sm:h-24 sm:w-24">
            <ContentThumbnail title={post.title} content={post.content} maxChars={140} />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-3">
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
        </div>
      </Link>
    )
  }

  const imageBlock = post.image ? (
    <Image
      src={post.image}
      alt={post.title}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  ) : (
    <ContentThumbnail title={post.title} content={post.content} />
  )

  return (
    <div className="group block overflow-hidden rounded-xl border border-border/60 bg-card/70">
      {/*
        If `imageLink` is set, the image / preview slot becomes its own
        external anchor (new tab). Otherwise it inherits the card's
        blog-detail link like the rest of the body. Two separate anchors
        keeps the image click target well-defined without nesting <a>.
      */}
      {post.imageLink ? (
        <a
          href={post.imageLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[4/3] overflow-hidden bg-secondary/40"
          aria-label={`${post.title} — open linked image`}
        >
          {imageBlock}
        </a>
      ) : (
        <Link
          href={`/blog/${post.id}`}
          className="relative block aspect-[4/3] overflow-hidden bg-secondary/40"
          aria-label={post.title}
        >
          {imageBlock}
        </Link>
      )}
      <Link href={`/blog/${post.id}`} className="block space-y-3 p-5 md:p-6">
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
      </Link>
    </div>
  )
}
