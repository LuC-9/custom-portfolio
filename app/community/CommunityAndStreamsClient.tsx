"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, Twitch, Youtube, RadioTower, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { usePersona } from "@/contexts/persona-context"
import { MagneticHover } from "@/components/motion/magnetic-hover"

export default function CommunityAndStreamsClient() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("community")
  const { setPersona, isGamer } = usePersona()
  
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "streams") {
      setActiveTab("streams")
    }
    
    // Switch to gamer persona if not already active
    if (!isGamer) {
      setPersona("gamer")
    }
  }, [searchParams, isGamer, setPersona])

  const handleTabChange = (nextTab: string) => {
    setActiveTab(nextTab)
    router.replace(nextTab === "streams" ? `${pathname}?tab=streams` : pathname, { scroll: false })
  }

  return (
    <div className="flex-1">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-8">
        <TabsList className="inline-flex w-auto rounded-full border border-border/60 bg-card/40 p-1">
          <TabsTrigger value="community" className="rounded-full px-5">Community</TabsTrigger>
          <TabsTrigger value="streams" className="rounded-full px-5">Streams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="community" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-5">
            <section className="space-y-5 rounded-xl border border-border/60 bg-card/50 p-6 lg:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-primary" />
                Featured
              </div>
              <h2 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">Join the Discord hub</h2>
              <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                Find stream updates, gaming discussions, and community events in one place.
              </p>
              <MagneticHover>
                <Button className="rounded-full" asChild>
                  <Link href="https://discord.gg/Sd8Uq73FeK" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Join Discord
                  </Link>
                </Button>
              </MagneticHover>
            </section>

            <aside className="space-y-4 lg:col-span-2">
              <article className="rounded-xl border border-border/60 bg-card/50 p-5">
                <h3 className="font-sans text-xl font-semibold tracking-tight">YouTube community</h3>
                <p className="mt-2 text-sm text-muted-foreground">Upload recaps, clips, and long-form streams.</p>
                <MagneticHover>
                  <Button variant="outline" className="mt-4 w-full rounded-full" asChild>
                    <Link href="https://www.youtube.com/@LuC-Throws" target="_blank" rel="noopener noreferrer">
                      <Youtube className="mr-2 h-4 w-4" />
                      Subscribe on YouTube
                    </Link>
                  </Button>
                </MagneticHover>
              </article>

              <article className="rounded-xl border border-border/60 bg-card/50 p-5">
                <h3 className="font-sans text-xl font-semibold tracking-tight">Upcoming streams</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Weekend squad queue</li>
                  <li className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Midweek strategy lab</li>
                  <li className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Community challenge night</li>
                </ul>
              </article>
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="streams" className="mt-0">
          <div className="grid gap-6 lg:grid-cols-5">
            <section className="space-y-5 rounded-xl border border-border/60 bg-card/50 p-6 lg:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <RadioTower className="h-3.5 w-3.5 text-primary" />
                Live channels
              </div>
              <h2 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">Catch streams on Twitch</h2>
              <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                Follow for livestream alerts, FPS sessions, and strategy breakdowns.
              </p>
              <MagneticHover>
                <Button className="rounded-full" asChild>
                  <Link href="https://www.twitch.tv/xrshluc" target="_blank" rel="noopener noreferrer">
                    <Twitch className="mr-2 h-4 w-4" />
                    Follow on Twitch
                  </Link>
                </Button>
              </MagneticHover>
            </section>

            <aside className="space-y-4 lg:col-span-2">
              <article className="rounded-xl border border-border/60 bg-card/50 p-5">
                <h3 className="font-sans text-xl font-semibold tracking-tight">YouTube livestream archive</h3>
                <p className="mt-2 text-sm text-muted-foreground">Watch vods and highlights from recent sessions.</p>
                <MagneticHover>
                  <Button variant="outline" className="mt-4 w-full rounded-full" asChild>
                    <Link href="https://www.youtube.com/@LuC-Throws" target="_blank" rel="noopener noreferrer">
                      <Youtube className="mr-2 h-4 w-4" />
                      Open YouTube channel
                    </Link>
                  </Button>
                </MagneticHover>
              </article>

              <article className="rounded-xl border border-border/60 bg-card/50 p-5">
                <h3 className="font-sans text-xl font-semibold tracking-tight">Stream cadence</h3>
                <p className="mt-2 text-sm text-muted-foreground">Evenings and weekends, announced in Discord before going live.</p>
              </article>
            </aside>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
