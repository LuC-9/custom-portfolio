import { HomeContent } from "./HomeContent"
import { HomeExperienceSection } from "@/components/home-experience-section"
import { HomeFeaturedSection } from "@/components/home-featured-section"
import { Footer } from "@/components/footer"
import { getAllContentData, getExperiences } from "@/lib/content"
import { getHomeGames } from "@/lib/content/games"
import { getHomeSkills } from "@/lib/content/skills"
import { Metadata } from "next"
import { PersonStructuredData, WebsiteStructuredData } from './structured-data'

export const metadata: Metadata = {
  title: 'Aarsh Mishra | Software Developer & Gaming Enthusiast (LuC)',
  description: 'Official portfolio of Aarsh Mishra, software developer and web engineer. View projects, experience, and contact information.',
  keywords: ['Aarsh Mishra', 'software developer', 'web developer', 'developer', 'portfolio', 'LuC', 'programmer', 'engineer', 'gamer', 'web developer', "Blog", "projects"],
  alternates: {
    canonical: 'https://www.byluc.in'
  },
  openGraph: {
    images: ['/profile.jpg']
  }
}

export default async function Home() {
  const developerExperiences = await getExperiences()
  const gamingExperiences = await getExperiences('gaming-experience')
  const projects = await getAllContentData("projects")
  const blogs = await getAllContentData("blog")
  const developerSkills = getHomeSkills()
  const gamerGames = getHomeGames()

  const featuredProjects = projects.filter(project => project.featured === true)
  const featuredBlogs = blogs.filter(blog => blog.featured === true)

  return (
    <>
      <PersonStructuredData />
      <WebsiteStructuredData />
      <main className="flex flex-col min-h-screen">
        <div className="flex-1">
          <HomeContent developerSkills={developerSkills} gamerGames={gamerGames} />

          <div className="mx-auto mt-24 w-full max-w-[1400px] snap-start scroll-mt-20 px-4 md:px-6">
            <HomeExperienceSection
              developerExperiences={developerExperiences}
              gamingExperiences={gamingExperiences}
            />
          </div>

          <div className="mx-auto mt-24 w-full max-w-[1400px] snap-start scroll-mt-20 px-4 md:px-6">
            <HomeFeaturedSection
              featuredProjects={featuredProjects}
              featuredBlogs={featuredBlogs}
            />
          </div>
        </div>
        <div className="mx-auto mt-24 w-full max-w-[1400px] snap-start scroll-mt-20 px-4 md:px-6">
          <Footer />
        </div>
      </main>
    </>
  )
}
