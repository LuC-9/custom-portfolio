import fs from "fs"
import path from "path"

const HOME_SKILLS_PATH = path.join(process.cwd(), "content", "home", "skills.md")

const fallbackHomeSkills = [
  "TypeScript",
  "Next.js",
  "Kubernetes",
  "Go",
  "Java",
  "Docker",
  "Postgres",
  "Node.js",
]

export function getHomeSkills(): string[] {
  try {
    const fileContents = fs.readFileSync(HOME_SKILLS_PATH, "utf8")
    const parsedSkills = fileContents
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*-\s+(.+?)\s*$/)?.[1]?.trim() ?? "")
      .filter(Boolean)

    if (parsedSkills.length > 0) {
      return parsedSkills
    }

    console.warn("[home-skills] Markdown list is empty. Using fallback skills.")
  } catch (error) {
    console.warn("[home-skills] Could not read markdown source. Using fallback skills.", error)
  }

  return fallbackHomeSkills
}
