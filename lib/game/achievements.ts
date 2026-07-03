import type { AchievementDefinition, GameStats } from "@/lib/game/types"

function meetsLevel(minLevel: number, stats: GameStats): boolean {
  return stats.level >= minLevel
}

function countTasksByPrefix(stats: GameStats, prefix: string): number {
  return stats.completedTaskIds.filter((taskId) => taskId.startsWith(prefix)).length
}

/**
 * Achievement catalog for the portfolio RPG layer.
 */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_step",
    title: "First Step",
    description: "Complete your first portfolio task.",
    tier: "common",
    icon: "Sparkles",
    condition: (stats) => stats.completedTaskIds.length >= 1,
  },
  {
    id: "route_runner",
    title: "Route Runner",
    description: "Visit all 5 core routes.",
    tier: "common",
    icon: "Map",
    condition: (stats) => countTasksByPrefix(stats, "route:") >= 5,
  },
  {
    id: "project_binge",
    title: "Project Explorer",
    description: "Open all 3 project case studies.",
    tier: "rare",
    icon: "BriefcaseBusiness",
    condition: (stats) => countTasksByPrefix(stats, "project:") >= 3,
  },
  {
    id: "blog_reader",
    title: "Blog Reader",
    description: "Read all tracked blog posts.",
    tier: "common",
    icon: "BookOpen",
    condition: (stats) => countTasksByPrefix(stats, "blog:") >= 4,
  },
  {
    id: "experience_tourer",
    title: "Experience Tourer",
    description: "Open every career and gaming experience card.",
    tier: "rare",
    icon: "ScrollText",
    condition: (stats) => countTasksByPrefix(stats, "experience:") >= 7,
  },
  {
    id: "dual_persona",
    title: "Dual Persona",
    description: "View both developer and gamer personas.",
    tier: "common",
    icon: "Shuffle",
    condition: (stats) =>
      stats.completedTaskIds.includes("persona:developer") &&
      stats.completedTaskIds.includes("persona:gamer"),
  },
  {
    id: "network_navigator",
    title: "Network Navigator",
    description: "Open all curated social links.",
    tier: "rare",
    icon: "Compass",
    condition: (stats) => countTasksByPrefix(stats, "link:") >= 8,
  },
  {
    id: "resume_scout",
    title: "Resume Scout",
    description: "Download the resume.",
    tier: "common",
    icon: "FileDown",
    condition: (stats) => stats.completedTaskIds.includes("resume:download"),
  },
  {
    id: "level_5",
    title: "Rising Talent",
    description: "Reach Level 5.",
    tier: "rare",
    icon: "TrendingUp",
    condition: (stats) => meetsLevel(5, stats),
  },
  {
    id: "level_8",
    title: "Elite Engineer",
    description: "Reach Level 8.",
    tier: "legendary",
    icon: "Rocket",
    condition: (stats) => meetsLevel(8, stats),
  },
  {
    id: "portfolio_completionist",
    title: "Portfolio Completionist",
    description: "Complete every one-and-done portfolio task.",
    tier: "legendary",
    icon: "Trophy",
    condition: (stats) => stats.completedTaskIds.length >= stats.totalQuestCount,
  },
]
