import { Metadata } from "next"
import { getAllContentData } from "@/lib/content"
import { BlogClientPage } from "@/components/blog-client-page"
import { BlogFooter } from "@/components/blog-footer"

export const metadata: Metadata = {
  title: "Blogs",
  description: "Articles and insights on web development, gaming, and technology from Aarsh Mishra (LuC).",
  keywords: ['Aarsh Mishra', 'software developer', 'web developer', 'developer', 'portfolio', 'LuC', 'programmer', 'engineer', 'gamer', 'web developer', "Blog","Blogs", "projects"],
  alternates: {
    canonical: 'https://www.byluc.in/blog'
  }
}

export default async function BlogPage() {
  const posts = await getAllContentData("blog")

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-[1400px]">
        <BlogClientPage posts={posts} />
      </div>
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 md:px-6">
        <BlogFooter />
      </div>
    </main>
  )
}

