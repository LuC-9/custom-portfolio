import { getContentData, getAllContentData } from "@/lib/content"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { TableOfContentsWrapper } from "@/app/blog/[slug]/table-of-contents-wrapper"
import { BlogFooter } from "@/components/blog-footer"
import { AudioSummary } from "@/components/audio-summary"
import { Calendar, Clock } from "lucide-react"

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
    <div className="blog-post-container">
      <div className="blog-content container mx-auto px-4 py-12 max-w-4xl">
        <article className="blog-post">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readingTime || "5 min read"}</span>
            </div>
          </div>
          
          {/* Add Audio Summary if available */}
          {post.audioSummary && (
            <div className="mb-8">
              <AudioSummary 
                audioSrc={post.audioSummary} 
                title="Listen it as a podcast" 
              />
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <div className="prose dark:prose-invert max-w-none" 
                   dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
            
            <div className="md:w-1/4">
              <TableOfContentsWrapper content={contentHtml} />
            </div>
          </div>
        </article>
      </div>
      <div className="blog-footer-wrapper">
        <BlogFooter />
      </div>
    </div>
  )
}
