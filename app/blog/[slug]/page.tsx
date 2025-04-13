import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Tag, Share2 } from "lucide-react"
import { getContentItem, getAllContentData } from "@/lib/content"
import { BlogFooter } from "@/components/blog-footer"
import { TableOfContentsWrapper } from "./table-of-contents-wrapper"
import { AudioSummary } from "@/components/audio-summary"
import { formatDate } from "@/lib/utils"

// Dynamic metadata for blog posts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getContentItem("blog", slug)
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }
  
  return {
    title: post.title,
    description: post.excerpt || "Read this article on LuC's blog.",
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllContentData("blog")
  return posts.map((post: any) => ({
    slug: post.id,
  }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Await the params before accessing the slug property
  const { slug } = await params
  
  // Fetch the specific blog post
  const post = await getContentItem("blog", slug)

  if (!post) {
    notFound()
  }

  const contentHtml = post.contentHtml || post.content;

  return (
    <>
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </div>
        
        {/* Add featured image if available */}
        {post.image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
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
      
      <BlogFooter />
    </>
  )
}






























