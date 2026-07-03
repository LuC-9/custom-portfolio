import type { GameEventType } from "@/lib/game/types"

export type QuestDefinition = {
  taskId: string
  eventType: GameEventType
  xp: number
  label: string
}

export const QUEST_CATALOG: QuestDefinition[] = [
  // Canonical routes (5 x 20)
  { taskId: "route:/", eventType: "page_visit", xp: 20, label: "Visit Home" },
  { taskId: "route:/projects", eventType: "page_visit", xp: 20, label: "Visit Projects" },
  { taskId: "route:/blog", eventType: "page_visit", xp: 20, label: "Visit Blog" },
  { taskId: "route:/community", eventType: "page_visit", xp: 20, label: "Visit Community" },
  { taskId: "route:/contact", eventType: "page_visit", xp: 20, label: "Visit Contact" },

  // Projects (3 x 40)
  { taskId: "project:arduino-cli-docker", eventType: "project_open", xp: 40, label: "Open Arduino CLI Docker project" },
  { taskId: "project:customizable-portfolio", eventType: "project_open", xp: 40, label: "Open customizable portfolio project" },
  { taskId: "project:merchant-management", eventType: "project_open", xp: 40, label: "Open merchant management project" },

  // Blogs (4 x 40)
  { taskId: "blog:getting-started-with-nextjs", eventType: "blog_read", xp: 40, label: "Read Next.js blog" },
  { taskId: "blog:getting-started-with-gaming-streams", eventType: "blog_read", xp: 40, label: "Read gaming streams blog" },
  { taskId: "blog:scaling_with_platform_engineering", eventType: "blog_read", xp: 40, label: "Read platform engineering blog" },
  { taskId: "blog:three-js-for-beginners", eventType: "blog_read", xp: 40, label: "Read Three.js blog" },

  // Experiences (7 x 20)
  { taskId: "experience:associate-nagarro", eventType: "experience_open", xp: 20, label: "Open Associate Nagarro experience" },
  { taskId: "experience:engineer-nagarro", eventType: "experience_open", xp: 20, label: "Open Engineer Nagarro experience" },
  { taskId: "experience:senior-engineer", eventType: "experience_open", xp: 20, label: "Open Senior Engineer experience" },
  { taskId: "experience:intern-infosys", eventType: "experience_open", xp: 20, label: "Open Infosys internship experience" },
  { taskId: "experience:community-manager", eventType: "experience_open", xp: 20, label: "Open community manager experience" },
  { taskId: "experience:content-creator", eventType: "experience_open", xp: 20, label: "Open content creator experience" },
  { taskId: "experience:pro-gamer", eventType: "experience_open", xp: 20, label: "Open pro gamer experience" },

  // Resume and chatbot
  { taskId: "resume:download", eventType: "resume_download", xp: 40, label: "Download resume" },
  { taskId: "chatbot:open", eventType: "chatbot_open", xp: 30, label: "Open chatbot" },
  { taskId: "chatbot:first-message", eventType: "chatbot_message", xp: 40, label: "Send first chatbot message" },

  // Persona view (2 x 30)
  { taskId: "persona:developer", eventType: "persona_viewed", xp: 30, label: "View developer persona" },
  { taskId: "persona:gamer", eventType: "persona_viewed", xp: 30, label: "View gamer persona" },

  // Curated external links (8 total, ~12 each -> 90 total)
  { taskId: "link:github", eventType: "link_click", xp: 12, label: "Open GitHub" },
  { taskId: "link:linkedin", eventType: "link_click", xp: 12, label: "Open LinkedIn" },
  { taskId: "link:twitter", eventType: "link_click", xp: 11, label: "Open X / Twitter" },
  { taskId: "link:leetcode", eventType: "link_click", xp: 11, label: "Open LeetCode" },
  { taskId: "link:twitch", eventType: "link_click", xp: 11, label: "Open Twitch" },
  { taskId: "link:youtube", eventType: "link_click", xp: 11, label: "Open YouTube" },
  { taskId: "link:discord", eventType: "link_click", xp: 11, label: "Open Discord" },
  { taskId: "link:email", eventType: "link_click", xp: 11, label: "Open email link" },
]

export const TOTAL_QUEST_XP = QUEST_CATALOG.reduce((total, quest) => total + quest.xp, 0)
export const TOTAL_QUEST_COUNT = QUEST_CATALOG.length

export const QUEST_BY_TASK_ID = new Map(
  QUEST_CATALOG.map((quest) => [quest.taskId.toLowerCase(), quest] as const),
)
