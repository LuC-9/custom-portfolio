import { Metadata } from "next"
import { getAllContentData } from "@/lib/content"
import { BlogClientPage } from "@/components/blog-client-page"
import { BlogFooter } from "@/components/blog-footer"

export const metadata: Metadata = {
  title: "Blogs | LuC",
  description: "Articles and insights on web development, gaming, and technology from Aarsh Mishra (LuC).",
}

export default async function BlogPage() {
  // Fetch blog posts from markdown files
  const posts = await getAllContentData("blog")

  return (
    <div className="blog-post-container">
      <div className="blog-content">
        <BlogClientPage posts={posts} />
      </div>
      <div className="blog-footer-wrapper">
        <BlogFooter />
      </div>
    </div>
  )
}

