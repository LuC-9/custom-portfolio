import fs from "fs"
import path from "path"

const HOME_GAMES_PATH = path.join(process.cwd(), "content", "home", "games.md")

const fallbackHomeGames = ["VALORANT", "APEX LEGENDS", "CS2", "DOTA 2", "LIVE ON TWITCH", "COMMUNITY FIRST", "STRATEGY"]

export function getHomeGames(): string[] {
  try {
    const fileContents = fs.readFileSync(HOME_GAMES_PATH, "utf8")
    const parsedGames = fileContents
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*-\s+(.+?)\s*$/)?.[1]?.trim() ?? "")
      .filter(Boolean)

    if (parsedGames.length > 0) {
      return parsedGames
    }

    console.warn("[home-games] Markdown list is empty. Using fallback games.")
  } catch (error) {
    console.warn("[home-games] Could not read markdown source. Using fallback games.", error)
  }

  return fallbackHomeGames
}
