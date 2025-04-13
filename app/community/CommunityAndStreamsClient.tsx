"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Trophy, Calendar, Gamepad2, Twitch, Youtube } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { usePersona } from "@/contexts/persona-context"

export default function CommunityAndStreamsClient() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("community")
  const { persona, setPersona, isGamer } = usePersona()
  
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

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="streams">Streams</TabsTrigger>
          </TabsList>
          
          {/* Community Tab Content */}
          <TabsContent value="community">
            <div className="grid gap-8">
              {/* Join Discord Section */}
              <div className="bg-secondary/30 rounded-lg p-8 text-center">
                <Users className="mx-auto mb-4 text-primary" size={48} />
                <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
                <p className="text-muted-foreground mb-6">
                  Connect with fellow gamers, participate in tournaments, and stay updated with the latest gaming news.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="rounded-full">
                    <MessageSquare className="mr-2" size={16} />
                    <Link 
                      href="https://discord.gg/Sd8Uq73FeK" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Join Discord
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center">
                    <Users className="mr-2 text-primary" size={20} />
                    Community Events
                  </h3>
                  <ul className="space-y-3">
                    {["Weekly Game Night", "Monthly Tournament", "Charity Stream", "Game Release Party"].map(
                      (event, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                          {event}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="bg-card rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center">
                    <Trophy className="mr-2 text-primary" size={20} />
                    Leaderboard
                  </h3>
                  <ul className="space-y-3">
                    {["Player1 - 1200 pts", "Player2 - 980 pts", "Player3 - 875 pts", "Player4 - 750 pts"].map(
                      (player, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-5 text-primary font-bold mr-2">#{i + 1}</span>
                          {player}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="bg-card rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center">
                    <MessageSquare className="mr-2 text-primary" size={20} />
                    Discord Channels
                  </h3>
                  <ul className="space-y-3">
                    {["#general", "#strategy-games", "#fps-games", "#tournaments", "#tech-talk"].map((channel, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-primary mr-2">#</span>
                        {channel.substring(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Streams Tab Content */}
          <TabsContent value="streams">
            <div className="grid gap-8">
              <div className="bg-secondary/30 rounded-lg p-8 text-center">
                <Youtube className="mx-auto mb-4 text-primary" size={48} />
                <h2 className="text-2xl font-bold mb-4">YouTube</h2>
                <p className="text-muted-foreground mb-6">
                  Join me live on Youtube where I stream strategy games and FPS gameplay.
                </p>
                <Button className="rounded-full">
                  <Youtube className="mr-2" size={16} />
                  <Link 
                    href="https://www.youtube.com/@LuC-Throws" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Subscribe on Youtube
                  </Link>
                </Button>
              </div>

              <div className="bg-secondary/30 rounded-lg p-8 text-center">
                <Twitch className="mx-auto mb-4 text-primary" size={48} />
                <h2 className="text-2xl font-bold mb-4">Twitch</h2>
                <p className="text-muted-foreground mb-6">
                  Catch my live streams on Twitch for exclusive content, chat interaction, and gaming sessions.
                </p>
                <Button className="rounded-full">
                  <Twitch className="mr-2" size={16} />
                  <Link 
                    href="https://www.twitch.tv/xrshluc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Follow on Twitch
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
