import { HomeContent } from "./HomeContent"
import { HomeExperienceSection } from "@/components/home-experience-section"
import {
  HomeFeaturedBlogs,
  HomeFeaturedProjects,
} from "@/components/home-featured-section"
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

/*
 * Each section below the hero is its own scroll-snap slide. The outer
 * `flex min-h-[100dvh] items-center` wrapper makes the slide take a
 * full viewport height and vertically centers whatever content the
 * inner section renders — so short sections (like a 3-card blog row)
 * don't stick to the top of the viewport when the browser snaps in.
 */
const snapSlideClass =
  "mx-auto flex min-h-[100dvh] w-full max-w-[1400px] snap-start scroll-mt-0 flex-col items-stretch justify-center px-4 py-16 md:px-6"

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

          <div className={snapSlideClass}>
            <HomeExperienceSection
              developerExperiences={developerExperiences}
              gamingExperiences={gamingExperiences}
            />
          </div>

          <div className={snapSlideClass}>
            <HomeFeaturedProjects featuredProjects={featuredProjects} />
          </div>

          <div className={snapSlideClass}>
            <HomeFeaturedBlogs featuredBlogs={featuredBlogs} />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1400px] snap-start scroll-mt-20 px-4 py-16 md:px-6">
          <Footer />
        </div>
      </main>
    </>
  )
}
