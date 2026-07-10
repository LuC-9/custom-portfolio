import { HomeMarqueeClient } from "@/components/home-marquee-client"
import { RevealOnView } from "@/components/motion/reveal-on-view"
import { getHomeGames } from "@/lib/content/games"
import { getHomeSkills } from "@/lib/content/skills"

export function HomeMarquee() {
  const skills = getHomeSkills()
  const games = getHomeGames()

  return (
    <RevealOnView
      as="section"
      className="w-full border-y border-border/60 bg-card/40 py-4"
      amount={0.35}
    >
      <HomeMarqueeClient developerSkills={skills} gamerGames={games} />
    </RevealOnView>
  )
}
