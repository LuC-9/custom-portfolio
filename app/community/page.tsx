import { Metadata } from "next"
import { CommunitySectionHeading } from "@/components/community-section-heading"
import { BlogFooter } from "@/components/blog-footer"
import ClientWrapper from "./ClientWrapper"

export const metadata: Metadata = {
  title: "Community",
  description: "Join LuC's gaming community, watch streams, and connect with fellow gamers and enthusiasts.",
  keywords: ['Aarsh Mishra', 'software developer', 'web developer', 'developer', 'portfolio', 'LuC', 'programmer', 'engineer', 'gamer', 'web developer', "Blog", "projects"],
  alternates: {
    canonical: 'https://www.byluc.in/community'
  }
  
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-grow">
        <CommunitySectionHeading />
        <ClientWrapper />
      </div>
      <BlogFooter />
    </div>
  )
}

