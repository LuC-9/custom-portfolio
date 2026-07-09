import { HomeMarqueeClient } from "@/components/home-marquee-client"
import { getHomeGames } from "@/lib/content/games"
import { getHomeSkills } from "@/lib/content/skills"

export function HomeMarquee() {
  const skills = getHomeSkills()
  const games = getHomeGames()

  return (
    <section className="w-full border-y border-border/60 bg-card/40 py-4">
      <HomeMarqueeClient developerSkills={skills} gamerGames={games} />
    </section>
  )
}
