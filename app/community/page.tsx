import { Metadata } from "next"
import { CommunitySectionHeading } from "@/components/community-section-heading"
import { BlogFooter } from "@/components/blog-footer"
import ClientWrapper from "./ClientWrapper"

export const metadata: Metadata = {
  title: "Community",
  description: "Join LuC's gaming community, watch streams, and connect with fellow gamers and enthusiasts.",
  keywords: ['Aarsh Mishra', 'discord', 'community', 'gaming', 'streaming', 'twitch', 'youtube', 'software developer', 'web developer', 'developer', 'portfolio', 'LuC', 'programmer', 'engineer', 'gamer', 'web developer', "Blog", "projects"],
  alternates: {
    canonical: 'https://www.byluc.in/community'
  }
  
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-[1400px] flex-grow px-4 pb-16 pt-28 md:px-6 lg:pt-32">
        <CommunitySectionHeading />
        <div className="mt-10">
          <ClientWrapper />
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 md:px-6">
        <BlogFooter />
      </div>
    </div>
  )
}

