import { getContentData, getAllContentData } from "@/lib/content"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { TableOfContentsWrapper } from "@/app/blog/[slug]/table-of-contents-wrapper"
import { BlogFooter } from "@/components/blog-footer"
import { AudioSummary } from "@/components/audio-summary"
import { Calendar, Clock } from "lucide-react"
import { BlogPostStructuredData } from './structured-data'

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
      <div className="blog-post-container">
        <div className="blog-content container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          <article className="blog-post">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-muted-foreground mb-4 md:mb-6 text-sm">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>{new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span>{post.readingTime || "5 min read"}</span>
              </div>
            </div>
            
            {/* Add Audio Summary if available */}
            {post.audioSummary && (
              <div className="mb-6 md:mb-8">
                <AudioSummary 
                  audioSrc={post.audioSummary} 
                  title="Listen it as a podcast" 
                />
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-3/4">
                <div className="prose prose-sm md:prose dark:prose-invert max-w-none" 
                     dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </div>
              
              <div className="order-first lg:order-last lg:w-1/4 mb-6 lg:mb-0">
                <div className="lg:sticky lg:top-24">
                  <TableOfContentsWrapper content={contentHtml} />
                </div>
              </div>
            </div>
          </article>
        </div>
        <div className="blog-footer-wrapper">
          <BlogFooter />
        </div>
      </div>
    </>
  )
}
