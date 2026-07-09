import { getContentData, getAllContentData } from "@/lib/content"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { TableOfContentsWrapper } from "@/app/blog/[slug]/table-of-contents-wrapper"
import { BlogFooter } from "@/components/blog-footer"
import { AudioSummaryWrapper } from "./audio-summary-wrapper"
import { Calendar, Clock } from "lucide-react"
import { BlogPostStructuredData } from './structured-data'
import { AiSummaryButton } from "@/components/ai-summary-button"
import { BlogReadTracker } from "./blog-read-tracker"

// Generate metadata for each blog post
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  // Await the params Promise to get the slug
  const { slug } = await params
  
  const post = await getContentData("blog", `${slug}.md`)
  
  if (!post) {
    return {
      title: "Blog Post Not Found ",
      description: "The requested blog post could not be found."
    }
  }
  
  return {
    title: `${post.title}`,
    description: post.excerpt || "Read this article on Aarsh's blog.",
    openGraph: post.image ? {
      images: [post.image]
    } : undefined
  }
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Await the params Promise to get the slug
  const { slug } = await params
  
  const post = await getContentData("blog", `${slug}.md`)
  
  if (!post) {
    notFound()
  }
  
  const { contentHtml } = post

  return (
    <>
      <BlogPostStructuredData
        title={post.title}
        description={post.excerpt || "Read this article on Aarsh's blog."}
        date={post.date}
        author="Aarsh Mishra"
        slug={slug}
        image={post.image}
      />
      <BlogReadTracker slug={slug} title={post.title} />
      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-20 pt-28 md:px-6 lg:pt-32">
          <article>
            <header className="mx-auto max-w-[65ch] space-y-5">
              <h1 className="font-sans text-4xl font-extrabold tracking-tighter md:text-6xl">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readingTime || "5 min read"}
                </span>
              </div>
            </header>

            <div className="mx-auto mt-8 max-w-[65ch] space-y-5">
              {post.audioSummary && (
                <AudioSummaryWrapper 
                  audioSrc={post.audioSummary} 
                  title="Listen as audio" 
                />
              )}
              <AiSummaryButton title={post.title} content={contentHtml} />
              <div className="xl:hidden">
                <TableOfContentsWrapper content={contentHtml} />
              </div>
            </div>

            <div className="mt-10 grid gap-10 xl:grid-cols-12">
              <div className="xl:col-span-9">
                <div
                  className="prose prose-sm dark:prose-invert mx-auto max-w-[65ch] leading-relaxed md:prose-base"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>
              <aside className="hidden xl:col-span-3 xl:block">
                <div className="sticky top-24">
                  <TableOfContentsWrapper content={contentHtml} />
                </div>
              </aside>
            </div>
          </article>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 md:px-6">
          <BlogFooter />
        </div>
      </main>
    </>
  )
}
